import { Subscriber } from 'svelte/store';
import { Unsubscriber } from 'svelte/store';
import { Writable } from 'svelte/store';

export declare abstract class AbstractEdgeRenderer<T> implements IEdgeRenderer<T> {
    abstract name: string;
    /**
     * provides default option to be used for pollyfill
     */
    get defaultOption(): T;
    abstract render(canvas: CanvasUI, srcNode: NodeUI, dstNode: NodeUI): void;
    getRenderingOption(node: NodeUI): T;
}

export declare class AlignmentContext {
    readonly config: Configuration;
    activeNodes: NodeUI[];
    snaps: {
        hLines: Set<number>;
        vLines: Set<number>;
    };
    constructor(config: Configuration);
    private _resolveSnapTarget;
    turnOn(rootNode: NodeUI, nodes: NodeUI[]): void;
    turnOff(): void;
    doAlign(): void;
}

/**
 * @template T - type of user data, which is rendered as node
 * @template K - type of key for each data T
 */
export declare class BaseDataSource<T, K> {
    readonly id: string;
    readonly keyOf: KeyExtractor<T, K>;
    private readonly _items;
    private readonly _itemMap;
    /**
     *
     * @param id unique identifier for datasource
     * @param keyOf extracts key from each item(user data)
     */
    constructor(id: string, keyOf: KeyExtractor<T, K>);
    getData(key: K): T;
    /**
     *
     * @param items user data to use
     */
    setData(items: T[]): void;
    containsData(data: T): boolean;
    containsKey(key: K): boolean;
}

export declare class CanvasUI {
    config: Configuration;
    $viewport: HTMLElement;
    dndContext: DndContext;
    resizeObserver: ResizeObserver;
    selectionArea: NodeRect | undefined;
    $ctx: CanvasRenderingContext2D;
    constructor(config: Configuration);
    get dom(): DomUtil;
    get $canvas(): HTMLCanvasElement;
    get $holder(): HTMLElement;
    get scale(): number;
    getContext(): CanvasRenderingContext2D;
    getHolderOffset(): {
        x: number;
        y: number;
    };
    /**
     * multiply scale to numeric properties
     * @param obj object to mutiply scale
     * @returns
     */
    setScale<T>(obj: T): T;
    /**
     * multiply scale to numeric properties
     * @param point point to multiply scale
     * @returns
     */
    getScaledPos(point: Point): Point;
    /**
     * multiply scale to offset(x,y) of the node
     * @param node
     * @returns
     */
    getScaledOffset(node: NodeUI): any;
    getDimension(): {
        width: number;
        height: number;
    };
    getNodeDimension(node: NodeUI, relative?: boolean): NodeRect;
    getAbsoluteDimensions(nodes: NodeUI[]): NodeRect;
    elemOf(cssSelector: string): Element;
    shiftBy(dx: number, dy: number): void;
    renderWith(callback: (ctx: CanvasRenderingContext2D) => void): void;
    findNodeAt(x: number, y: number): NodeUI;
    drawPath(points: Point[], options: Partial<CanvasRenderingContext2D>, fn: (ctx: CanvasRenderingContext2D) => void): void;
    drawCurve<K extends keyof CanvasRenderingContext2D>(s: Point, e: Point, option: {
        degree: number;
        ratio: number;
        props: Record<K, CanvasRenderingContext2D[K]>;
    }, fn: (ctx: CanvasRenderingContext2D) => void): void;
    drawBeizeCurve<K extends keyof CanvasRenderingContext2D>(s: Point, e: Point, option: {
        cpoints: Point[];
        props: Record<K, CanvasRenderingContext2D[K]>;
    }, fn: (ctx: CanvasRenderingContext2D) => void): void;
    drawVLines(xPoints: number[], option: (ctx: CanvasRenderingContext2D) => void): void;
    drawHLines(yPoints: number[], option: (ctx: CanvasRenderingContext2D) => void): void;
    clear(): void;
    repaintNodeHolder(): void;
    moveNode(nodeUI: NodeUI): void;
    drawNodeSelection(): void;
    updateSelection(nodes: NodeUI[]): void;
    clearNodeSelection(): void;
    drawNode(nodeUI: NodeUI): void;
    showNodeEditor(nodeUI: NodeUI, nodeEditor: INodeEditor): Promise<unknown>;
    hideNodeEditor(nodeUI: NodeUI): void;
    regsiterNode(nodeUI: NodeUI): void;
    unregisterNode(nodeUI: NodeUI): void;
    unregisterNodeTree(node: NodeUI): void;
    updateFoldingNodes(nodeUI: NodeUI): void;
    getNodeBody(nodeUI: NodeUI): HTMLElement;
    drawSchema(schemaSpec: SchemaSpec): void;
    removeSchema(schemaName: string): void;
    bindSchema(node: NodeUI, schemaSpec: SchemaSpec): boolean;
    unbindSchema(node: NodeUI, schemaSpec: SchemaSpec): boolean;
}

export declare class Capture {
    readonly node: NodeUI;
    readonly pos: Point;
    readonly dir: Direction;
    constructor(node: NodeUI);
}

declare type ClassUtil = {
    add: (el: HTMLElement, className: string) => void;
    remove: (el: HTMLElement, className: string) => void;
};

export declare class Configuration {
    el: HTMLElement;
    ui: UISetting;
    readonly ebus: EventBus;
    dom: DomUtil;
    mindWired?: () => MindWired;
    model: ModelSpec;
    view: ViewSpec;
    subs: NodeSpec[];
    getCanvas: () => CanvasUI;
    getNodeRenderer: () => NodeRenderingContext;
    constructor({ el, ui, dom, eventBus, }: {
        el: HTMLElement;
        ui: UISetting;
        dom: DomUtil;
        eventBus: EventBus;
    });
    get width(): string | number;
    get height(): string | number;
    get scale(): number;
    get snapEnabled(): boolean;
    get snapSetting(): SnapToEntitySetting;
    getOffset(): Point;
    setOffset(offset: Point): void;
    relativeOffset(offset: Point): Point;
    activeClassName(type: string): any;
    nodeLevelClassName(node: NodeUI): string;
    foldedNodeClassName(): string;
    listen<A = any>(eventName: MindWiredEvent<A>, callback: (arg: A) => void): this;
    off<A = any>(event: MindWiredEvent<A>, callback: Function): void;
    emit<A = any>(event: MindWiredEvent<A>, args?: A): this;
    static parse(param: InitParam, dom: DomUtil, eventBus?: EventBus): Configuration;
}

