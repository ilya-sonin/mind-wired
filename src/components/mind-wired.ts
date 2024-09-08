import { EVENT, parseEvent } from "../service/event-bus";
import { CanvasUI } from "./canvas-ui";
import { EdgeContext } from "./edge";
import { NodeUI } from "./node/node-ui";
import { NodeLayoutContext, installDefaultLayoutManagers } from "./layout";
import {
  NodeEditingContext,
  installDefaultEditors,
} from "./node/node-editing-context";
import { INodeRenderer } from "./node";
import { RenderingDelegate } from "./node/renderer/renderer-delegate";
import { AlignmentContext } from "./alignment";
import TreeDataSource from "./datasource/tree-ds";
import { DragContext, type Capture } from "./drag-context";
import type { Configuration } from "./config";
import {
  installDefaultRenderers,
  NodeRenderingContext,
} from "./node/node-rendering-context";
import {
  EdgeSpec,
  ModelSpec,
  NodeLayout,
  NodeSpec,
  SchemaSpec,
  ViewSpec,
} from "./node/node-type";
import { NodeSelectionModel } from "./selection";
import {
  DataSourceFactory,
  DatasourceOptionalParam,
  KeyExtractor,
} from "./datasource";
import { IEdgeRenderer } from "./edge/edge-renderer-type";
import type {
  NodeDragEvent,
  NodeDragEventArg,
  NodeEditingArg,
  NodeEvent,
  NodeEventArg,
  ViewportDragEvent,
  ViewportDragEventArg,
  ViewportEvent,
} from "../mindwired-event";
import { SchemaContext, SchemaUtil } from "./node/schema-context";
import { ExportContext, type ExportParam, type ExportResponse } from "./export";
import { INodeLayoutManager } from "./layout/node-layout-manager";
import { installDefaultEdgeRenderers } from "./edge/edge-context";
import clone from "@/service/clone";