/**
 * string value as class of HTMLElement. You don't have to add leading dot(.)
 *
 * @example "city", "asian food"
 */
export declare type CssClassName = string;

/**
 * '#some .class'
 */
export declare type CssSelectorForm = string;

/**
 * "120px", "100%", etc
 */
export declare type CssSizeForm = string;

/**
 * Placeholder for all datasources
 */
export declare class DataSourceFactory {
    private readonly _dsMap;
    /**
     * mapping datasource(key) to node render(value)
     * @key datasource id
     * @value name of custom node renderer
     */
    private _dsToRendererMap;
    /**
     * mapping datasource(key) to node editor(value)
     * @key datasource id
     * @value name of custom node editor
     */
    private _dsToEditorMap;
    constructor();
    /**
     * creates new datasource
     *
     * @template T type of items in the datasource
     * @template K type of key for each items(default: 'string')
     * @param datasourceId unique identifier for datasource
     * @returns new datasource
     */
    createDataSource<T, K>(datasourceId: string, keyExtractor: KeyExtractor<T, K>): BaseDataSource<T, K>;
    /**
     *
     * @template T type of items in the datasource
     * @template K type of key for each items(default: 'string')
     * @param dataSourceId unique identifier for datasource
     * @returns datasource
     */
    getDataSource<T = any, K = string>(dataSourceId: string): BaseDataSource<T, K>;
    bindRendererMapping(ds: BaseDataSource<any, any>, rendererName: string): void;
    getRendererName(dataSourceId: string): string;
    bindEditorMapping(ds: BaseDataSource<any, any>, editorName: string): void;
    getEditorName(dataSourceId: string): string;
    findDataSourceByData<T, K>(data: T): BaseDataSource<unknown, unknown>;
    findDataSourceByKey(key: string): BaseDataSource<unknown, unknown>;
    private _findBy;
    findData<K>(key: K): any;
    clear(): void;
}

export declare type DatasourceOptionalParam<T> = {
    renderer?: UserDefinedRenderer<T>;
    editor?: UserDefinedEditor<T>;
};

export declare class DefaultNodeLayout implements INodeLayoutManager {
    readonly layoutContext: NodeLayoutContext;
    constructor(layoutContext: NodeLayoutContext);
    get name(): string;
    doLayout(nodeUI: NodeUI): void;
    setPosition(): void;
}

export declare class Direction {
    node: NodeUI;
    private prev;
    constructor(nodeUI: NodeUI);
    get horizontal(): 1 | -1;
    get vertical(): 1 | -1;
    updated(format: DirectionFlow): boolean;
    capture(): void;
}

/**
 * direction flow relative to parent node
 * * LR: moved from left to right
 * * RL: moved from right to left
 * * TB: moved from top to bottom
 * * BT: moved from bottom to top
 */
export declare type DirectionFlow = "LR" | "RL" | "TB" | "BT";

declare class DndContext {
    touchTimer: number | undefined;
    dragging: DndEvent | undefined;
    handler: DndHelper;
    data: Map<string, any>;
    originalEvent: Event | undefined | null;
    constructor(handler: DndHelper);
    capture(name: string, value: any): void;
    getData(name: string): any;
}

declare type DndEvent = {
    originalEvent: MutableEvent;
    sx: number;
    sy: number;
    dx: number;
    dy: number;
    ghost: HTMLElement | undefined;
    once: Function | undefined;
};

declare type DndHelper = {
    accept: (el: EventTarget | null) => boolean;
    beforeDrag: (e: DndEvent) => void;
    dragging: (e: DndEvent) => void;
    afterDrag: (e: DndEvent) => void;
};

export declare class DomUtil {
    tag: TagUtil;
    attr: (el: HTMLElement, attrName: string, attrValue: string, always?: boolean) => void;
    clazz: ClassUtil;
    closest: (elem: HTMLElement, selector: string) => HTMLElement;
    event: EventUtil;
    css: (el: HTMLElement, styles: any) => void;
    parseTemplate: <T = HTMLElement>(template: string, params?: any) => T;
    findOne: <T = HTMLElement>(el: HTMLElement, cssSelector: string) => T;
    findAll: <T extends HTMLElement>(el: HTMLElement, selectors: string[]) => T[];
    is: (el: HTMLElement, cssSelector: string, searchParent?: boolean) => boolean;
    data: {
        int: (el: HTMLElement, attrList: string[]) => any;
    };
    domRect: (el: HTMLElement) => DOMRect;
    types: {
        method: (obj: any) => boolean;
    };
    renderStyle(el: HTMLElement, style: Partial<CSSStyleDeclaration>, clearStyle?: boolean): void;
    valid: ValidUtil;
    constructor();
}

export declare const domUtil: () => DomUtil;

export declare type DragBranch = {
    VIEWPORT: ViewportDragEvent<ViewportDragEventArg>;
    NODE: NodeDragEvent<NodeDragEventArg>;
};

export declare class DragContext {
    readonly capture: Map<NodeUI, Capture>;
    readonly posMap: Map<NodeUI, Point>;
    constructor();
    prepareCaptures(nodes: NodeUI[]): void;
    eachCapture(callback: (capture: Capture) => void): void;
    getUpdatedNodes(): NodeUI[];
    clear(): void;
}

export declare class Edge {
    srcNode: NodeUI;
    dstNode: NodeUI;
    visible: boolean;
    constructor(srcNode: NodeUI, dstNode: NodeUI);
    get src(): NodeUI;
    get dst(): NodeUI;
    matched(node: NodeUI): boolean;
    matchedDst(node: NodeUI): boolean;
}

export declare class EdgeContext {
    config: Configuration;
    canvas: CanvasUI;
    private edges;
    private renderers;
    constructor(config: Configuration, canvas: CanvasUI);
    listRenderers(): IEdgeRenderer[];
    private _addEdge;
    addEdge(src: NodeUI, dst: NodeUI): void;
    private _deleteBetween;
    deleteBetween(src: NodeUI, dst: NodeUI): Edge[];
    /**
     * deletes edges matching the nodes
     * @param nodes
     */
    deleteEdges(nodes: NodeUI[]): void;
    setRootNode(rootNode: NodeUI): void;
    registerEdgeRenderer(render: IEdgeRenderer): void;
    filterEdges(predicate: (e: Edge) => boolean): Edge[];
    setEdgeVisible(node: NodeUI, visible: boolean, repaintImmediately?: boolean): void;
    repaint(clearCanvas?: boolean): void;
    dispose(): void;
}

export declare type EdgeRederingOptionType<T> = {
    optionType: T;
};

export declare type EdgeRendererName = string;

export declare type EdgeSpec = {
    name?: string;
    color?: WebColorString;
    width?: number | LevelBasedEdgeWidth | ((node: NodeSpec, level: number) => number);
    dash?: number[];
    /**
     * if true, all descendant nodes use this edge(default: true)
     */
    inherit?: boolean;
    option?: any;
};

export declare class EdgeStyle {
    nodeUI: NodeUI;
    constructor(nodeUI: NodeUI);
    get name(): string;
    get option(): any;
    get color(): string;
    get width(): number;
    get dash(): number[];
    getEdgeRenderer(): any;
}

/**
 * It specifies various class names to set on the nodes of the mind map.
 */
export declare type EntityClassNaming = {
    /**
     * class name for active nodes
     *
     * @default 'active-node'
     */
    node?: CssClassName;
    /**
     * classname for edge
     * @deprecated
     */
    edge?: CssClassName;
    /**
     * returns schema name itself
     * @param schemaName
     * @default (schemaName: string) => schemaName
     * @returns
     */
    schema?: (schemaName: string) => CssClassName;
    /**
     * level classname for node.
     * @default `level-${levenumber}`
     * @param level level number of the node.(root: 0, child of root: 1, ...)
     * @param spec NodeSpec
     * @returns
     */
    level?: string | ((level: number, node?: NodeSpec) => CssClassName);
    /**
     * classname for folded node.(Children of a folded node are hidden.)
     *
     * @default 'folded'
     */
    folded?: string;
};

export declare const EVENT: EventRoot;

declare class EventBus {
    private callbacks;
    constructor();
    on<A = any>(event: MindWiredEvent<A>, callback: (arg: A) => void): void;
    off(eventObj: string, callback: Function): void;
    /**
     * used to register client-side callback
     * @param {MindWiredEvent} eventName like "valid.event.path" format
     * @param {function} callback
     */
    listen<A = any>(event: MindWiredEvent<A>, callback: (arg: A) => void): void;
    emit<A = any>(event: MindWiredEvent<A>, payload: A): void;
}

export declare const eventList: EventRoot;

export declare type EventRef = {
    detail: SchemaEventArg;
};

export declare type EventRoot = {
    DRAG: DragBranch;
    NODE: NodeBranch;
    VIEWPORT: ViewportBranch;
    SCHEMA: SchemaBranch;
};

declare type EventUtil = {
    consume: (target: HTMLElement, eventName: string) => void;
    click: (target: HTMLElement, callback: (e: Event) => void, options?: string) => void;
    keydown: (target: HTMLElement, callback: (e: Event) => void, options: string) => void;
    keyup: (target: HTMLElement, callback: (e: Event) => void, options?: string) => void;
    input: (target: HTMLElement, callback: (e: Event) => void, option?: {
        debouce: number;
    }) => void;
    change: (target: HTMLElement, callback: (e: Event) => void) => void;
};

export declare class ExportContext {
    readonly mwd: MindWired;
    constructor(mwd: MindWired);
    export(param?: ExportParam): Promise<ExportResponse>;
}

export declare type ExportParam = {
    types: ExportType[];
};

export declare type ExportResponse = {
    [name in ExportType]?: any;
};

export declare type ExportType = "node" | "schema" | "ui";

export declare class Geometry {
    /**
     * move dst to dst'
     * ```
     *
     *   |
     *   |             + dst'
     *   |
     *   |                + dst
     *   |  by deg
     *   +-------------------------->
     *  base
     *```
     * @param {Point} base
     * @param {Point} dst
     * @param {number} degree - [0~360]
     */
    rotate: (base: Point, dst: Point, degree: number, param?: RotationParam) => {
        x: number;
        y: number;
    };
    heading(p: Point, base?: Point): Heading;
}

export declare class Heading {
    readonly target: Point;
    readonly base: Point;
    /**
     * [-180, +180] degrees from positive X axis
     */
    private _degree;
    constructor(target: Point, base?: Point);
    /**
     * counter clock wise from X-AXIS(east), which is quadrant(1 > 2 > 3 > 4)
     * @returns [0, 360) degree
     */
    get ccwx(): number;
    /**
     * clock wise from Y-AXIS(north), which is quadrant(1 > 4 > 3 > 2)
     * @returns [0, 360) degree
     */
    get cwy(): number;
    /**
     * get quadrant number in math
     * ```
     *   2 | 1
     *  ---+---> X
     *   3 | 4
     * ```
     * @returns 1 when [0, 90), 2 when [90, 180), 3 when [180, 270), 4 when [270, 360)
     */
    get quadrant(): 1 | 2 | 3 | 4;
}

export declare class IconBadgeEditor implements INodeEditor {
    readonly ctx: NodeEditingContext;
    constructor(ctx: NodeEditingContext);
    get name(): string;
    showEditor(model: ModelSpec, parentEl: HTMLElement): HTMLElement;
}

/**
 *  ```
 *  icon-badge renderer
 *  +------+--------------+
 *  | IMG  |    T E X T   |
 *  +------+--------------+
 *
 *  [configuration]
 *  node: {
 *    model: {
 *      type: 'icon-badge',
 *      'icon-badge': {
 *        icon: 'https://image.url.value',
 *        text: 'text value'
 *      }
 *    },
 *    view: { ... }
 *  }
 * ```
 *
 */
export declare class IconBadgeRenderer implements INodeRenderer {
    ctx: NodeRenderingContext;
    constructor(renderingContext: NodeRenderingContext);
    get name(): string;
    install(model: ModelSpec, parentEl: HTMLElement): void;
    render(model: ModelSpec, parentEl: HTMLElement): void;
}

/**
 *  ```
 *  icon-badge
 *  +------+--------------+
 *  | IMG  |    T E X T   |
 *  +------+--------------+
 *
 *  [configuration]
 *  node: {
 *    model: {
 *      'icon-badge': {
 *        icon: 'https://image.url.value',
 *        text: 'text value'
 *      }
 *    },
 *    view: { ... }
 *  }
 * ```
 *
 */
export declare type IconBadgeSpec = {
    /**
     * uril to icon image
     */
    icon: string;
    /**
     * text
     */
    text: string;
    size?: ImageSizeSpec;
};

/**
 * Top level edge renderer interface. All implementation provide unique name and rendering opration on canvas.
 * @template T - type of custom edge option
 */
export declare interface IEdgeRenderer<T = any> {
    /**
     * unique renderer name
     */
    name: EdgeRendererName;
    /**
     * FIXME NodeUI보다는 EdgeSpec(node.$style) 이 적절해보임.
     * @param node
     */
    getRenderingOption(node: NodeUI): T;
    render: (canvas: CanvasUI, srcNode: NodeUI, dstNode: NodeUI) => void;
}