const exportTree = (config: Configuration, nodeUI: NodeUI): NodeSpec => {
  const v: ViewSpec = nodeUI.spec.view;
  const view: ViewSpec = {
    x: v.x,
    y: v.y,
    layout: undefined,
    folding: undefined,
    style: undefined
  };
  // 1.2345... => 1.2
  const root = nodeUI.isRoot();
  let x = root ? config.ui.offset.x : v.x;
  let y = root ? config.ui.offset.y : v.y;
  view.x = Math.floor(10 * x) / 10;
  view.y = Math.floor(10 * y) / 10;

  if (v.layout) {
    view.layout = v.layout;
  }
  if (v.edge) {
    view.edge = v.edge;
  }
  if (v.folding) {
    view.folding = true;
  }
  if (v.style) {
    view.style = v.style
  }
  const subs: NodeSpec[] = [];
  nodeUI.subs.forEach((childUI) => {
    subs.push(exportTree(config, childUI));
  });
  return {
    model: nodeUI.model,
    view: view,
    subs: subs.length > 0 ? subs : undefined,
  };
};
const repaintTree = (mwd: MindWired, node: NodeUI, propagate = true) => {
  node.repaint();
  if (propagate) {
    node.subs.forEach((childNode: NodeUI) => {
      repaintTree(mwd, childNode);
    });
  }
  if (node.isFolded()) {
    mwd.setFoldingState([node], true);
  }
};
const updateLevelClass = (
  nodeUI: NodeUI,
  method: "add" | "remove",
  config: Configuration
) => {
  const className = config.nodeLevelClassName(nodeUI);
  config.dom.clazz[method](nodeUI.$bodyEl, className);
  nodeUI.subs.forEach((childUI) => updateLevelClass(childUI, method, config));
};
const mergeEdgeSpec = (src: EdgeSpec, dst: EdgeSpec): EdgeSpec => {
  if (!dst) {
    return src;
  }
  clone.mergeLeaf(src, dst);
  return dst;
};
export class MindWired {
  config: Configuration;
  canvas: CanvasUI;
  nodeRenderingContext: NodeRenderingContext;
  nodeSelectionModel: NodeSelectionModel;
  private _nodeLayoutContext: NodeLayoutContext;
  nodeEditingContext: NodeEditingContext;
  private _alignmentContext: AlignmentContext;
  dragContext: DragContext;
  private _edgeContext: EdgeContext;
  rootUI: NodeUI;
  private _dsFactory: DataSourceFactory;
  private _schemaContext: SchemaContext;
  /**
   *
   * @param {Configuration} config
   */
  constructor(config: Configuration) {
    this.config = config;
    config.mindWired = () => this;

    this.canvas = new CanvasUI(config);
    config.getCanvas = () => this.canvas;

    this._dsFactory = new DataSourceFactory();
    config.getNodeRenderer = () => this.nodeRenderingContext;

    this.nodeSelectionModel = new NodeSelectionModel(config);
    this._nodeLayoutContext = new NodeLayoutContext(config);
    installDefaultLayoutManagers(this._nodeLayoutContext);

    this.nodeRenderingContext = new NodeRenderingContext(
      this.canvas,
      this._dsFactory
    );
    installDefaultRenderers(this.nodeRenderingContext);

    this.nodeEditingContext = new NodeEditingContext(
      this.canvas,
      this._dsFactory
    );
    installDefaultEditors(this.nodeEditingContext);

    this._alignmentContext = new AlignmentContext(config);
    this.dragContext = new DragContext();
    this._edgeContext = new EdgeContext(config, this.canvas);
    installDefaultEdgeRenderers(this._edgeContext);

    this._schemaContext = new SchemaContext(config);
    this._schemaContext.subscribe((e) => {
      if (e.detail) {
        const { detail } = e;
        setTimeout(() => {
          this._edgeContext.repaint(true);
          const { type } = detail;
          const eventType =
            type === "create"
              ? "CREATED"
              : type === "update"
              ? "UPDATED"
              : "DELETED";
          this.config.emit(EVENT.SCHEMA[eventType].CLIENT, detail);
        });
      }
    });

    this.config
      .listen(EVENT.DRAG.VIEWPORT, (e: ViewportDragEventArg) => {
        this.config.setOffset(e.offset);
        this.canvas.repaintNodeHolder();
        this._edgeContext.repaint();
        if (e.state === "done") {
          this.rootUI.setPos(e.offset.x, e.offset.y, false);
          try {
            this.config.emit(EVENT.NODE.UPDATED.CLIENT, {
              nodes: [this.rootUI],
              type: "pos",
            });
          } finally {
            this.rootUI.setPos(0, 0);
          }
        }
      })
      .listen(EVENT.DRAG.NODE, (e: NodeDragEventArg) => {
        if (e.state === "ready") {
          const nodes = this.nodeSelectionModel.getNodes();
          /*
           * shift@click on nodes redirects dragging to their children
           */
          const dragTargets =
            e.target === "all" ? nodes : nodes.flatMap((node) => node.subs);
          // this.draggingNodes = capatureDragData(dragTargets);
          this.dragContext.prepareCaptures(dragTargets);
          this._alignmentContext.turnOn(this.rootUI, dragTargets);
          this.canvas.updateSelection(nodes);
        } else if (e.state === "drag") {
          const acceleration = e.target === "all" ? 1 : 2.5;
          this.dragContext.eachCapture((capture: Capture) => {
            const { node, dir, pos } = capture;
            dir.capture();
            node.setPos(
              acceleration * e.x + pos.x,
              acceleration * e.y + pos.y,
              !this.config.snapEnabled
            );
          });
          this._alignmentContext.doAlign();
          this.dragContext.eachCapture((capture: Capture) => {
            const { node, dir } = capture;
            this._nodeLayoutContext.layout(node, {
              dir,
            });
          });
          this.canvas.updateSelection(this.nodeSelectionModel.getNodes());
          this._edgeContext.repaint(!this.config.snapEnabled);
        } else if (e.state === "done") {
          this._alignmentContext.turnOff();
          this._edgeContext.repaint(true);
          const nodes = this.dragContext.getUpdatedNodes();
          if (nodes.length > 0) {
            this.config.emit(EVENT.NODE.UPDATED.CLIENT, {
              nodes,
              type: "pos",
            });
          } else {
            const nodes = this.nodeSelectionModel.getNodes();
            this.config.emit(EVENT.NODE.CLICKED.CLIENT, {
              nodes,
              type: "click",
            });
          }
          this.dragContext.clear();
        }
      })
      .listen(EVENT.NODE.EDITING, ({ editing, node }: NodeEditingArg) => {
        // console.log("[edit]", nodeUI);
        if (editing) {
          this.nodeEditingContext.edit(node);
        } else {
          this.nodeEditingContext.close();
        }
      })
      .listen(EVENT.NODE.UPDATED, ({ nodes }: NodeEventArg) => {
        nodes.forEach((node) => node.repaint());
        this._edgeContext.repaint();
        this.config.emit(EVENT.NODE.UPDATED.CLIENT, { nodes, type: "model" });
      });
  }
  getAligmentContext() {
    return this._alignmentContext;
  }
  /**
   *
   * @param dataSourceId unique id for datasource
   * @param keyExtractor provides unique id for each items in the datasource
   * @param param - used for mapping (data source, node renderer)
   * @returns
   */
  createDataSource<T, K>(
    dataSourceId: string,
    keyExtractor: KeyExtractor<T, K>,
    param?: DatasourceOptionalParam<T>
  ) {
    const ds = this._dsFactory.createDataSource(dataSourceId, keyExtractor);
    if (param) {
      const { renderer, editor } = param;
      if (renderer) {
        this.nodeRenderingContext.registerCustomRender(renderer);
        this._dsFactory.bindRendererMapping(ds, renderer.name);
      }
      if (editor) {
        this.nodeEditingContext.registerCustomEditor(editor);
        this._dsFactory.bindEditorMapping(ds, editor.name);
      }
    }
    return ds;
  }
  isEditing() {
    return this.nodeEditingContext.isEditing();
  }
  private _dispose() {
    this.nodeRenderingContext.dispose();
    this.nodeEditingContext.dispose();
    this._dsFactory.clear();
    this._edgeContext.dispose();
    this._alignmentContext.turnOff();
    this.dragContext.clear();
    this.canvas.unregisterNodeTree(this.rootUI);
  }
  nodes(elems: NodeSpec) {
    if (this.rootUI) {
      this._dispose();
    }
    if (elems instanceof TreeDataSource) {
      const root = elems.build();
      this.rootUI = NodeUI.build(root, this.config);
    } else if (elems) {
      this.rootUI = NodeUI.build(elems, this.config);
    }
    this._edgeContext.setRootNode(this.rootUI);
    this.config.ui.offset.x = this.rootUI.spec.view.x;
    this.config.ui.offset.y = this.rootUI.spec.view.y;
    this.rootUI.spec.view.x = 0;
    this.rootUI.spec.view.y = 0;

    this.repaint();
    return this;
  }
  findNode(predicate: (node: NodeUI) => boolean) {
    return this.rootUI.find(predicate);
  }
  addNode(
    parentNode: NodeUI,
    nodeData: NodeSpec,
    option?: { siblingNode: NodeUI }
  ) {
    const data: NodeSpec = {
      root: false,
      model: nodeData.model,
      view: nodeData.view,
    };
    if (!data.view) {
      data.view = {
        x: 0,
        y: 0,
      };
    }
    const lastChild = parentNode.lastChild();
    const nodeUI = new NodeUI(data, this.config, parentNode);
    this.canvas.regsiterNode(nodeUI);
    parentNode.addChild(nodeUI);
    nodeUI.repaint();

    this._nodeLayoutContext.setPosition(nodeUI, {
      baseNode: lastChild,
      offset: 60,
    });

    this._edgeContext.addEdge(nodeUI.parent, nodeUI);
    this.config.emit(EVENT.NODE.CREATED.CLIENT, {
      nodes: [nodeUI],
      type: "create",
    });
    return nodeUI;
    // FIXME 노드 생성 후 곧바로 편집 모드 전환하려는 코드인데 현재는 작동하지 않음.
    // if (option && (option.editing || option.select)) {
    //   this.config.emit(EVENT.NODE.SELECTED, {
    //     node: nodeUI,
    //     append: false,
    //   });
    // }
    // if (option && option.editing) {
    //   this.nodeEditingContext.edit(nodeUI);
    // }
  }
  /**
   *
   * @param parentNode new parent of the given nodes
   * @param nodes nodes whoses parent is changed
   * @param trigger if true, event 'node.updated' is triggered
   */
  moveNodes(parentNode: NodeUI, nodes: NodeUI[], trigger: boolean = false) {
    const childNodes = nodes.filter((node) => node.parent !== parentNode);
    childNodes.forEach((child) => {
      updateLevelClass(child, "remove", this.config);
      const prevParent = parentNode.addChild(child);
      updateLevelClass(child, "add", this.config);

      this.config.emit(EVENT.NODE.MOVED, { node: child, prevParent });
    });
    parentNode.setFolding(false);
    repaintTree(this, parentNode);
    this.canvas.updateSelection(nodes);
    if (trigger) {
      this.config.emit(EVENT.NODE.UPDATED.CLIENT, {
        nodes: childNodes,
        type: "path",
      });
    }
  }
  deleteNodes(nodes: NodeUI[]) {
    const updated: NodeUI[] = [];
    const deleted: NodeUI[] = [];
    nodes.forEach((node) => {
      /**
       * delete [N1]
       * ```
       *  parent
       *   +- N0
       *   +- N1 (delete)
       *       +- C0 +- ...
       *       +- C1 +- ...
       * ```
       * ```
       *  parent
       *   +- N0
       *   +- C0 +- ...
       *   +- C1 +- ...
       * ```
       */
      const { parent, childNodes } = node;
      if (childNodes.length > 0) {
        // 1. move node.children to node.parent
        childNodes.forEach((child) => {
          // keep position
          child.setPos(child.x + node.x, child.y + node.y);
        });
        this.moveNodes(parent, childNodes);
        // child node can be in deleted nodes
        updated.push(...childNodes.filter((c) => !nodes.includes(c)));
      }
      // 2. delete node(which has no children)
      const deletedChild = node.parent.removeChild(node);
      if (deletedChild) {
        this.canvas.unregisterNode(deletedChild);
        deleted.push(node);
      }
    });
    if (updated.length > 0) {
      this.config.emit(EVENT.NODE.UPDATED.CLIENT, {
        nodes: updated,
        type: "path",
      });
    }
    if (deleted.length > 0) {
      this._edgeContext.deleteEdges(deleted);
      this.config.emit(EVENT.NODE.DELETED2.CLIENT, {
        nodes: deleted,
        updated,
        type: "delete",
      });
    }
  }
  getNodeSelectionModel() {
    return this.nodeSelectionModel;
  }
  getSelectedNodes() {
    return this.nodeSelectionModel.getNodes();
  }
  setLayout(layoutSpec: NodeLayout | undefined, nodeUI: NodeUI) {
    const targetNode = nodeUI || this.rootUI;
    if (layoutSpec) {
      targetNode.spec.view.layout = layoutSpec;
    } else {
      delete targetNode.spec.view.layout;
    }
    this.repaint();
  }
  setEdge(edgeSpec: EdgeSpec | undefined, nodeUI?: NodeUI) {
    const targetNode = nodeUI || this.rootUI;
    if (edgeSpec) {
      targetNode.spec.view.edge = mergeEdgeSpec(
        edgeSpec,
        targetNode.spec.view.edge
      );
    } else {
      delete targetNode.spec.view.edge;
    }
    this.repaint(nodeUI);
  }
  setScale(scale: number) {
    this.config.ui.scale = scale;
    this.repaint();
  }
  /**
   * update  visibilityof of the given node's children
   * @param nodes
   * @param folding if true(false), children of the node are hidden(visible).
   */
  setFoldingState(nodes: NodeUI[], folding: boolean) {
    const updatedNodes = nodes.filter((node) => {
      const changed = node.setFolding(folding);
      this.canvas.updateFoldingNodes(node);
      this._edgeContext.setEdgeVisible(node, !folding, false);
      return changed;
    });
    this._edgeContext.repaint();
    this.config.emit(EVENT.NODE.UPDATED.CLIENT, {
      type: "folding",
      nodes: updatedNodes,
    });
  }
  repaint(nodeUI?: NodeUI) {
    nodeUI = nodeUI || this.rootUI;
    repaintTree(this, nodeUI);
    this.canvas.repaintNodeHolder();
    this._nodeLayoutContext.layout(nodeUI, { dir: undefined });
    this._edgeContext.repaint();

    this.canvas.clearNodeSelection();
    this.canvas.updateSelection(this.getSelectedNodes());
  }
  listen<A = any>(eventName: string, callback: (arg: A) => void) {
    const event = parseEvent(`${eventName}.client`);
    this.config.ebus.listen(event, callback);
    return this;
  }
  /**
   * register event listener
   * @template A detail type of mind-wired event
   * @param event
   * @param callback
   * @returns
   * @example
   * mwd.listenStrict(EVENT.NODE.CREATED, (e:NodeEventArg) => {
   *  const {type, nodes} = e // type: 'create', nodes: [NodeUI]
   * })
   *
   * @example
   * mwd.listenStrict(EVENT.NODE.EDITING, (e:NodeEditingArg) => {
   *  const {node, editing} = e // node: NodeUI, editing:boolean
   *   if(editing) {
   *     // editing state in on
   *   } else {
   *     // editing state is off
   *   }
   * })
   */
  listenStrict<A>(
    event:
      | NodeEvent<A>
      | ViewportEvent<A>
      | ViewportDragEvent<A>
      | NodeDragEvent<A>,
    callback: (arg: A) => void
  ) {
    if (event === EVENT.NODE.DELETED) {
      event = EVENT.NODE.DELETED2;
    }
    const e = event.CLIENT || event;
    this.config.ebus.listen(e, callback);
    return this;
  }
  getNodeRender(model: ModelSpec): INodeRenderer {
    return this.nodeRenderingContext.getRendererByModel(model);
  }
  /**
   * returns all node renderers
   * @returns all node renderers
   */
  listNodeRenderers(): INodeRenderer[] {
    const renderers = this.nodeRenderingContext.listRenderers();
    return renderers;
  }
  /**
   * return all edge renderers
   * @returns all edge renderers
   */
  listEdgeRenderers(): IEdgeRenderer[] {
    return this._edgeContext.listRenderers();
  }
  listNodeLayoutManagers(): INodeLayoutManager[] {
    return this._nodeLayoutContext.listLayoutManagers();
  }
  translateModel(model: ModelSpec) {
    if (model.provider) {
      const { key } = model.provider;
      const ds = this._dsFactory.findDataSourceByKey(key);
      const userData = ds.getData(key);
      const renderName = this._dsFactory.getRendererName(ds.id);
      const nodeRenderer = this.nodeRenderingContext.getRenderer(
        renderName
      ) as RenderingDelegate<any>;

      const { text, iconBadge, thumbnail, link } = nodeRenderer.delegate;
      let m: ModelSpec;
      if (text) {
        m = { type: "text", text: text(userData) };
      } else if (iconBadge) {
        m = { type: "icon-badge", "icon-badge": iconBadge(userData) };
      } else if (thumbnail) {
        m = { type: "thumbnail", thumbnail: thumbnail(userData) };
      } else if (link) {
        m = { type: "link", link: link(userData) };
      }
      return m;
    } else {
      return model;
    }
  }
  /**
   * return NodeSpec data. If you want to export schema or ui, use `exportwith` instead.
   * @see {exportWith}
   * @deprecated use exportWith(param: ExportParam)
   * @param stringify if true, return JSON.stringify(nodeSpec), else return nodeSpec itself
   * @returns nodeSpec
   */
  export(stringify = true): Promise<string | NodeSpec> {
    const nodeSpec = exportTree(this.config, this.rootUI);
    const value = stringify ? JSON.stringify(nodeSpec) : nodeSpec;
    return Promise.resolve(value);
  }
  exportWith(param?: ExportParam): Promise<ExportResponse> {
    const exporter = new ExportContext(this);
    return exporter.export(param);
  }
  registerEdgeRenderer(renderer: IEdgeRenderer) {
    this._edgeContext.registerEdgeRenderer(renderer);
  }
  getSchemaContext() {
    return this._schemaContext;
  }
  registerSchema(schemaSpec: SchemaSpec) {
    this._schemaContext.addSchema(schemaSpec);
  }
  bindSchema(schema: SchemaSpec | string, nodes?: NodeUI[]) {
    nodes = nodes || this.getSelectedNodes();
    if (nodes.length === 0) {
      return;
    }
    const spec: SchemaSpec = SchemaUtil.toSchema(schema, this._schemaContext);
    const updated = nodes.filter((node) => this._bindSchema(spec, node, true));
    this._notifySchemaBinding(updated);
  }
  unbindSchema(schema: SchemaSpec | string, nodes?: NodeUI[]) {
    nodes = nodes || this.getSelectedNodes();
    if (nodes.length === 0) {
      return;
    }
    const spec: SchemaSpec = SchemaUtil.toSchema(schema, this._schemaContext);
    const updated = nodes.filter((node) => this._bindSchema(spec, node, false));
    this._notifySchemaBinding(updated);
  }
  toggleSchema(schema: SchemaSpec | string, nodes?: NodeUI[]) {
    nodes = nodes || this.getSelectedNodes();
    if (nodes.length === 0) {
      return;
    }
    const spec: SchemaSpec = SchemaUtil.toSchema(schema, this._schemaContext);
    const updated = nodes.filter((node) => {
      const existing = SchemaUtil.has(node.spec.model, spec);
      return this._bindSchema(spec, node, !existing);
    });
    this._notifySchemaBinding(updated);
  }
  private _notifySchemaBinding(nodes: NodeUI[]) {
    if (nodes.length > 0) {
      setTimeout(() => {
        this._edgeContext.repaint(true);
        this.config.emit(EVENT.NODE.UPDATED.CLIENT, {
          type: "schema",
          nodes,
        });
      });
    }
  }
  private _bindSchema(schema: SchemaSpec, node: NodeUI, binding: boolean) {
    if (binding) {
      return this.canvas.bindSchema(node, schema);
    } else {
      return this.canvas.unbindSchema(node, schema);
    }
  }
}