/**
 * ```
 * number - same width and height
 * [number, number] - [width, height]
 * ```
 */
export declare type ImageSizeSpec = number | [number, number];

export declare const init: (param: InitParam) => Promise<MindWired>;

export declare const initMindWired: (param: InitParam) => Promise<MindWired>;

/**
 * map initialization parameters
 *
 */
export declare type InitParam = {
    el: HTMLElement | CssSelectorForm;
    ui: UISetting;
    schema?: SchemaSpec[];
};

export declare interface INodeEditor {
    /**
     * the type of model(text, thumbnail, or name of datasource)
     */
    name: string;
    showEditor(model: ModelSpec, parentEl: HTMLElement, style?: Partial<CSSStyleDeclaration>): HTMLElement;
}

export declare interface INodeLayoutManager {
    name: string;
    doLayout(nodeUI: NodeUI, context: LayoutParam): void;
    setPosition(nodeUI: NodeUI, context: PositionParam): void;
}

export declare interface INodeRenderer {
    name: string;
    install(model: ModelSpec, parentEl: HTMLElement): void;
    render(model: ModelSpec, parentEl: HTMLElement, state: NodeState): void;
    /**
     * show editor for the given node
     * @param node node to edit
     */
    editor?(node: NodeUI): void;
}

export declare const installDefaultLayoutManagers: (ctx: NodeLayoutContext) => void;

export declare type KeyExtractor<T, K> = (item: T) => K;

export declare type LayoutParam = {
    dir: Direction;
};

/**
 * edge width by node's level
 *
 * * root - edge width of root node(level 0)
 * * delta - used to determine edge width by level (root + level * delta)
 * * min - minimal edge width
 *
 * Example
 *
 * ```js
 *   width: { root: 6, detal: -2, min: 1 }
 * ```
 * * root node(level-0): 6px
 * * node at level-1 : 4px;
 * * node at level-2 : 2px;
 * * node at level-3 : 1px;
 * * node at level-4 : 1px;
 */
export declare type LevelBasedEdgeWidth = {
    root: number;
    delta: number;
    min: number;
};

export declare class LineEdgeRenderer extends AbstractEdgeRenderer<void> {
    get name(): string;
    /**
     * drawing line between srcNode and dstNode
     * @param canvas
     * @param srcNode
     * @param dstNode
     */
    render(canvas: CanvasUI, srcNode: NodeUI, dstNode: NodeUI): void;
}

export declare class LinkEditor implements INodeEditor {
    readonly ctx: NodeEditingContext;
    constructor(ctx: NodeEditingContext);
    get name(): string;
    showEditor(model: ModelSpec, parentEl: HTMLElement): HTMLElement;
}

export declare class LinkRenderer implements INodeRenderer {
    readonly ctx: NodeRenderingContext;
    constructor(ctx: NodeRenderingContext);
    get name(): string;
    install(model: ModelSpec, parentEl: HTMLElement): void;
    render(model: ModelSpec, parentEl: HTMLElement, state: NodeState): void;
}

export declare type LinkSpec = {
    url: string;
    body: ModelSpec;
};

export declare class MindWired {
    config: Configuration;
    canvas: CanvasUI;
    nodeRenderingContext: NodeRenderingContext;
    nodeSelectionModel: NodeSelectionModel;
    private _nodeLayoutContext;
    nodeEditingContext: NodeEditingContext;
    private _alignmentContext;
    dragContext: DragContext;
    private _edgeContext;
    rootUI: NodeUI;
    private _dsFactory;
    private _schemaContext;
    /**
     *
     * @param {Configuration} config
     */
    constructor(config: Configuration);
    getAligmentContext(): AlignmentContext;
    /**
     *
     * @param dataSourceId unique id for datasource
     * @param keyExtractor provides unique id for each items in the datasource
     * @param param - used for mapping (data source, node renderer)
     * @returns
     */
    createDataSource<T, K>(dataSourceId: string, keyExtractor: KeyExtractor<T, K>, param?: DatasourceOptionalParam<T>): BaseDataSource<T, K>;
    isEditing(): boolean;
    private _dispose;
    nodes(elems: NodeSpec): this;
    findNode(predicate: (node: NodeUI) => boolean): NodeUI;
    addNode(parentNode: NodeUI, nodeData: NodeSpec, option?: {
        siblingNode: NodeUI;
    }): NodeUI;
    /**
     *
     * @param parentNode new parent of the given nodes
     * @param nodes nodes whoses parent is changed
     * @param trigger if true, event 'node.updated' is triggered
     */
    moveNodes(parentNode: NodeUI, nodes: NodeUI[], trigger?: boolean): void;
    deleteNodes(nodes: NodeUI[]): void;
    getNodeSelectionModel(): NodeSelectionModel;
    getSelectedNodes(): NodeUI[];
    setLayout(layoutSpec: NodeLayout | undefined, nodeUI: NodeUI): void;
    setEdge(edgeSpec: EdgeSpec | undefined, nodeUI?: NodeUI): void;
    setScale(scale: number): void;
    /**
     * update  visibilityof of the given node's children
     * @param nodes
     * @param folding if true(false), children of the node are hidden(visible).
     */
    setFoldingState(nodes: NodeUI[], folding: boolean): void;
    repaint(nodeUI?: NodeUI): void;
    listen<A = any>(eventName: string, callback: (arg: A) => void): this;
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
    listenStrict<A>(event: NodeEvent<A> | ViewportEvent<A> | ViewportDragEvent<A> | NodeDragEvent<A>, callback: (arg: A) => void): this;
    getNodeRender(model: ModelSpec): INodeRenderer;
    /**
     * returns all node renderers
     * @returns all node renderers
     */
    listNodeRenderers(): INodeRenderer[];
    /**
     * return all edge renderers
     * @returns all edge renderers
     */
    listEdgeRenderers(): IEdgeRenderer[];
    listNodeLayoutManagers(): INodeLayoutManager[];
    translateModel(model: ModelSpec): ModelSpec;
    /**
     * return NodeSpec data. If you want to export schema or ui, use `exportwith` instead.
     * @see {exportWith}
     * @deprecated use exportWith(param: ExportParam)
     * @param stringify if true, return JSON.stringify(nodeSpec), else return nodeSpec itself
     * @returns nodeSpec
     */
    export(stringify?: boolean): Promise<string | NodeSpec>;
    exportWith(param?: ExportParam): Promise<ExportResponse>;
    registerEdgeRenderer(renderer: IEdgeRenderer): void;
    getSchemaContext(): SchemaContext;
    registerSchema(schemaSpec: SchemaSpec): void;
    bindSchema(schema: SchemaSpec | string, nodes?: NodeUI[]): void;
    unbindSchema(schema: SchemaSpec | string, nodes?: NodeUI[]): void;
    toggleSchema(schema: SchemaSpec | string, nodes?: NodeUI[]): void;
    private _notifySchemaBinding;
    private _bindSchema;
}

export declare type MindWiredEvent<T> = {
    name: string;
    desc: string;
    CLIENT?: MindWiredEvent<T>;
};

export declare abstract class MindWiredStore<T> {
    protected abstract store: Writable<T>;
    constructor();
    subscribe(callback: Subscriber<T>): Unsubscriber;
    update(callback?: (state: T) => void): void;
}

export declare type ModelSpec = {
    type?: NodeModelType;
    schema?: string;
    text?: string;
    thumbnail?: ThumbnailSpec;
    "icon-badge"?: IconBadgeSpec;
    link?: LinkSpec;
    provider?: ProviderSpec;
};

export declare class MustacheLREdgeRenderer extends AbstractEdgeRenderer<MustachLREdgeOption> {
    get name(): string;
    render(canvas: CanvasUI, srcNode: NodeUI, dstNode: NodeUI): void;
}

export declare class MustacheTBEdgeRenderer extends AbstractEdgeRenderer<void> {
    get name(): string;
    render(canvas: CanvasUI, srcNode: NodeUI, dstNode: NodeUI): void;
}

declare type MustachLREdgeOption = {
    valign: "bottom" | "center" | "top";
};

declare interface MutableEvent extends TouchEvent, MouseEvent {
    clientX: number;
    clientY: number;
    layerX: number;
    layerY: number;
    offsetX: number;
    offsetY: number;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
}

export declare class NaturalCourveEdgeRenderer extends AbstractEdgeRenderer<NaturalCurveEdgeOption> {
    get name(): string;
    get defaultOption(): NaturalCurveEdgeOption;
    render(canvas: CanvasUI, srcNode: NodeUI, dstNode: NodeUI): void;
}

declare type NaturalCurveEdgeOption = {
    deg: number;
    ratio: number;
};

export declare type NodeBranch = {
    /**
     * one more more nodes selected
     */
    SELECTED: NodeEvent<NodeSelectArg>;
    /**
     * a node created
     */
    CREATED: NodeEvent<NodeEventArg>;
    /**
     * node(s) deleted. It is redirected to `EVENT.NODE.DELETED2`
     * @deprecated use `EVENT.NODE.DELETED2`
     */
    DELETED: NodeEvent<NodeEventArg>;
    /**
     * node(s) deleted
     */
    DELETED2: NodeEvent<NodeDeletionArg>;
    /**
     * node(s) updated
     */
    UPDATED: NodeEvent<NodeEventArg>;
    /**
     * a node clicked
     */
    CLICKED: NodeEvent<NodeEventArg>;
    /**
     * editing state of a node
     */
    EDITING: NodeEvent<NodeEditingArg>;
    /**
     * folding state of a node
     * @deprecated use `EVENT.NODE.UPDATED`
     */
    FOLDED: NodeEvent<NodeFoldingArg>;
    /* Excluded from this release type: MOVED */
};

/**
 * deleted nodes and affected nodes
 *
 * @prop nodes - deleted nodes
 * @prop updated - updated nodes(children of deleted ones)
 */
export declare type NodeDeletionArg = {
    /**
     * deleted nodes
     */
    nodes: NodeUI[];
    /**
     * affected nodes by deletion(for example, children)
     */
    updated: NodeUI[];
    type: "delete";
};

export declare type NodeDragEvent<T> = MindWiredEvent<T>;

/**
 * drag state of node
 */
export declare type NodeDragEventArg = {
    /**
     * unique node id
     */
    nodeId: string;
    /**
     * drag state
     *
     * * ready - before dragging(mouse pressed)
     * * drag - dragging state(mouse moving while pressed )
     * * done - dragging finished(mouse released)
     */
    state: "ready" | "drag" | "done";
    /**
     *
     * * children - all descendant nodes are affected except the dragged one
     * * all - all descendant nodes are affected including the dragged one
     */
    target: "children" | "all";
    /**
     * current node x-position relative to center of viewport
     */
    x: number;
    /**
     * current node y-position relative to center of viewport
     */
    y: number;
};

export declare type NodeEditingArg = {
    node: NodeUI;
    editing: boolean;
};

export declare class NodeEditingContext {
    readonly canvas: CanvasUI;
    readonly datasourceFactory: DataSourceFactory;
    dispose(): void;
    /**
     * current editing node
     */
    node: NodeUI | undefined;
    private _editorMap;
    constructor(canvas: CanvasUI, datasourceFactory: DataSourceFactory);
    get config(): Configuration;
    isEditing(): boolean;
    registerEditor(editor: INodeEditor): void;
    registerCustomEditor<T>(delegate: UserDefinedEditor<T>): void;
    getEditor(editorName: string): INodeEditor;
    edit(nodeUI: NodeUI): void;
    parse(htmlTemplate: string): HTMLElement;
    query<T extends HTMLElement>(el: HTMLElement, cssSelector: string): T;
    queryAll<T extends HTMLElement>(el: HTMLElement, cssSelector: string): T[];
    updateModel(callback: (model: ModelSpec) => boolean): void;
    close(): void;
    normalizeImageSize(size: ImageSizeSpec): {
        width: string;
        height: string;
    };
}

export declare class NodeEditingDelegate<T> implements INodeEditor {
    readonly ctx: NodeEditingContext;
    readonly delegate: UserDefinedEditor<T>;
    constructor(ctx: NodeEditingContext, delegate: UserDefinedEditor<T>);
    get name(): string;
    private _pickRenderer;
    showEditor(model: ModelSpec, parentEl: HTMLElement): HTMLElement;
}

export declare type NodeEvent<T> = MindWiredEvent<T> & {
    CLIENT: MindWiredEvent<T>;
};

export declare type NodeEventArg = {
    /**
     * affected nodes
     */
    nodes: NodeUI[];
    type: "select" | "click" | "create" | "update" | "delete" | "path" | "pos" | "model" | "schema" | "folding";
};

export declare type NodeFoldingArg = {
    node: NodeUI;
    folded: boolean;
};

export declare type NodeLayout = {
    type: NodeLayoutType;
};

export declare class NodeLayoutContext {
    readonly config: Configuration;
    private _layoutMap;
    constructor(config: Configuration);
    get canvas(): CanvasUI;
    registerLayoutManager(layout: INodeLayoutManager): void;
    getLayoutManager(layout: NodeLayout): INodeLayoutManager;
    setPosition(nodeUI: NodeUI, context: PositionParam): void;
    layout(nodeUI: NodeUI, context: LayoutParam): void;
    listLayoutManagers(): INodeLayoutManager[];
}

export declare type NodeLayoutType = "X-AXIS" | "Y-AXIS" | "XY-AXIS" | "DEFAULT" | string;

export declare type NodeModelType = "text" | "icon-badge" | "thumbnail" | "link";

export declare type NodeMoveArg = {
    node: NodeUI;
    prevParent: NodeUI;
};

export declare class NodeRect {
    readonly center: Point;
    private _rect;
    constructor(center: Point, _rect: DOMRect);
    get width(): number;
    get height(): number;
    get left(): number;
    get right(): number;
    get top(): number;
    get bottom(): number;
    get cx(): number;
    get cy(): number;
    get x(): number;
    get y(): number;
    get r(): number;
    get b(): number;
    merge(other: NodeRect): this;
}

export declare class NodeRenderingContext {
    readonly datasourceFactory: DataSourceFactory;
    editingNode?: NodeUI;
    canvas: CanvasUI;
    uid: string;
    constructor(canvasUI: CanvasUI, datasourceFactory: DataSourceFactory);
    get event(): {
        consume: (target: HTMLElement, eventName: string) => void;
        click: (target: HTMLElement, callback: (e: Event) => void, options?: string) => void;
        keydown: (target: HTMLElement, callback: (e: Event) => void, options: string) => void;
        keyup: (target: HTMLElement, callback: (e: Event) => void, options?: string) => void;
        input: (target: HTMLElement, callback: (e: Event) => void, option?: {
            debouce: number;
        }) => void;
        change: (target: HTMLElement, callback: (e: Event) => void) => void;
    };
    get valid(): {
        path: (value: string) => Promise<string>;
        number: (value: string) => Promise<number>;
        string: (value: any) => boolean;
    };
    parse(htmlTemplate: string, fitToCenter?: boolean): HTMLElement;
    register(renderer: INodeRenderer): void;
    registerCustomRender<T>(renderer: UserDefinedRenderer<T>): void;
    getRendererByModel(model: ModelSpec): INodeRenderer;
    getRenderer(redererName: string): INodeRenderer;
    listRenderers(): INodeRenderer[];
    select(nodeUI: NodeUI, cssSelector: string): HTMLElement;
    css(el: any, styles: any): void;
    query<T extends HTMLElement>(el: HTMLElement, cssSelector: string): T;
    normalizeImageSize(size: ImageSizeSpec): {
        width: string;
        height: string;
    };
    dispose(): void;
}

export declare type NodeSelectArg = {
    nodes: NodeUI[];
    append: boolean;
    type: "select";
};

export declare class NodeSelectionModel {
    config: Configuration;
    /**
     * selected nodes<uid, NodeUI>
     *
     * @template key - uid of node
     * @template value - NodeUI instance
     */
    nodeMap: Map<string, NodeUI>;
    constructor(config: Configuration);
    /**
     * set the state of nodes 'selected'
     * @param nodes nodes to select
     * @param append if true, keep current selection state, otherwise reset selection state with the nodes
     * @returns
     */
    selectNodes(nodes: NodeUI[], append: boolean, propagateEvent?: boolean): NodeUI[];
    isEmpty(): boolean;
    getNodes(): NodeUI[];
    clearSelection(): NodeUI[];
}

export declare type NodeSpec = {
    root?: boolean;
    model: ModelSpec;
    view: ViewSpec;
    subs?: NodeSpec[];
};

export declare type NodeState = {
    selected: boolean;
    editing: boolean;
};

/**
 * A class representing a node in the tree structure.
 */
export declare class NodeUI {
    spec: NodeSpec;
    sharedConfig: Configuration;
    $el: HTMLElement | undefined;
    selected: boolean;
    editing: boolean;
    uid: string;
    zIndex: number;
    subs: NodeUI[];
    parent?: NodeUI;
    $style: EdgeStyle;
    $dim: NodeRect;
    constructor(spec: NodeSpec, sharedConfig: Configuration, parentNode?: NodeUI);
    /**
     * ModelSpec of the node
     */
    get model(): ModelSpec;
    /**
     * ViewSpec of the node
     */
    get view(): ViewSpec;
    get $bodyEl(): HTMLElement;
    get x(): number;
    get y(): number;
    /**
     * offset(distance) from the direct parent node
     */
    get relativeOffset(): Point;
    /**
     * returns available NodeLayout.
     */
    get layout(): NodeLayout;
    /**
     * Indicates whether the node is currently active(selected) or not
     * @returns {boolean} true if the node is active(selected), otherwise false.
     */
    get active(): boolean;
    /**
     * Return child nodes.
     * @returns {NodeUI[]} child nodes
     */
    get childNodes(): NodeUI[];
    /**
     * Returns whether the node is folded or not.
     * @returns {boolean} `true` if the node is folded, otherwise `false`.
     */
    get folding(): boolean;
    /**
     * Returns whether the node is ready to use or not.
     * @returns {boolean} `true` if the node is ready to use, `false` otherwise.
     */
    isReady(): boolean;
    /**
     * Calculate node's position and size.
     * @param {boolean} [relative=false] calculate relative position to parent node.
     * @returns {NodeRect} position and size of the node.
     */
    dimension(relative?: boolean): NodeRect;
    /**
     * Calculate node's level in the tree structure.
     * (Root node's level is 0.)
     * @returns {number} node's level.
     */
    level(): number;
    getStyle<K extends keyof ViewSpec>(type: K): ViewSpec[K];
    /**
     * check if the node is selected or not.
     * @returns {boolean} `true` if selected, `false` otherwise.
     */
    isSelected(): boolean;
    /**
     * Set the selected state of the node.
     * If the node is selected, the z-index is updated and the node is repainted
     * @param {boolean} selected - `true` if selected, `false` otherwise.
     */
    setSelected(selected: boolean): void;
    /**
     * Check if this node is a descendant of `dstNode`.
     * @param {NodeUI} dstNode - The destination node to check
     * @returns {boolean} `true` if this node is a descendant of `dstNode`, `false` otherwise.
     */
    isDescendantOf(dstNode: NodeUI): boolean;
    /**
     * Update the node model with the callback function.
     * @param {Function} callback - The callback function to update the node model.
     */
    updateModel(callback: (model: ModelSpec) => boolean | undefined): void;
    getHeading(): Heading;
    /**
     * absolute offset
     * @returns offset from root to this node
     */
    offset(): Point;
    setOffset({ x, y }: Point): void;
    /**
     * relative pos from the direct parent
     * @returns (x, y) from the direct parent
     */
    getPos(): Point;
    /**
     * Sets the position of the node
     *
     * @param {number} x - The x-coordinate of the position
     * @param {number} y - The y-coordinate of the position
     * @param {boolean} update - Flag indicating whether to repaint viewport
     */
    setPos(x: number, y: number, update?: boolean): void;
    isEditingState(): boolean;
    /**
     * Set the editing state of the node.
     *
     * @param {boolean} editing - The new editing state to set
     */
    setEditingState(editing: boolean): void;
    /**
     * Check if the node is a root node.
     *
     * @return {boolean} Indicates if the node is a root node.
     */
    isRoot(): boolean;
    /**
     * Check if the node is a leaf node.
     *
     * @return {boolean} Indicates if the node is a leaf node.
     */
    isLeaf(): boolean;
    /**
     * Iterates over the children nodes and invokes a callback function for each child.
     *
     * @param {(child: NodeUI, parent: NodeUI) => void} callback - callback function to accept child node.
     */
    children(callback: (child: NodeUI, parent: NodeUI) => void): void;
    /**
     * Searches this node and its descendants for the first node that satisfies the provided testing function.
     *
     * @param {(node: NodeUI) => boolean} predicate - takes a node as an argument and
     * returns a boolean indicating whether the node is the one being searched for.
     * @return {NodeUI} The first node in the tree that passes the test, or `undefined` if no node passes the test.
     */
    find(predicate: (node: NodeUI) => boolean): NodeUI;
    /**
     * Adds a child node to this node.
     * If the child node is already a child of another node, it is removed from that node before adding it.
     *
     * @param childUI Child node to be added to this node.
     * @return The previous parent of the child node, or `null` if it didn't have a parent before.
     */
    addChild(childUI: NodeUI): NodeUI | null;
    /**
     * Removes a child node from this node.
     *
     * @param childUI Child node to be removed from this node.
     * @return The node that was removed, or `null` if the given node is not a child of this node.
     */
    removeChild(childUI: NodeUI): NodeUI | null;
    /**
     * Get the first child node of this node.
     * @return The first child node, or `undefined` if this node has no children.
     */
    firstChild(): NodeUI | undefined;
    /**
     * Get the last child node of this node.
     * @return The last child node, or `undefined` if this node has no children.
     */
    lastChild(): NodeUI | undefined;
    /**
     * change folding state
     * @param folding if true, children of this node are hidden, else visible
     * @returns true if folding state is changed, false if not changed
     */
    setFolding(folding: boolean): boolean;
    /**
     * check if the node is folded(children hidden) or not
     * @return true if the node is folded, false if not folded
     */
    isFolded(): boolean;
    repaint(): void;
    static build(spec: NodeSpec, config: Configuration): NodeUI;
}

export declare class PlainTextEditor implements INodeEditor {
    readonly ctx: NodeEditingContext;
    get name(): string;
    constructor(ctx: NodeEditingContext);
    showEditor(model: ModelSpec, parentEl: HTMLElement): HTMLElement;
}

export declare class PlainTextRenderer implements INodeRenderer {
    ctx: NodeRenderingContext;
    constructor(renderingContext: NodeRenderingContext);
    install(model: ModelSpec, bodyEl: HTMLElement): void;
    render(model: ModelSpec, bodyEl: HTMLElement): void;
    get name(): string;
}

/**
 * class Point(x, y) means screen-based coord, not mathmatical coord
 *
 */
export declare class Point {
    x: number;
    y: number;
    static readonly ZERO: Point;
    constructor(x?: number, y?: number);
    clone(): Point;
    sum(other: Point): Point;
}

export declare type PositionParam = {
    baseNode: NodeUI;
    offset: number;
};

export declare type ProviderSpec = {
    key: any;
};

export declare class RenderingDelegate<T> implements INodeRenderer {
    readonly name: string;
    readonly renderingContext: NodeRenderingContext;
    readonly delegate: UserDefinedRenderer<T>;
    constructor(name: string, renderingContext: NodeRenderingContext, delegate: UserDefinedRenderer<T>);
    private _pickRenderer;
    install(model: ModelSpec, parentEl: HTMLElement): void;
    render(model: ModelSpec, parentEl: HTMLElement, state: NodeState): void;
    editor?(node: NodeUI): void;
}

export declare type RotationParam = {
    scale: number;
};

export declare type SchemaBranch = {
    CREATED: NodeEvent<SchemaEventArg>;
    UPDATED: NodeEvent<SchemaEventArg>;
    DELETED: NodeEvent<SchemaEventArg>;
};

export declare class SchemaContext extends MindWiredStore<EventRef> {
    private _config;
    private readonly _map;
    protected store: Writable<EventRef>;
    private _eventRef;
    constructor(_config: Configuration, _map?: Map<string, SchemaSpec>);
    private get canvas();
    private _notify;
    findSchema(predicate: (schema: SchemaSpec) => boolean): SchemaSpec;
    /**
     * create or update schema.
     * @param schema
     * @param param
     */
    addSchema(schema: SchemaSpec, param?: SchemaOperationParam): void;
    private _registerSchema;
    getSchemas(): SchemaSpec[];
    removeSchema(schemaSpec: SchemaSpec | string, param?: SchemaOperationParam): void;
    dispose(): void;
}

export declare type SchemaEventArg = {
    type: "update" | "create" | "delete";
    schemas: SchemaSpec[];
};

export declare type SchemaOperationParam = {
    overwriteIfExist?: boolean;
    skipEvent?: boolean;
};

export declare type SchemaSpec = {
    /**
     * name of schema(must be unique in a map)
     */
    name: string;
    style?: Partial<CSSStyleDeclaration>;
};

export declare type SelectionSetting = {
    padding?: ZeroOrPositiveNumber;
    "background-color"?: WebColorString;
    "border-radius"?: CssSizeForm;
};

export declare type SnapTargetSetting = {
    /**
     * specifies the scope of nodes to reference when rendering alignment lines using this option.
     *
     * ```
     * ======
     *  RT
     *   +- L10
     *   |   +- L20
     *   |       +- L30
     *   +- L11
     *   |   +- L21
     *   |       +- L31
     *   |       +- L32
     *   +- L12
     * ======
     * ```
     * If distance = 2,
     * * L10: [RT, L11, L12]
     * * L20: [L10, RT]
     * * L21: [L11, RT]
     * * L12: [RT, L10, L11]
     *
     * @default undefined - all nodes are used to draw alignment lines
     */
    distance?: number;
};

export declare type SnapToEntitySetting = {
    enabled?: boolean;
    limit?: ZeroOrPositiveNumber;
    /**
     * @default 0.4
     */
    width?: ZeroOrPositiveNumber;
    /**
     * use this option to draw dashed alignment line
     * @default [6, 2]
     */
    dash?: number[] | false;
    /**
     * color of snap lines(horizontal, vertical)
     */
    color?: WebColorString | {
        horizontal: WebColorString;
        vertical: WebColorString;
    };
    /**
     * use this option to filter nodes for alignment lines
     */
    target?: SnapTargetSetting[];
};

export declare type StyleDefinition = {
    schema: {
        styleId: string;
        selector: string;
    };
};

declare type TagUtil = {
    span: (attr: string, content: string) => HTMLSpanElement;
    iconButton: (attrs: string, content: string) => HTMLButtonElement;
    img: (imgUrl: string) => Promise<{
        img: HTMLImageElement;
        width: number;
        height: number;
    }>;
    div: (attr?: string) => HTMLDivElement;
    style: (attr?: string) => HTMLStyleElement;
    canvas: (attr?: string) => HTMLCanvasElement;
};

export declare class ThumbnailEditor implements INodeEditor {
    readonly ctx: NodeEditingContext;
    constructor(ctx: NodeEditingContext);
    get name(): string;
    showEditor(model: ModelSpec, parentEl: HTMLElement): HTMLElement;
}

export declare type ThumbnailFillMode = "contain" | "cover";

/**
 * ```
 * [configuration]
 * node: {
 *   model: {
 *     type: 'thumnail',
 *     thunmail: {
 *       path: 'https://image.url.value',
 *       size: 40,
 *     }
 *   }
 * }
 * ```
 */
export declare class ThumbnailRenderer implements INodeRenderer {
    ctx: NodeRenderingContext;
    constructor(renderingContext: NodeRenderingContext);
    get name(): string;
    install(model: ModelSpec, bodyEl: HTMLElement): void;
    render(model: ModelSpec, bodyEl: HTMLElement): void;
}

export declare type ThumbnailSpec = {
    path: string;
    size: ImageSizeSpec;
    mode: ThumbnailFillMode;
};

/**
 * viewport setting(width, height etc)
 *
 * * width - width of mindmap viewport. ex) "600px", "100%"
 * * height - height of mindmap viewport. ex) "600px", "100%"
 * * scale - initial scale factor
 */
export declare type UISetting = {
    /**
     * When rendering multiple mind maps within one page,
     * you can specify an identification string for each mind map.
     *
     */
    mapId?: string | undefined;
    /**
     * It assigns unique identifier for nodes without uuid
     * @returns unique identifier
     */
    uuid?: () => string;
    /**
     * width of mindmap viewport.(number like 500 is regarded as "500px") ex) "600px", "100%"
     *
     * @default "600px"
     */
    width?: CssSizeForm | number;
    /**
     * height of mindmap viewport.(number like 500 is regarded as "500px") ex) "600px", "100%"
     * @default "600px"
     */
    height?: CssSizeForm | number;
    /**
     * initial scale factor. (1: 100%, 0.5: 50%, etc)
     *
     * @default 1
     */
    scale?: number;
    clazz?: EntityClassNaming;
    styleDef?: StyleDefinition;
    /* Excluded from this release type: offset */
    snap?: SnapToEntitySetting | false;
    selection?: SelectionSetting;
    /**
     * If true, use embedded icons for control(for testing).
     * @default true
     */
    useDefaultIcon?: boolean;
};

export declare type UserDefinedEditor<T> = {
    name: string;
    text?(item: T): string;
    thumbnail?(item: T): ThumbnailSpec;
    iconBadge?(item: T): IconBadgeSpec;
};

export declare type UserDefinedRenderer<T> = {
    name: string;
    text?(item: T): string;
    thumbnail?(item: T): ThumbnailSpec;
    iconBadge?(item: T): IconBadgeSpec;
    link?(item: T): LinkSpec;
};

declare type ValidUtil = {
    path: (value: string) => Promise<string>;
    number: (value: string) => Promise<number>;
    string: (value: any) => boolean;
};

export declare type ViewportBranch = {
    RESIZED: ViewportEvent<ViewportEventArg>;
    CLICKED: ViewportEvent<ViewportEventArg>;
};

export declare type ViewportDragEvent<T> = MindWiredEvent<T>;

export declare type ViewportDragEventArg = {
    state: "drag" | "done";
    offset: Point;
};

export declare type ViewportEvent<T> = MindWiredEvent<T>;

export declare type ViewportEventArg = {
    type: "click" | "resize";
};

export declare type ViewSpec = {
    x: number;
    y: number;
    layout?: NodeLayout;
    edge?: EdgeSpec;
    folding?: boolean;
    style?: Partial<CSSStyleDeclaration>;
};

/**
 * `#rrbbgg` or `#rrggbbaa` format
 * @example '#aabbcc', '#0000004d'
 */
export declare type WebColorString = string;

/**
 *
 */
export declare class XAxisNodeLayout implements INodeLayoutManager {
    readonly layoutContext: NodeLayoutContext;
    constructor(layoutContext: NodeLayoutContext);
    get name(): string;
    /**
     * reflective layout manager relative to parent
     *
     */
    private _reverseXPos;
    doLayout: (nodeUI: NodeUI, context: LayoutParam) => void;
    setPosition: (nodeUI: NodeUI, context: PositionParam) => void;
}

export declare class XYAxisNodeLayout implements INodeLayoutManager {
    readonly layoutContext: NodeLayoutContext;
    constructor(layoutContext: NodeLayoutContext);
    get name(): string;
    doLayout(nodeUI: NodeUI, context: LayoutParam): void;
    setPosition: (nodeUI: NodeUI, context: PositionParam) => void;
}

export declare class YAxisNodeLayout implements INodeLayoutManager {
    readonly layoutContext: NodeLayoutContext;
    constructor(layoutContext: NodeLayoutContext);
    get name(): string;
    /**
     * reflective layout manager relative to parent
     *
     */
    _reverseYPos(node: NodeUI, context: LayoutParam): void;
    doLayout: (nodeUI: NodeUI, context: LayoutParam) => void;
    setPosition: (nodeUI: NodeUI, context: PositionParam) => void;
}

export declare type ZeroOrPositiveNumber = number;

export { }
