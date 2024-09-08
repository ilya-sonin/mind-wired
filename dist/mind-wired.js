var Ae = Object.defineProperty;
var Pe = (n, e, t) => e in n ? Ae(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var c = (n, e, t) => Pe(n, typeof e != "symbol" ? e + "" : e, t);
const g = {
  DRAG: {
    VIEWPORT: { name: "viewport.dragged", desc: "" },
    NODE: { name: "node.dragged", desc: "" }
  },
  NODE: {
    CREATED: {
      name: "node.created",
      desc: "new node created",
      CLIENT: {
        name: "node.created.client",
        desc: "client-side node creation event"
      }
    },
    DELETED: {
      name: "node.deleted_old",
      desc: "node has been deleted",
      CLIENT: {
        name: "node.deleted_old.client",
        desc: "client-side node deletion event"
      }
    },
    DELETED2: {
      name: "node.deleted",
      desc: "node has been deleted",
      CLIENT: {
        name: "node.deleted.client",
        desc: "client-side node deletion event"
      }
    },
    UPDATED: {
      name: "node.updated",
      desc: "content of node updated",
      CLIENT: {
        name: "node.updated.client",
        desc: "client-side node update event"
      }
    },
    SELECTED: {
      name: "node.selected",
      desc: "one or more nodes selected",
      CLIENT: {
        name: "node.selected.client",
        desc: "client-side node selection event"
      }
    },
    CLICKED: {
      name: "node.clicked",
      desc: "a node clicked(without dragging)",
      CLIENT: {
        name: "node.clicked.client",
        desc: "client-side node click event"
      }
    },
    EDITING: {
      name: "node.editing",
      desc: "node's editing state",
      CLIENT: {
        name: "node.editing.client",
        desc: "client-side node editing state"
      }
    },
    FOLDED: {
      name: "node.folded",
      desc: "node is folded or unfolded",
      CLIENT: {
        name: "node.folded.client",
        desc: "client-side node editing state"
      }
    },
    MOVED: {
      name: "node.moved",
      desc: "node is folded or unfolded",
      CLIENT: {
        name: "node.moved.client",
        desc: "client-side node editing state"
      }
    }
  },
  VIEWPORT: {
    RESIZED: {
      name: "viewport.resized",
      desc: "viewport size chaged"
    },
    CLICKED: {
      name: "viewport.clicked",
      desc: "viewport has been clicked"
    }
  },
  SCHEMA: {
    CREATED: {
      name: "schema.created",
      desc: "",
      CLIENT: { name: "schema.created.client", desc: "" }
    },
    UPDATED: {
      name: "schema.updated",
      desc: "",
      CLIENT: { name: "schema.updated.client", desc: "" }
    },
    DELETED: {
      name: "schema.deleted",
      desc: "",
      CLIENT: { name: "schema.deleted.client", desc: "" }
    }
  }
}, qs = g, ze = (n) => {
  const e = n.toUpperCase().split(".");
  let t = g;
  for (let s = 0; s < e.length; s++)
    if (t = t[e[s]], !t)
      throw new Error(`invalid event name: [${n}]`);
  if (t.name !== n)
    throw new Error(`event name mismatch: [${n}]`);
  return t;
};
class We {
  constructor() {
    c(this, "callbacks");
    this.callbacks = /* @__PURE__ */ new Map();
  }
  on(e, t) {
    let s = this.callbacks.get(e.name);
    s || (s = [], this.callbacks.set(e.name, s)), s.push(t);
  }
  off(e, t) {
    const s = this.callbacks.get(e);
    if (!s)
      return;
    const i = s.findIndex((o) => o === t);
    s.splice(i, 1);
  }
  /**
   * used to register client-side callback
   * @param {MindWiredEvent} eventName like "valid.event.path" format
   * @param {function} callback
   */
  listen(e, t) {
    this.on(e, t);
  }
  emit(e, t) {
    (this.callbacks.get(e.name) || []).forEach((i) => {
      try {
        i(t);
      } catch (o) {
        console.log(o);
      }
    });
  }
}
const J = () => {
}, Be = J, Fe = J, Q = (n) => {
  let e = n.touches[0];
  n.type === "touchend" && (e = n.changedTouches[0]), n.clientX = e.clientX, n.clientY = e.clientY, n.layerX = 0, n.layerY = 0, n.offsetX = 0, n.offsetY = 0, n.pageX = e.pageX, n.pageY = e.pageY, n.screenX = e.screenX, n.screenY = e.screenY;
}, me = (n) => {
  clearTimeout(n.touchTimer), n.touchTimer = void 0;
}, ye = (n, e) => {
  const { handler: t } = n;
  t.accept(e.target) && (n.dragging = {
    originalEvent: e,
    sx: e.pageX,
    sy: e.pageY,
    dx: 0,
    dy: 0,
    ghost: void 0,
    once: void 0
  }, t.beforeDrag(n.dragging));
}, ve = (n, e) => {
  n.dragging && (e.preventDefault(), n.dragging.once && (n.dragging.once(), n.dragging.once = void 0), n.originalEvent = e, n.dragging.dx = e.pageX - n.dragging.sx, n.dragging.dy = e.pageY - n.dragging.sy, n.handler.dragging(n.dragging));
}, we = (n, e) => {
  n.originalEvent = e;
  const t = document.querySelector("body");
  t && (t.style.cursor = "");
  try {
    n.dragging && n.handler.afterDrag(n.dragging);
  } catch (s) {
    console.log("[DND error]", s);
  } finally {
    n.data.clear(), n.dragging = void 0;
  }
}, Ie = (n, e) => {
  n.touchTimer = window.setTimeout(() => {
    Q(e), ye(n, e);
  }, 10);
}, He = (n, e) => {
  me(n), Q(e), ve(n, e);
}, qe = (n, e) => {
  me(n), Q(e), we(n, e);
}, Ve = (n) => {
  const { handler: e } = n;
  e.beforeDrag = e.beforeDrag || J, e.dragging = e.dragging || Be, e.afterDrag = e.afterDrag || Fe, window.addEventListener("mousedown", (t) => ye(n, t), !1), window.addEventListener(
    "mousemove",
    (t) => ve(n, t),
    {
      passive: !1
    }
  ), window.addEventListener("mouseup", (t) => we(n, t), !1), window.addEventListener("touchstart", (t) => Ie(n, t), !1), window.addEventListener("touchmove", (t) => He(n, t), {
    passive: !1
  }), window.addEventListener(
    "toucend",
    (t) => qe(n, t),
    !1
  );
};
class Xe {
  constructor(e) {
    c(this, "touchTimer");
    c(this, "dragging");
    c(this, "handler");
    c(this, "data");
    c(this, "originalEvent");
    this.touchTimer = void 0, this.handler = e, this.data = /* @__PURE__ */ new Map(), Ve(this);
  }
  capture(e, t) {
    this.data.set(e, t);
  }
  getData(e) {
    return this.data.get(e);
  }
}
const Ke = 180 / Math.PI, C = class C {
  constructor(e = 0, t = 0) {
    c(this, "x");
    c(this, "y");
    this.x = e, this.y = t;
  }
  clone() {
    return new C(this.x, this.y);
  }
  sum(e) {
    return new C(this.x + e.x, this.y + e.y);
  }
};
c(C, "ZERO", new C(0, 0));
let m = C;
class Ye {
  constructor(e, t = m.ZERO) {
    /**
     * [-180, +180] degrees from positive X axis
     */
    c(this, "_degree");
    this.target = e, this.base = t;
    const s = this.target.x - t.x, i = this.target.y - t.y;
    this._degree = Math.atan2(i === 0 ? 0 : -i, s) * Ke;
  }
  /**
   * counter clock wise from X-AXIS(east), which is quadrant(1 > 2 > 3 > 4)
   * @returns [0, 360) degree
   */
  get ccwx() {
    const e = this._degree;
    return e < 0 ? 360 + e : e;
  }
  /**
   * clock wise from Y-AXIS(north), which is quadrant(1 > 4 > 3 > 2)
   * @returns [0, 360) degree
   */
  get cwy() {
    let e = 90 - this._degree;
    return e < 0 ? 360 + e : e;
  }
  /**
   * get quadrant number in math
   * ```
   *   2 | 1
   *  ---+---> X
   *   3 | 4
   * ```
   * @returns 1 when [0, 90), 2 when [90, 180), 3 when [180, 270), 4 when [270, 360)
   */
  get quadrant() {
    const e = this.ccwx;
    if (e < 90)
      return 1;
    if (e < 180)
      return 2;
    if (e < 270)
      return 3;
    if (e < 360)
      return 4;
    throw new Error(`unexpected ccwx: ${e}`);
  }
}
class Ge {
  constructor() {
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
    c(this, "rotate", (e, t, s, i = { scale: 1 }) => {
      const o = (t.x - e.x) * i.scale, r = (t.y - e.y) * i.scale, d = s * Math.PI / 180, a = Math.cos(d), l = Math.sin(d);
      return {
        x: o * a - r * l + e.x,
        y: o * l + r * a + e.y
      };
    });
  }
  heading(e, t) {
    return new Ye(e, t);
  }
}
const K = new Ge(), je = (n) => ({
  beforeDrag: (e) => {
    n.dndContext.capture("offset", n.config.getOffset());
  },
  dragging: (e) => {
    const { dx: t, dy: s } = e;
    if (t === 0 && s === 0)
      return;
    n.dndContext.capture("dragged", !0);
    const i = n.dndContext.getData("offset");
    n.config.emit(g.DRAG.VIEWPORT, {
      state: "drag",
      offset: new m(i.x + t, i.y + s)
    });
  },
  afterDrag: (e) => {
    const { dx: t, dy: s } = e;
    if (t !== 0 || s !== 0) {
      const o = n.dndContext.getData("offset");
      n.config.emit(g.DRAG.VIEWPORT, {
        state: "done",
        offset: new m(o.x + t, o.y + s)
      });
    }
    n.dndContext.getData("dragged") || n.config.emit(g.VIEWPORT.CLICKED);
  }
}), Ze = (n) => ({
  beforeDrag: (e) => {
    const { target: t } = e.originalEvent, i = n.dom.closest(t, ".mwd-node").dataset.uid;
    n.dndContext.capture("nodeId", i);
    const r = n.config.mindWired().findNode((d) => d.uid === i);
    n.config.emit(g.NODE.SELECTED, {
      nodes: [r],
      append: e.originalEvent.shiftKey,
      type: "select"
    }), n.config.emit(g.DRAG.NODE, {
      nodeId: i,
      state: "ready",
      target: e.originalEvent.shiftKey ? "children" : "all",
      x: 0,
      y: 0
    });
  },
  dragging: (e) => {
    const { dx: t, dy: s } = e, i = n.dndContext.getData("nodeId"), { scale: o } = n.config;
    n.config.emit(g.DRAG.NODE, {
      nodeId: i,
      state: "drag",
      target: e.originalEvent.shiftKey ? "children" : "all",
      x: t / o,
      y: s / o
    });
  },
  afterDrag: (e) => {
    const { dx: t, dy: s } = e, i = n.dndContext.getData("nodeId"), { scale: o } = n.config;
    n.config.emit(g.DRAG.NODE, {
      nodeId: i,
      state: "done",
      target: e.originalEvent.shiftKey ? "children" : "all",
      x: t / o,
      y: s / o
    });
  }
}), Je = (n) => ({
  beforeDrag: () => {
  },
  dragging: (e) => {
    const { dx: t, dy: s } = e, i = n.dndContext.getData("iconEl");
    n.dom.css(i, {
      transform: `translate(calc(-50% + ${t}px), ${s}px)`
    });
  },
  afterDrag: () => {
    const { dom: e } = n, t = n.dndContext.getData("iconEl"), s = e.domRect(t), i = s.x + s.width / 2, o = s.y + s.height / 2;
    e.css(t, {
      transform: "translate(-50%, 0)"
    });
    const r = n.findNodeAt(i, o);
    if (r) {
      const a = n.config.mindWired().getSelectedNodes();
      a.filter((l) => r.isDescendantOf(l)).length > 0 || n.config.mindWired().moveNodes(r, a, !0);
    }
  }
}), Qe = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20height='24px'%20viewBox='0%200%2024%2024'%20width='24px'%20fill='%23000000'%3e%3cpath%20d='M0%200h24v24H0V0z'%20fill='none'/%3e%3cpath%20d='M12%202C6.48%202%202%206.48%202%2012s4.48%2010%2010%2010%2010-4.48%2010-10S17.52%202%2012%202zm0%2018c-4.41%200-8-3.59-8-8s3.59-8%208-8%208%203.59%208%208-3.59%208-8%208zm3-13.5V9h-4v2h4v2.5l3.5-3.5zm-6%204L5.5%2014%209%2017.5V15h4v-2H9z'/%3e%3c/svg%3e", Ue = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20height='24'%20viewBox='0%20-960%20960%20960'%20width='24'%3e%3cpath%20d='M480-134.616%20313.078-301.539l43.383-43.383L480-221.384l123.539-123.538%2043.383%2043.383L480-134.616Zm-123.539-478L313.078-656%20480-822.922%20646.922-656l-43.383%2043.384L480-736.155%20356.461-612.616Z'/%3e%3c/svg%3e", U = {
  viewport: `<div data-mind-wired-viewport>
    <canvas></canvas>
    <div class="mwd-selection-area"><div class="ctrl-icon" data-cmd="set-para" style="display:none;"><img src="${Qe}"></div></div>
    <div class="mwd-nodes"></div>
  </div>`,
  node: `<div class="mwd-node">
    <div class="mwd-body" tabIndex="0"></div>
    <div class="mwd-subs"></div>
    <div class="mwd-node-ctrl"></div>
  </div>`,
  foldingControl: `<div class="ctrl-icon" data-cmd="unfolding"><img src="${Ue}"></div>`
}, et = (n) => {
  var d;
  const { el: e, ui: t, dom: s } = n.config, i = t.width || 600, o = t.height || 600;
  let r = s.findOne(e, "[data-mind-wired-viewport]");
  return r || (r = s.parseTemplate(U.viewport, {}), t.useDefaultIcon || (d = r.querySelector("img")) == null || d.remove(), t.mapId && (r.dataset.mindWiredViewport = t.mapId), e.append(r)), s.findOne(r, ":scope > canvas") || r.appendChild(s.tag.canvas()), s.findOne(
    r,
    ":scope > .mwd-selection-area"
  ) || r.appendChild(s.tag.div(".mwd-selection-area")), s.findOne(r, ":scope > .mwd-nodes") || r.appendChild(s.tag.div(".mwd-nodes")), s.attr(r, "tabIndex", "0"), s.css(r, { width: i, height: o }), r;
}, oe = (n) => {
  if (n) {
    const { devicePixelRatio: e } = window, { config: t, $viewport: s, $canvas: i } = n, { offsetWidth: o, offsetHeight: r } = s;
    n.dom.css(i, { width: o, height: r }), n.dom.attr(i, "width", String(e * o), !0), n.dom.attr(
      i,
      "height",
      String(e * r),
      !0
    );
    const d = i.getContext("2d", { alpha: !1 });
    n.$ctx = d, n.$ctx.scale(e, e), n.drawNodeSelection(), t.emit(g.VIEWPORT.RESIZED);
  }
}, re = (n, e, t) => {
  const s = t.ui.clazz.schema(n);
  t.dom.clazz.add(e, s);
}, F = (n, e) => {
  if (e.$el)
    throw new Error(`[MINDWIRED] already installed. (${e.uid})`);
  const t = e.$el = n.dom.parseTemplate(U.node), s = n.config.mindWired(), i = s.getNodeRender(e.model), o = s.translateModel(e.model), r = n.getNodeBody(e);
  i.install(e.model, r), o.schema && (re(o.schema, t, n.config), re(o.schema, r, n.config));
  const d = n.elemOf(".mwd-nodes");
  return e.isRoot() ? d.append(t) : n.dom.findOne(e.parent.$el, ".mwd-subs").append(t), t.dataset.uid = e.uid, e.$el;
}, Y = (n, e, t = !1) => {
  if (!e.$el)
    throw new Error(`[MINDWIRED][ERROR] not registered node. (${e.uid})`);
  if (e.$el.remove(), delete e.$el, t) {
    const { subs: s } = e;
    s && s.forEach((i) => Y(n, i));
  }
}, tt = (n) => {
  const { dom: e } = n;
  return new Xe({
    accept: (t) => {
      const s = n.config.mindWired();
      if (e.closest(t, "[data-editor-element]"))
        return !1;
      if (e.is(t, '[data-cmd="set-para"]')) {
        const i = e.closest(t, '[data-cmd="set-para"]');
        return n.dndContext.capture("iconEl", i), n.dndContext.capture("handler", Je(n)), !0;
      } else {
        if (e.closest(t, "[data-cmd]"))
          return !1;
        if (e.is(t, "canvas"))
          return n.dndContext.capture("handler", je(n)), !0;
        if (e.is(t, ".mwd-node")) {
          const o = e.closest(t, ".mwd-node").dataset.uid;
          return n.dndContext.capture("handler", Ze(n)), n.dndContext.capture("nodeId", o), n.dndContext.capture("editing", s.isEditing()), !0;
        } else
          return !1;
      }
    },
    beforeDrag: (t) => {
      n.dndContext.getData("handler").beforeDrag(t);
    },
    dragging: (t) => {
      n.dndContext.getData("editing") || n.dndContext.getData("handler").dragging(t);
    },
    afterDrag: (t) => {
      n.dndContext.getData("editing") || n.dndContext.getData("handler").afterDrag(t);
    }
  });
}, st = (n, e, t, s) => {
  var o;
  let i = n.querySelector(
    ':scope > [data-cmd="unfolding"]'
  );
  if (!i) {
    const { dom: r } = t;
    i = r.parseTemplate(U.foldingControl, {}), r.css(i, {
      transform: `translate(${e.width / 2 + 4}px, -50%)`,
      zIndex: 0
    }), t.ui.useDefaultIcon || (o = i.querySelector("img")) == null || o.remove(), n.append(i), s(i);
  }
}, I = (n, e, t) => {
  e && Object.keys(e).forEach((s) => {
    const i = e[s];
    i && (n[s] = i);
  }), t && t(n);
};
class nt {
  constructor(e) {
    c(this, "config");
    c(this, "$viewport");
    c(this, "dndContext");
    c(this, "resizeObserver");
    c(this, "selectionArea");
    c(this, "$ctx");
    this.config = e, this.$viewport = et(this), oe(this), this.dndContext = tt(this);
    let t;
    const s = () => {
      clearTimeout(t), t = window.setTimeout(oe, 150, this);
    };
    this.resizeObserver = new ResizeObserver(s), this.resizeObserver.observe(this.$viewport);
  }
  get dom() {
    return this.config.dom;
  }
  get $canvas() {
    return this.$viewport.querySelector(
      "canvas"
    );
  }
  get $holder() {
    return this.$viewport.querySelector(".mwd-nodes");
  }
  get scale() {
    return this.config.scale;
  }
  getContext() {
    return this.$ctx;
  }
  getHolderOffset() {
    const e = this.$holder;
    return { x: e.offsetLeft, y: e.offsetTop };
  }
  /**
   * multiply scale to numeric properties
   * @param obj object to mutiply scale
   * @returns
   */
  setScale(e) {
    const { scale: t } = this;
    if (typeof e == "number")
      return e * t;
    if (Array.isArray(e)) {
      const s = [...e];
      return s.forEach((i, o) => {
        s[o] = this.setScale(i);
      }), s;
    } else if (typeof e == "object") {
      const s = { ...e };
      for (let i in s)
        s[i] = this.setScale(e[i]);
      return s;
    }
    return e;
  }
  /**
   * multiply scale to numeric properties
   * @param point point to multiply scale
   * @returns
   */
  getScaledPos(e) {
    return e.x *= this.scale, e.y *= this.scale, e;
  }
  /**
   * multiply scale to offset(x,y) of the node
   * @param node
   * @returns
   */
  getScaledOffset(e) {
    return this.getScaledPos(e.offset());
  }
  getDimension() {
    const e = this.$canvas;
    return { width: e.offsetWidth, height: e.offsetHeight };
  }
  getNodeDimension(e, t = !1) {
    const s = e.dimension(t), { scale: i } = this.config;
    return s.center.x *= i, s.center.y *= i, s;
  }
  getAbsoluteDimensions(e) {
    const t = e.map((i) => this.getNodeDimension(i));
    return t.reduce(
      (i, o) => i.merge(o),
      t[0]
    );
  }
  elemOf(e) {
    return this.$viewport.querySelector(e);
  }
  shiftBy(e, t) {
    const s = this.config.getOffset();
    s.x += e, s.y += t, this.config.setOffset(s), this.repaintNodeHolder();
  }
  renderWith(e) {
    const t = this.getContext(), s = this.getHolderOffset();
    try {
      t.translate(s.x, s.y), t.save(), e(t);
    } finally {
      t.restore(), t.translate(-s.x, -s.y);
    }
  }
  findNodeAt(e, t) {
    const s = this.$holder.querySelectorAll(".mwd-body");
    let i = null;
    const { dom: o } = this;
    for (let l = 0; l < s.length; l++) {
      const h = o.domRect(s[l]);
      if (h.left <= e && h.right >= e && h.top <= t && h.bottom >= t) {
        i = s[l];
        break;
      }
    }
    if (!i)
      return null;
    const r = this.config.mindWired(), d = o.closest(i, ".mwd-node");
    return r.findNode((l) => l.uid === d.dataset.uid);
  }
  drawPath(e, t, s) {
    this.renderWith((i) => {
      I(i, t, s), i.beginPath();
      let o = e[0];
      i.moveTo(o.x, o.y), e.forEach((r) => {
        i.lineTo(r.x, r.y);
      }), i.stroke();
    });
  }
  drawCurve(e, t, s, i) {
    this.renderWith((o) => {
      I(o, s.props, i);
      const r = Math.sqrt(
        (e.x - t.x) * (e.x - t.x) + (e.y - t.y) * (e.y - t.y)
      ), d = s.degree, l = r * s.ratio / r * this.scale, h = K.rotate(e, t, d, { scale: l }), u = K.rotate(t, e, d, { scale: l });
      o.beginPath(), o.moveTo(e.x, e.y), o.bezierCurveTo(h.x, h.y, u.x, u.y, t.x, t.y), o.stroke();
    });
  }
  drawBeizeCurve(e, t, s, i) {
    const o = this.getContext();
    o.save(), I(o, s.props, i);
    const [r, d] = s.cpoints, a = this.getHolderOffset();
    o.beginPath(), o.moveTo(a.x + e.x, a.y + e.y), o.bezierCurveTo(
      a.x + r.x,
      a.y + r.y,
      a.x + d.x,
      a.y + d.y,
      a.x + t.x,
      a.y + t.y
    ), o.stroke(), o.restore();
  }
  drawVLines(e, t) {
    const s = this.$viewport.offsetHeight, i = this.getContext();
    i.save(), typeof t == "function" && t(i), i.beginPath();
    const o = this.getHolderOffset();
    e.forEach((r) => {
      i.moveTo(o.x + r, 0), i.lineTo(o.x + r, s);
    }), i.stroke(), i.closePath(), i.restore();
  }
  drawHLines(e, t) {
    const s = this.$viewport.offsetWidth, i = this.getContext();
    i.save(), typeof t == "function" && t(i), i.beginPath();
    const o = this.getHolderOffset();
    e.forEach((r) => {
      i.moveTo(0, o.y + r), i.lineTo(s, o.y + r);
    }), i.stroke(), i.closePath(), i.restore();
  }
  clear() {
    const e = this.getDimension(), t = this.getContext();
    t.fillStyle = "white", t.fillRect(0, 0, e.width, e.height);
  }
  repaintNodeHolder() {
    const e = this.config.getOffset(), { scale: t } = this.config;
    this.dom.css(this.$holder, {
      top: `calc(50% + ${e.y}px)`,
      left: `calc(50% + ${e.x}px)`,
      transform: `scale(${t})`
    }), this.drawNodeSelection();
  }
  moveNode(e) {
    const { parent: t } = e;
    this.dom.findOne(t.$el, ".mwd-subs").append(e.$el);
  }
  drawNodeSelection() {
    const e = this.selectionArea;
    if (!e)
      return;
    const { selection: t } = this.config.ui, { dom: s } = this, i = this.getHolderOffset(), o = s.findOne(this.$viewport, ".mwd-selection-area");
    s.css(o, {
      left: i.x + e.left - t.padding,
      top: i.y + e.top - t.padding,
      width: e.width + 2 * t.padding,
      height: e.height + 2 * t.padding
    });
    const r = s.findOne(o, "div");
    s.css(r, {
      display: "",
      width: 24,
      height: 24
    });
  }
  updateSelection(e) {
    !e || e.length === 0 || (this.clearNodeSelection(), this.selectionArea = this.getAbsoluteDimensions(e), this.drawNodeSelection());
  }
  clearNodeSelection() {
    if (this.selectionArea) {
      const { dom: e } = this, t = e.findOne(this.$viewport, ".mwd-selection-area");
      e.css(t, { top: -1, left: -1, width: 0, height: 0 });
      const s = e.findOne(t, "div");
      e.css(s, { display: "none" }), this.selectionArea = void 0;
    }
  }
  drawNode(e) {
    e.$el || F(this, e);
    const { $el: t, zIndex: s } = e, i = t.querySelector(".mwd-body"), o = this.config.foldedNodeClassName(), { dom: r } = this;
    e.isFolded() ? r.clazz.add(t, o) : r.clazz.remove(t, o);
    const d = e.getPos();
    r.css(t, { top: d.y, left: d.x, zIndex: s });
    const a = e.isSelected() ? "add" : "remove", l = this.config.activeClassName("node");
    r.clazz[a](i, l);
    const h = this.config.nodeLevelClassName(e);
    r.clazz.add(i, h), i.dataset.level = `${e.level()}`;
    const { style: u } = e.view;
    u && r.renderStyle(i, u);
    const f = this.config.mindWired(), p = f.getNodeRender(e.model), w = f.translateModel(e.model);
    p.render(w, i, {
      selected: e.selected,
      editing: e.editing
    });
  }
  showNodeEditor(e, t) {
    const { uid: s } = e, o = this.config.mindWired().translateModel(e.model), r = this.$holder.querySelector(`[data-uid=${s}]`), d = t.showEditor(
      o,
      r,
      e.getStyle("style")
    );
    return this.dom.css(d, { transform: `scale(${1 / this.scale})` }), d.dataset.editorElement = "", new Promise((a) => {
      setTimeout(a);
    });
  }
  hideNodeEditor(e) {
    const { uid: t } = e, { dom: s } = this, i = this.$holder.querySelector(`[data-uid=${t}]`), o = s.findOne(i, "[data-editor-element]");
    o && o.remove(), s.findOne(i, ".mwd-body").focus();
  }
  regsiterNode(e) {
    F(this, e);
  }
  unregisterNode(e) {
    Y(this, e), this.clearNodeSelection();
  }
  unregisterNodeTree(e) {
    Y(this, e, !0);
  }
  updateFoldingNodes(e) {
    const t = e.isFolded() ? "none" : "", { dom: s } = this, i = s.findOne(this.$holder, `[data-uid="${e.uid}"]`), o = s.findOne(i, ":scope > .mwd-subs");
    if (s.css(o, { display: t }), e.isFolded()) {
      const r = s.domRect(e.$bodyEl);
      st(i, r, this.config, (d) => {
        s.event.click(d, (a) => {
          a.stopPropagation(), this.config.mindWired().setFoldingState([e], !1);
        });
      });
    } else
      s.findOne(i, ':scope > [data-cmd="unfolding"]').remove();
  }
  getNodeBody(e) {
    let t = e.$el;
    return t || (t = F(this, e)), t.querySelector(".mwd-body");
  }
  drawSchema(e) {
    const { name: t, style: s } = e;
    if (s) {
      const { mapId: i, styleDef: o } = this.config.ui, r = o.schema.styleId.replace("@schema", t).replace("@mapId", i ? `-${i}` : "");
      let d = document.querySelector(r);
      d || (d = this.dom.tag.style(r), document.head.appendChild(d));
      const a = Object.keys(s).reduce((h, u) => {
        const f = u.replace(
          /[A-Z]/g,
          (p) => `-${p.toLowerCase()}`
        );
        return h + `${f}: ${s[u]};`;
      }, ""), l = o.schema.selector.replace("@schema", t).replace("@mapId", i ? `="${i}"` : "");
      d.innerHTML = `${l} { ${a} }`;
    }
  }
  removeSchema(e) {
    const { mapId: t, styleDef: s } = this.config.ui, i = s.schema.styleId.replace("@schema", e).replace("@mapId", t ? `-${t}` : "");
    let o = document.querySelector(i);
    o && o.remove();
  }
  bindSchema(e, t) {
    const { model: s } = e.spec, { name: i } = t, o = s.schema ? s.schema.split(" ").map((d) => d.trim()) : [];
    if (o.includes(i))
      return !1;
    o.push(i), s.schema = o.join(" ").trim();
    const r = this.getNodeBody(e);
    return e.$el.classList.add(i), r.classList.add(i), !0;
  }
  unbindSchema(e, t) {
    const { model: s } = e.spec;
    if (!s.schema)
      return !1;
    const { name: i } = t, o = s.schema.split(" ").map((d) => d.trim()).filter((d) => d.length > 0 && d !== i);
    s.schema = o.join(" ").trim(), s.schema.length === 0 && delete s.schema;
    const r = this.getNodeBody(e);
    return e.$el.classList.remove(i), r.classList.remove(i), !0;
  }
}
class O {
  /**
   * provides default option to be used for pollyfill
   */
  get defaultOption() {
  }
  getRenderingOption(e) {
    const t = e.$style.option, { defaultOption: s } = this;
    if (s !== void 0)
      for (let i in s)
        t[i] === void 0 && s[i] !== void 0 && (t[i] = s[i]);
    return t;
  }
}
const it = (n) => n && n.valign || "center", S = (n, e, t, s) => {
  const i = n[t], o = n[e];
  return new m(i, o + s);
};
class ot extends O {
  get name() {
    return "line";
  }
  /**
   * drawing line between srcNode and dstNode
   * @param canvas
   * @param srcNode
   * @param dstNode
   */
  render(e, t, s) {
    const { scale: i } = e, [o, r] = [t, s].map(
      (y) => e.getNodeDimension(y)
    ), d = this.getRenderingOption(t), a = it(d), l = [], h = [], u = t.$style, f = u.width * i, p = s.$style, w = p.width * i, k = Math.abs(f - w), A = w / 2;
    if (a === "center")
      l.push(o.center, r.center);
    else if (a === "bottom") {
      const y = o.cx <= r.cx, T = y ? 2 : -2, ke = y ? "right" : "left", se = y ? ["left", "right"] : ["right", "left"], P = S(o, "bottom", ke, A), z = P.clone();
      z.x += T;
      const W = S(r, "bottom", se[0], A), B = W.clone();
      if (B.x -= T, l.push(P, z, B, W), l.push(S(r, "bottom", se[1], A)), k > 0) {
        const ne = P.clone();
        ne.y += k;
        const ie = z.clone();
        ie.y += k, h.push(ne, ie, B, W);
      }
    }
    if (e.drawPath(
      l,
      {
        lineWidth: w,
        strokeStyle: p.color,
        lineJoin: "round"
      },
      (y) => {
        p.dash && y.setLineDash(p.dash);
      }
    ), h.length > 0 && e.drawPath(
      h,
      {
        lineWidth: w,
        strokeStyle: p.color,
        lineJoin: "round"
      },
      (y) => {
        p.dash && y.setLineDash(p.dash);
      }
    ), t.isRoot() && a === "bottom") {
      const y = f / 2;
      e.drawPath(
        [
          S(o, "bottom", "left", y),
          S(o, "bottom", "right", y)
        ],
        {
          lineWidth: f,
          strokeStyle: u.color,
          lineJoin: "round"
        },
        (T) => {
          u.dash && T.setLineDash(u.dash);
        }
      );
    }
  }
}
class rt extends O {
  get name() {
    return "curve";
  }
  get defaultOption() {
    return { deg: 20, ratio: 0.4 };
  }
  render(e, t, s) {
    const { scale: i } = e, [o, r] = [t, s].map(
      (l) => e.getScaledOffset(l)
    ), d = s.$style, a = this.getRenderingOption(s);
    e.drawCurve(
      o,
      r,
      {
        degree: a.deg || 20,
        ratio: a.ratio || 0.4,
        props: {
          lineWidth: d.width * i,
          strokeStyle: d.color
        }
      },
      d.getEdgeRenderer()
    );
  }
}
const dt = (n) => n && n.valign || "center", R = (n, e, t, s) => {
  const i = n[t], o = n[e];
  return new m(i, o + s);
}, de = (n, e, t, s) => {
  const i = s / 2;
  n.drawPath(
    [
      { x: t.left, y: t.bottom + i },
      { x: t.right, y: t.bottom + i }
    ],
    { lineWidth: s, strokeStyle: e.color },
    (o) => {
      e.dash && o.setLineDash(e.dash);
    }
  );
}, at = (n, e, t, s, i) => {
  const { scale: o } = n, r = t.width * o, d = i.width * o, a = Math.min(r, d), l = s.x - e.x, h = Math.abs(r - d);
  e.y -= h / 2;
  const u = { lineWidth: a, strokeStyle: i.color }, f = (p) => {
    i.dash && p.setLineDash(i.dash);
  };
  n.drawBeizeCurve(
    e,
    s,
    {
      cpoints: [
        { x: e.x + l / 2, y: e.y },
        { x: s.x - l / 2, y: s.y }
      ],
      props: u
    },
    f
  ), h > 0 && (e.y += h, h / 2 >= d && (u.lineWidth = r), n.drawBeizeCurve(
    e,
    s,
    {
      cpoints: [
        { x: e.x + l / 2, y: e.y },
        { x: s.x - l / 2, y: s.y }
      ],
      props: u
    },
    f
  ));
};
class ct extends O {
  get name() {
    return "mustache_lr";
  }
  render(e, t, s) {
    const [i, o] = [t, s].map(
      (p) => e.getNodeDimension(p)
    ), r = {
      src: t.$style.width * e.scale,
      dst: s.$style.width * e.scale
    }, d = this.getRenderingOption(t), a = dt(d) === "bottom";
    a && t.firstChild() === s && de(e, t.$style, i, r.src);
    let l, h;
    const u = i.cx <= o.cx, f = a ? "bottom" : "cy";
    u ? (l = R(i, f, "right", r.src / 2), h = R(o, f, "left", r.dst / 2)) : (l = R(i, f, "left", r.src / 2), h = R(o, f, "right", r.dst / 2)), at(e, l, t.$style, h, s.$style), (s.isFolded() || s.isLeaf()) && a && de(e, s.$style, o, r.dst);
  }
}
const lt = (n, e, t, s, i, o) => {
  const { scale: r } = n, d = e.$style.width * r, a = s.$style.width * r, l = Math.min(d, a), h = Math.abs(d - a);
  t.center.x -= h / 2;
  const u = { lineWidth: l, strokeStyle: s.$style.color }, f = (p) => {
    e.$style.dash && p.setLineDash(e.$style.dash);
  };
  n.drawBeizeCurve(
    t.center,
    i.center,
    {
      cpoints: [
        { x: t.cx, y: t.cy + o / 2 },
        { x: i.cx, y: i.cy - o / 2 }
      ],
      props: u
    },
    f
  ), h > 0 && (t.center.y += h, n.drawBeizeCurve(
    t.center,
    i.center,
    {
      cpoints: [
        { x: t.cx, y: t.cy + o / 2 },
        { x: i.cx, y: i.cy - o / 2 }
      ],
      props: u
    },
    f
  ));
};
class ht extends O {
  get name() {
    return "mustache_tb";
  }
  render(e, t, s) {
    const [i, o] = [t, s].map(
      (h) => e.getNodeDimension(h)
    ), r = { hor: 0, ver: 5 };
    let d, a;
    i.cy <= o.cy ? (d = i, a = o) : (d = o, a = i), d.center.y = d.bottom + r.ver, a.center.y = a.top - r.ver;
    const l = a.cy - d.cy;
    lt(e, t, i, s, o, i === d ? l : -l);
  }
}
const ae = (n, e) => {
  const t = [];
  return n.forEach((s, i) => {
    e(s) && t.push(i);
  }), t;
}, ut = (n) => {
  n.registerEdgeRenderer(new ot()), n.registerEdgeRenderer(new rt()), n.registerEdgeRenderer(new ct()), n.registerEdgeRenderer(new ht());
}, Ee = (n, e) => {
  n.children((t) => {
    const s = new xe(n, t);
    e.push(s), Ee(t, e);
  });
};
class xe {
  constructor(e, t) {
    c(this, "srcNode");
    c(this, "dstNode");
    c(this, "visible");
    this.srcNode = e, this.dstNode = t, this.visible = !0;
  }
  get src() {
    return this.srcNode;
  }
  get dst() {
    return this.dstNode;
  }
  matched(e) {
    return this.srcNode === e || this.dstNode === e;
  }
  matchedDst(e) {
    return this.dstNode === e;
  }
}
const be = (n, e, t) => {
  e.visible = t, n.filterEdges(
    (i) => i.src === e.dst && !i.src.isFolded()
  ).forEach((i) => {
    be(n, i, t);
  });
};
class gt {
  constructor(e, t) {
    c(this, "config");
    c(this, "canvas");
    c(this, "edges");
    c(this, "renderers", /* @__PURE__ */ new Map());
    this.config = e, this.canvas = t, this.edges = [], this.config.listen(g.VIEWPORT.RESIZED, (s) => {
      this.repaint();
    }).listen(g.NODE.MOVED, ({ node: s, prevParent: i }) => {
      this._deleteBetween(i, s), this._addEdge(s.parent, s), this.repaint();
    });
  }
  listRenderers() {
    return [...this.renderers.values()];
  }
  _addEdge(e, t) {
    const s = new xe(e, t);
    this.edges.push(s);
  }
  addEdge(e, t) {
    this._addEdge(e, t), this.repaint();
  }
  _deleteBetween(e, t) {
    return ae(
      this.edges,
      (i) => i.src === e && i.dst === t
    ).reverse().flatMap((i) => this.edges.splice(i, 1));
  }
  deleteBetween(e, t) {
    const s = this._deleteBetween(e, t);
    return s.length > 0 && this.repaint(), s;
  }
  /**
   * deletes edges matching the nodes
   * @param nodes
   */
  deleteEdges(e) {
    let t = 0;
    e.forEach((s) => {
      const i = ae(this.edges, (o) => o.matched(e[0]));
      i.length > 0 && i.reverse().forEach((o) => this.edges.splice(o, 1)), t += i.length;
    }), t > 0 && this.repaint();
  }
  setRootNode(e) {
    this.edges = [], Ee(e, this.edges);
  }
  registerEdgeRenderer(e) {
    const { name: t } = e;
    if (this.renderers.has(t))
      throw new Error(`duplicated edge name: [${t}]`);
    this.renderers.set(t, e);
  }
  filterEdges(e) {
    return this.edges.filter(e);
  }
  setEdgeVisible(e, t, s = !0) {
    this.filterEdges((o) => o.src === e).forEach((o) => {
      be(this, o, t);
    }), s && this.repaint();
  }
  repaint(e = !0) {
    e && this.canvas.clear(), this.edges.forEach((t) => {
      const { src: s, dst: i } = t, o = i.$style;
      t.visible && this.renderers.get(o.name.toLowerCase()).render(this.canvas, s, i);
    });
  }
  dispose() {
    const { edges: e } = this;
    e.splice(0, e.length), this.repaint();
  }
}
const ft = {
  name: "line",
  option: {},
  color: "#000000",
  width: 1,
  inherit: !0
}, N = (n, e) => {
  let t = n, s = t.getStyle("edge");
  for (; (!s[e] || t !== n && s.inherit === !1) && !t.isRoot(); )
    t = t.parent, s = t.getStyle("edge");
  return s[e] || ft[e];
};
class pt {
  constructor(e) {
    c(this, "nodeUI");
    this.nodeUI = e;
  }
  get name() {
    return N(this.nodeUI, "name");
  }
  get option() {
    return N(this.nodeUI, "option");
  }
  get color() {
    return N(this.nodeUI, "color");
  }
  get width() {
    const e = N(this.nodeUI, "width");
    if (typeof e == "function")
      return e(this.nodeUI.spec, this.nodeUI.level());
    if (typeof e == "number")
      return e;
    {
      const t = e;
      return Math.max(
        t.root + t.delta * this.nodeUI.level(),
        t.min
      );
    }
  }
  get dash() {
    return N(this.nodeUI, "dash");
  }
  getEdgeRenderer() {
  }
}
const Ce = (n) => {
  const e = typeof n;
  return "number,string,boolean,undefined".includes(e);
}, De = (n) => typeof n == "function", mt = (n) => n == null, ee = (n) => {
  if (n == null || Ce(n) || De(n))
    return n;
  const e = Array.isArray(n) ? [] : {};
  return Object.keys(n).forEach((t) => {
    const s = ee(n[t]);
    e[t] = s;
  }), e;
}, Se = (n, e) => (Object.keys(n).forEach((t) => {
  mt(e[t]) ? e[t] = ee(n[t]) : Ce(n[t]) || De(n[t]) ? e[t] = n[t] : Se(n[t], e[t]);
}), e), v = {
  deepCopy: ee,
  mergeLeaf: Se
};
class yt {
  constructor(e, t) {
    this.center = e, this._rect = t;
  }
  get width() {
    return this._rect.width;
  }
  get height() {
    return this._rect.height;
  }
  get left() {
    return this.center.x - this._rect.width / 2;
  }
  get right() {
    return this.center.x + this._rect.width / 2;
  }
  get top() {
    return this.center.y - this._rect.height / 2;
  }
  get bottom() {
    return this.center.y + this._rect.height / 2;
  }
  get cx() {
    return this.center.x;
  }
  get cy() {
    return this.center.y;
  }
  get x() {
    return this.left;
  }
  get y() {
    return this.top;
  }
  get r() {
    return this.right;
  }
  get b() {
    return this.bottom;
  }
  merge(e) {
    if (this === e)
      return this;
    const t = Math.min(this.left, e.left), s = Math.min(this.top, e.top), i = Math.max(this.right, e.right), o = Math.max(this.bottom, e.bottom);
    this.center.x = (i + t) / 2, this.center.y = (o + s) / 2;
    const r = i - t, d = o - s;
    return this._rect = new DOMRect(t, s, r, d), this;
  }
}
const vt = (n) => {
  const { subs: e } = n.spec;
  return !e || e.length === 0 ? [] : e.map((t) => {
    const s = new D(t, n.sharedConfig);
    return s.parent = n, s;
  });
};
let wt = 1;
class D {
  constructor(e, t, s) {
    c(this, "spec");
    c(this, "sharedConfig");
    c(this, "$el");
    c(this, "selected");
    c(this, "editing");
    c(this, "uid");
    c(this, "zIndex");
    c(this, "subs");
    c(this, "parent");
    c(this, "$style");
    // folding: boolean;
    c(this, "$dim");
    this.spec = e, this.sharedConfig = t, this.$el = void 0, this.selected = !1, this.editing = !1, this.uid = this.sharedConfig.ui.uuid(), this.zIndex = 0, this.subs = vt(this), this.parent = s, this.$style = new pt(this), this.$dim = void 0;
  }
  /**
   * ModelSpec of the node
   */
  get model() {
    return v.deepCopy(this.spec.model);
  }
  /**
   * ViewSpec of the node
   */
  get view() {
    const e = v.deepCopy(this.spec.view);
    return delete e.x, delete e.y, e;
  }
  get $bodyEl() {
    return this.sharedConfig.getCanvas().getNodeBody(this);
  }
  get x() {
    return this.spec.view.x;
  }
  get y() {
    return this.spec.view.y;
  }
  /**
   * offset(distance) from the direct parent node
   */
  get relativeOffset() {
    return new m(this.x, this.y);
  }
  /**
   * returns available NodeLayout.
   */
  get layout() {
    let { layout: e } = this.spec.view;
    return e ? { ...e } : this.parent && this.parent.layout;
  }
  /**
   * Indicates whether the node is currently active(selected) or not
   * @returns {boolean} true if the node is active(selected), otherwise false.
   */
  get active() {
    return !!this.$el;
  }
  /**
   * Return child nodes.
   * @returns {NodeUI[]} child nodes
   */
  get childNodes() {
    return [...this.subs];
  }
  /**
   * Returns whether the node is folded or not.
   * @returns {boolean} `true` if the node is folded, otherwise `false`.
   */
  get folding() {
    return this.spec.view.folding || !1;
  }
  /**
   * Returns whether the node is ready to use or not.
   * @returns {boolean} `true` if the node is ready to use, `false` otherwise.
   */
  isReady() {
    return !!this.$el;
  }
  /**
   * Calculate node's position and size.
   * @param {boolean} [relative=false] calculate relative position to parent node.
   * @returns {NodeRect} position and size of the node.
   */
  dimension(e = !1) {
    const t = this.$bodyEl, s = e ? this.relativeOffset : this.offset();
    return this.$dim = new yt(s, this.sharedConfig.dom.domRect(t));
  }
  /**
   * Calculate node's level in the tree structure.
   * (Root node's level is 0.)
   * @returns {number} node's level.
   */
  level() {
    return this.isRoot() ? 0 : this.parent.level() + 1;
  }
  getStyle(e) {
    return Object.assign({}, this.spec.view[e]);
  }
  /**
   * check if the node is selected or not.
   * @returns {boolean} `true` if selected, `false` otherwise.
   */
  isSelected() {
    return this.selected;
  }
  /**
   * Set the selected state of the node.
   * If the node is selected, the z-index is updated and the node is repainted
   * @param {boolean} selected - `true` if selected, `false` otherwise.
   */
  setSelected(e) {
    this.selected = e, this.zIndex = ++wt, this.active && this.selected !== e && this.repaint();
  }
  /**
   * Check if this node is a descendant of `dstNode`.
   * @param {NodeUI} dstNode - The destination node to check
   * @returns {boolean} `true` if this node is a descendant of `dstNode`, `false` otherwise.
   */
  isDescendantOf(e) {
    let t = this;
    for (; t; ) {
      if (t === e)
        return !0;
      t = t.parent;
    }
    return !1;
  }
  /**
   * Update the node model with the callback function.
   * @param {Function} callback - The callback function to update the node model.
   */
  updateModel(e) {
    const { model: t } = this.spec;
    e(t) && (this.$dim = null, this.sharedConfig.emit(g.NODE.UPDATED, {
      nodes: [this],
      type: "update"
    }));
  }
  getHeading() {
    return K.heading(new m(this.x, this.y));
  }
  /**
   * absolute offset
   * @returns offset from root to this node
   */
  offset() {
    let e = this;
    const t = new m(0, 0);
    for (; e; )
      t.x += e.x, t.y += e.y, e = e.parent;
    return t;
  }
  setOffset({ x: e, y: t }) {
    if (this.isRoot())
      return;
    const s = this.parent.offset();
    this.setPos(e - s.x, t - s.y);
  }
  /**
   * relative pos from the direct parent
   * @returns (x, y) from the direct parent
   */
  getPos() {
    return new m(this.x, this.y);
  }
  /**
   * Sets the position of the node
   *
   * @param {number} x - The x-coordinate of the position
   * @param {number} y - The y-coordinate of the position
   * @param {boolean} update - Flag indicating whether to repaint viewport
   */
  setPos(e, t, s = !0) {
    this.spec.view.x = e, this.spec.view.y = t, s && this.repaint();
  }
  isEditingState() {
    return this.editing;
  }
  /**
   * Set the editing state of the node.
   *
   * @param {boolean} editing - The new editing state to set
   */
  setEditingState(e) {
    this.editing = e, this.repaint();
  }
  /**
   * Check if the node is a root node.
   *
   * @return {boolean} Indicates if the node is a root node.
   */
  isRoot() {
    return this.spec.root;
  }
  /**
   * Check if the node is a leaf node.
   *
   * @return {boolean} Indicates if the node is a leaf node.
   */
  isLeaf() {
    return this.subs.length === 0;
  }
  /**
   * Iterates over the children nodes and invokes a callback function for each child.
   *
   * @param {(child: NodeUI, parent: NodeUI) => void} callback - callback function to accept child node.
   */
  children(e) {
    this.subs.forEach((t) => e(t, this));
  }
  /**
   * Searches this node and its descendants for the first node that satisfies the provided testing function.
   *
   * @param {(node: NodeUI) => boolean} predicate - takes a node as an argument and
   * returns a boolean indicating whether the node is the one being searched for.
   * @return {NodeUI} The first node in the tree that passes the test, or `undefined` if no node passes the test.
   */
  find(e) {
    if (e(this))
      return this;
    let t;
    for (let s = 0; s < this.subs.length; s++)
      if (t = this.subs[s].find(e))
        return t;
  }
  /**
   * Adds a child node to this node.
   * If the child node is already a child of another node, it is removed from that node before adding it.
   *
   * @param childUI Child node to be added to this node.
   * @return The previous parent of the child node, or `null` if it didn't have a parent before.
   */
  addChild(e) {
    const t = e.parent;
    return t && t !== this && t.removeChild(e), e.parent = this, this.subs.push(e), this.sharedConfig.getCanvas().moveNode(e), t;
  }
  /**
   * Removes a child node from this node.
   *
   * @param childUI Child node to be removed from this node.
   * @return The node that was removed, or `null` if the given node is not a child of this node.
   */
  removeChild(e) {
    if (e.parent !== this)
      return null;
    const t = this.subs.findIndex((i) => i.uid === e.uid);
    if (t === -1)
      return null;
    const s = this.subs.splice(t, 1);
    return s.forEach((i) => i.parent = void 0), s[0];
  }
  /**
   * Get the first child node of this node.
   * @return The first child node, or `undefined` if this node has no children.
   */
  firstChild() {
    return this.subs[0];
  }
  /**
   * Get the last child node of this node.
   * @return The last child node, or `undefined` if this node has no children.
   */
  lastChild() {
    if (this.subs.length !== 0)
      return this.subs[this.subs.length - 1];
  }
  /**
   * change folding state
   * @param folding if true, children of this node are hidden, else visible
   * @returns true if folding state is changed, false if not changed
   */
  setFolding(e) {
    return this.folding === e ? !1 : (e ? this.spec.view.folding = !0 : delete this.spec.view.folding, this.repaint(), !0);
  }
  /**
   * check if the node is folded(children hidden) or not
   * @return true if the node is folded, false if not folded
   */
  isFolded() {
    return this.folding;
  }
  repaint() {
    this.sharedConfig.getCanvas().drawNode(this);
  }
  static build(e, t) {
    return e.root = !0, new D(e, t);
  }
}
class Et {
  constructor(e) {
    this.layoutContext = e;
  }
  get name() {
    return "DEFAULT";
  }
  doLayout(e) {
  }
  setPosition() {
  }
}
class xt {
  constructor(e) {
    c(this, "doLayout", (e, t) => {
      const { dir: s } = t;
      s && (s.updated("LR") || s.updated("RL")) && e.children((i) => {
        this._reverseXPos(i, t);
      });
    });
    c(this, "setPosition", (e, t) => {
      const { baseNode: s } = t, o = (s ? s.getHeading() : e.parent.getHeading()).cwy <= 180;
      let r = 0, d = 0, a = e.dimension(!0).width / 2;
      if (s) {
        const l = s.dimension(!0);
        o ? r = l.left + a : r = l.right - a, d = l.bottom + 20;
      } else {
        const l = e.parent.dimension(!0), h = t.offset + a;
        o ? r = l.width / 2 + h : r = -l.width / 2 - h;
      }
      e.setPos(r, d);
    });
    this.layoutContext = e;
  }
  get name() {
    return "X-AXIS";
  }
  /**
   * reflective layout manager relative to parent
   *
   */
  _reverseXPos(e, t) {
    const { x: s, y: i } = e;
    e.setPos(-s, i), this.layoutContext.getLayoutManager(e.layout).doLayout(e, t);
  }
}
class bt {
  constructor(e) {
    c(this, "doLayout", (e, t) => {
      const { dir: s } = t;
      s && (s.updated("TB") || s.updated("BT")) && e.children((i) => {
        this._reverseYPos(i, t);
      });
    });
    c(this, "setPosition", (e, t) => {
      const { baseNode: s } = t, o = (s ? s.getHeading() : e.parent.getHeading()).ccwx <= 180;
      let r = 0, d = 0;
      const a = e.dimension(!0);
      let l = a.height / 2;
      if (s) {
        const h = s.dimension(!0);
        r = h.cx + (h.width + a.width + t.offset) / 2, o ? d = h.bottom - l : d = h.top + l;
      } else {
        const h = e.parent.dimension(!0), u = t.offset + l;
        r = 0, o ? d = -h.height / 2 - u : d = h.height / 2 + u;
      }
      e.setPos(r, d);
    });
    this.layoutContext = e;
  }
  get name() {
    return "Y-AXIS";
  }
  /**
   * reflective layout manager relative to parent
   *
   */
  _reverseYPos(e, t) {
    const { x: s, y: i } = e;
    e.setPos(s, -i), this.layoutContext.getLayoutManager(e.layout).doLayout(e, t);
  }
}
class Ct {
  constructor(e) {
    c(this, "setPosition", (e, t) => {
      this.layoutContext.getLayoutManager({ type: "X-AXIS" }).setPosition(e, t);
    });
    this.layoutContext = e;
  }
  get name() {
    return "XY-AXIS";
  }
  doLayout(e, t) {
    const { dir: s } = t;
    if (!s)
      return;
    this.layoutContext.getLayoutManager({ type: "X-AXIS" }).doLayout(e, t), this.layoutContext.getLayoutManager({ type: "Y-AXIS" }).doLayout(e, t);
  }
}
class Dt {
  constructor(e) {
    c(this, "_layoutMap", /* @__PURE__ */ new Map());
    this.config = e;
  }
  get canvas() {
    return this.config.getCanvas();
  }
  registerLayoutManager(e) {
    this._layoutMap.set(e.name, e);
  }
  getLayoutManager(e) {
    const t = e ? e.type : "DEFAULT";
    return this._layoutMap.get(t);
  }
  setPosition(e, t) {
    const { layout: s } = e;
    this.getLayoutManager(s).setPosition(e, t);
  }
  layout(e, t) {
    const { layout: s } = e;
    this.getLayoutManager(s).doLayout(e, t);
  }
  listLayoutManagers() {
    return [...this._layoutMap.values()];
  }
}
const St = (n) => {
  n.registerLayoutManager(new Et(n)), n.registerLayoutManager(new xt(n)), n.registerLayoutManager(new bt(n)), n.registerLayoutManager(new Ct(n));
};
class Nt {
  constructor(e, t) {
    this.ctx = e, this.delegate = t;
  }
  get name() {
    return this.delegate.name;
  }
  _pickRenderer() {
    const { ctx: e } = this, { text: t, iconBadge: s, thumbnail: i } = this.delegate;
    let o = "text";
    return t ? o = "text" : s ? o = "icon-badge" : i && (o = "thumbnail"), e.getEditor(o);
  }
  showEditor(e, t) {
    return this._pickRenderer().showEditor(e, t);
  }
}
const Lt = {
  editor: `<div class="mwd-node-editor thumbnail-editor">
    <div><input type="text" data-icon></div>
    <div><textarea data-text></textarea></div>
    <div><button data-close>CLOSE</button></div>
</div>`
};
class $t {
  constructor(e) {
    this.ctx = e;
  }
  get name() {
    return "icon-badge";
  }
  showEditor(e, t) {
    const { dom: s } = this.ctx.config, i = e["icon-badge"], o = this.ctx.parse(Lt.editor);
    {
      const r = s.findOne(o, "[data-icon]");
      r.value = i.icon, s.event.input(
        r,
        (d) => {
          const a = d.target.value.trim();
          this.ctx.updateModel(() => (i.icon = a, !1));
        },
        { debouce: 500 }
      );
    }
    {
      const r = s.findOne(
        o,
        "[data-text]"
      );
      r.value = i.text, s.event.input(
        r,
        (d) => {
          const a = d.target.value.trim();
          this.ctx.updateModel(() => (i.text = a, !1));
        },
        { debouce: 500 }
      );
    }
    {
      const r = s.findOne(o, "[data-close]");
      s.event.click(r, () => {
        this.ctx.close();
      });
    }
    return t.appendChild(o), o;
  }
}
const Tt = {
  editor: `<div class="mwd-node-editor link-editor">
    <div><input type="text" data-url></div>
    <div><input type="text" data-body></div>
    <div><button data-submit>UPDATE</button></div>
</div>`
};
class Rt {
  constructor(e) {
    this.ctx = e;
  }
  get name() {
    return "link";
  }
  showEditor(e, t) {
    const { dom: s } = this.ctx.config, i = this.ctx.parse(Tt.editor), o = s.findOne(i, "[data-url]"), r = s.findOne(i, "[data-body]");
    {
      const { url: d, body: a } = e.link;
      o.value = d, r.value = a.text || d;
    }
    return t.appendChild(i), s.event.click(i, (d) => {
      const a = d.target;
      s.is(a, "[data-submit]") && this.ctx.updateModel((l) => {
        const { link: h } = l;
        return h.url = o.value, h.body.text = r.value, !0;
      });
    }), i;
  }
}
const Mt = {
  editor: `<div class="mwd-node-editor plain-text-editbox">
  <textarea value=""></textarea>
  <button data-cmd="save" data-submit>SAVE</button>
</div>`
};
class _t {
  constructor(e) {
    this.ctx = e;
  }
  get name() {
    return "text";
  }
  showEditor(e, t) {
    const { dom: s } = this.ctx.config, i = this.ctx.parse(Mt.editor), o = this.ctx.query(
      i,
      "textarea"
    );
    return o.value = e.text, s.css(o, { width: 120, height: 40 }), s.event.click(i, (r) => {
      r.target.dataset.cmd === "save" && this.ctx.updateModel((d) => (d.text = o.value.trim(), !0));
    }), t.append(i), i;
  }
}
const Ot = {
  editor: `
  <div class="mwd-node-editor thumnail-editor">
    <div class="inline-mwd-form">
      <input type="text" data-form-size>
    </div>
    <div class="mode">
      <label><input type="radio" name="mode" data-mode="cover">Cover</label>
      <label><input type="radio" name="mode" data-mode="contain">Contain</label>
    </div>
    <div class="path-form">
        <textarea></textarea>
    </div>
    <div class=""><button data-close>CLOSE</button></div>
  </div>`
};
class kt {
  constructor(e) {
    this.ctx = e;
  }
  get name() {
    return "thumbnail";
  }
  showEditor(e, t) {
    if (!e.thumbnail)
      throw new Error("EDITOR_ERROR:not a thumbnail node");
    const { dom: s } = this.ctx.config, { mode: i, path: o } = e.thumbnail, r = this.ctx.parse(Ot.editor), d = this.ctx.query(r, "input");
    d.value = `${e.thumbnail.size}`, s.event.input(
      d,
      (u) => {
        const f = u.target.value.trim();
        s.valid.number(f).then((p) => {
          this.ctx.updateModel((w) => (w.thumbnail.size = p, !1));
        });
      },
      { debouce: 500 }
    );
    const a = this.ctx.query(
      r,
      `[data-mode="${i}"]`
    );
    a.checked = !0, s.event.change(r, (u) => {
      const { mode: f } = u.target.dataset;
      f && this.ctx.updateModel((p) => (p.thumbnail.mode = f, !1));
    });
    const l = this.ctx.query(
      r,
      "textarea"
    );
    l.value = o, s.event.input(
      l,
      (u) => {
        const f = u.target.value.trim();
        s.valid.path(f).then((p) => {
          this.ctx.updateModel((w) => (w.thumbnail.path = p, !1));
        });
      },
      { debouce: 500 }
    );
    const h = this.ctx.query(r, "[data-close]");
    return s.event.click(h, () => {
      this.ctx.close();
    }), t.appendChild(r), r;
  }
}
const At = (n) => {
  n.registerEditor(new _t(n)), n.registerEditor(new $t(n)), n.registerEditor(new kt(n)), n.registerEditor(new Rt(n));
};
class Pt {
  constructor(e, t) {
    /**
     * current editing node
     */
    c(this, "node");
    c(this, "_editorMap", /* @__PURE__ */ new Map());
    this.canvas = e, this.datasourceFactory = t, this.node = void 0, this.config.listen(g.VIEWPORT.CLICKED, (s) => {
      this.close();
    }), this.config.listen(g.NODE.SELECTED, ({ nodes: s }) => {
      this.node !== s[0] && this.close();
    });
  }
  dispose() {
    this.node = void 0;
  }
  get config() {
    return this.canvas.config;
  }
  isEditing() {
    return !!this.node;
  }
  registerEditor(e) {
    this._editorMap.set(e.name, e);
  }
  registerCustomEditor(e) {
    const t = new Nt(this, e);
    this.registerEditor(t);
  }
  getEditor(e) {
    return this._editorMap.get(e);
  }
  edit(e) {
    this.node && this.close();
    let t;
    const { model: s } = e;
    if (s.text)
      t = "text";
    else if (s["icon-badge"])
      t = "icon-badge";
    else if (s.thumbnail)
      t = "thumbnail";
    else if (s.link)
      t = "link";
    else if (s.provider) {
      const o = this.datasourceFactory.findDataSourceByKey(s.provider.key);
      o && (t = this.datasourceFactory.getEditorName(o.id));
    }
    const i = this._editorMap.get(t);
    i && (this.node = e, this.node.setEditingState(!0), this.canvas.showNodeEditor(this.node, i));
  }
  parse(e) {
    return this.config.dom.parseTemplate(e);
  }
  query(e, t) {
    return this.config.dom.findOne(e, t);
  }
  queryAll(e, t) {
    return this.config.dom.findAll(e, [t]);
  }
  updateModel(e) {
    let t = !1;
    this.node.updateModel((s) => (t = e(s), !0)), t && this.close();
  }
  close() {
    this.node && (this.node.setEditingState(!1), this.canvas.hideNodeEditor(this.node)), this.node = void 0;
  }
  normalizeImageSize(e) {
    let t, s;
    if (Array.isArray(e)) {
      const [i, o] = e;
      t = `${i}px`, s = o === void 0 ? "auto" : `${o}px`;
    } else typeof e == "number" ? t = s = `${e}px` : t = s = "auto";
    return { width: t, height: s };
  }
}
class zt {
  constructor(e) {
    this.resolvers = e;
  }
  resolveLines(e, t) {
    this.resolvers.forEach((s) => {
      s.resolveLines(e, t);
    });
  }
}
const Ne = (n, e, t, s, i) => {
  if (n.includes(e))
    return;
  const o = i.getNodeDimension(e);
  t.add(o.y), t.add(o.cy), t.add(o.b), s.add(o.x), s.add(o.cx), s.add(o.r), !e.isFolded() && e.subs.forEach((r) => {
    Ne(n, r, t, s, i);
  });
};
class Wt {
  constructor(e, t, s) {
    this.startingNode = e, this.nodes = t, this.canvas = s;
  }
  resolveLines(e, t) {
    Ne(
      this.nodes,
      this.startingNode,
      e,
      t,
      this.canvas
    );
  }
}
const Le = (n, e, t, s, i, o) => {
  if (n === void 0 || o.includes(n) || e === 0)
    return;
  const r = i.getNodeDimension(n);
  t.add(r.y), t.add(r.cy), t.add(r.b), s.add(r.x), s.add(r.cx), s.add(r.r), Le(n.parent, e - 1, t, s, i, o), !n.isFolded() && n.subs.forEach((d) => {
    $e(d, e - 1, t, s, i, o);
  });
}, $e = (n, e, t, s, i, o) => {
  if (o.includes(n) || e === 0)
    return;
  const r = i.getNodeDimension(n);
  t.add(r.y), t.add(r.cy), t.add(r.b), s.add(r.x), s.add(r.cx), s.add(r.r), !n.isFolded() && n.subs.forEach((d) => {
    $e(d, e - 1, t, s, i, o);
  });
};
class Bt {
  constructor(e, t, s) {
    this.staringNodes = e, this.canvas = t, this.distance = s;
  }
  resolveLines(e, t) {
    const s = [...this.staringNodes];
    this.staringNodes.forEach((i) => {
      Le(
        i.parent,
        this.distance,
        e,
        t,
        this.canvas,
        s
      );
    });
  }
}
const ce = (n) => Math.abs(n), E = (n, e, t, s) => {
  for (let i = 0; i < n.length; i++) {
    const o = n[i] - e, r = ce(o);
    r > s || r < ce(t.gap) && (t.idx = i, t.gap = o);
  }
}, le = (n, e, t) => {
  const s = e.snap;
  n.strokeStyle = s.color[t], n.lineWidth = s.width || 0.4, s.dash && n.setLineDash(s.dash);
};
class Ft {
  constructor(e) {
    c(this, "activeNodes");
    c(this, "snaps");
    this.config = e;
  }
  _resolveSnapTarget(e) {
    const { snap: t } = this.config.ui;
    if (t === !1)
      return;
    const s = t;
    if (s.enabled === !1)
      return;
    const { target: i } = s, o = this.config.getCanvas();
    if (i === void 0 || i.length === 0)
      return new Wt(e, [...this.activeNodes], o);
    const r = i.map((d) => {
      if (d.distance)
        return new Bt(
          this.activeNodes,
          o,
          d.distance
        );
    }).filter((d) => d !== void 0);
    return new zt(r);
  }
  turnOn(e, t) {
    if (!t || t.length === 0 || !this.config.snapEnabled)
      return;
    this.activeNodes = [...t];
    const s = this._resolveSnapTarget(e);
    if (s === void 0)
      return;
    const i = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
    s.resolveLines(o, i), this.snaps = { hLines: o, vLines: i };
  }
  turnOff() {
    this.snaps = null, this.activeNodes = void 0;
  }
  doAlign() {
    if (!this.snaps)
      return;
    const { snapSetting: e } = this.config, t = e.limit, s = this.config.getCanvas();
    s.clear();
    const i = s.getAbsoluteDimensions(this.activeNodes), o = [...this.snaps.vLines.values()].filter(
      (a) => Math.abs(i.x - a) <= t || Math.abs(i.r - a) <= t || Math.abs(i.cx - a) <= t
    ), r = [...this.snaps.hLines.values()].filter(
      (a) => Math.abs(i.y - a) <= t || Math.abs(i.b - a) <= t || Math.abs(i.cy - a) <= t
    ), d = { x: 0, y: 0 };
    if (o.length > 0) {
      const a = { idx: 0, gap: o[0] - i.cx };
      E(o, i.cx, a, t), E(o, i.x, a, t), E(o, i.r, a, t), d.x = a.gap, s.drawVLines(
        [o[a.idx]],
        (l) => le(l, this.config.ui, "vertical")
      );
    }
    if (r.length > 0) {
      const a = { idx: 0, gap: r[0] - i.cy };
      E(r, i.cy, a, t), E(r, i.y, a, t), E(r, i.b, a, t), d.y = a.gap, s.drawHLines(
        [r[a.idx]],
        (l) => le(l, this.config.ui, "horizontal")
      );
    }
    this.activeNodes.forEach((a) => {
      const l = a.offset();
      l.x += d.x, l.y += d.y, a.setOffset(l);
    });
  }
}
const H = (n) => n, Te = (n, e, t) => {
  const s = e.toNodeConfigs(t, n);
  return n.childSetOf(e.name).forEach((o) => {
    Te(n, o, e);
  }), s;
};
class It {
  constructor(e, t, s, i) {
    c(this, "name");
    c(this, "userDataList");
    c(this, "parentType");
    c(this, "callbacks");
    this.name = e, this.userDataList = t, this.parentType = s, this.callbacks = i;
  }
  toNodeConfigs(e, t) {
    let s = e ? this.callbacks.relation : null;
    return this.userDataList.map((i, o) => {
      const r = { userData: i, subs: [] }, { model: d } = this.callbacks;
      if (r.model = typeof d == "function" ? d(i) : v.deepCopy(d), s) {
        const l = s(i, e.userDataList), h = t.$ref.get(l);
        r.idx = h.subs.length, h.subs.push(r);
      }
      const { view: a } = this.callbacks;
      return typeof a == "function" ? r.view = a(i, r.idx) : typeof a == "object" ? r.view = v.deepCopy(a) : r.view = { x: 0, y: 0 }, t.$ref.set(i, r), r;
    });
  }
}
class Ht {
  constructor() {
    c(this, "dataSets");
    c(this, "rootType");
    c(this, "$ref");
    this.dataSets = /* @__PURE__ */ new Map(), this.rootType = null, this.$ref = /* @__PURE__ */ new Map();
  }
  root(e, t, s) {
    const i = [];
    return s ? i.push(t) : (s = t, i.push({})), s.virtual, this.rootType = e, s.relation = H, this.dataSet(e, i, s);
  }
  childSetOf(e) {
    return [...this.dataSets.values()].filter(
      (t) => t.parentType === e
    );
  }
  dataSet(e, t, s) {
    const i = {};
    i.relation = s.relation || H, i.model = s.model || H, i.view = s.view;
    const o = e.trim();
    if (this.dataSets.has(o))
      throw new Error(`[MIND WIRED] existing data type: [${e}]`);
    const r = new It(o, t, s.parent, i);
    return this.dataSets.set(o, r), this;
  }
  build() {
    const e = this.dataSets.get(this.rootType);
    return Te(this, e)[0];
  }
}
class qt {
  // fixme NodeUI 타입
  constructor(e) {
    c(this, "node");
    c(this, "prev");
    this.node = e, this.prev = void 0, this.capture();
  }
  get horizontal() {
    const { x: e } = this.node;
    return e <= 0 ? -1 : 1;
  }
  get vertical() {
    const { y: e } = this.node;
    return e <= 0 ? -1 : 1;
  }
  updated(e) {
    const t = this.node.getHeading();
    if (e === "LR")
      return this.prev.cwy > 180 && t.cwy <= 180;
    if (e === "RL")
      return this.prev.cwy <= 180 && t.cwy > 180;
    if (e === "TB")
      return this.prev.ccwx <= 180 && t.ccwx > 180;
    if (e === "BT")
      return this.prev.ccwx > 180 && t.ccwx <= 180;
    throw new Error(
      `[${e}] is not allowed. use 'LR' | 'RL' | 'TB' | 'BT'`
    );
  }
  capture() {
    this.prev = this.node.getHeading();
  }
}
const Re = (n, e) => {
  n.set(e, e.getPos()), e.subs.forEach((t) => Re(n, t));
};
class Vt {
  constructor(e) {
    c(this, "pos");
    c(this, "dir");
    this.node = e, this.dir = new qt(e), this.pos = e.getPos();
  }
}
class Xt {
  constructor() {
    c(this, "capture", /* @__PURE__ */ new Map());
    c(this, "posMap", /* @__PURE__ */ new Map());
  }
  prepareCaptures(e) {
    this.clear(), e.filter((t) => !t.isRoot()).forEach((t) => {
      this.capture.set(t, new Vt(t)), Re(this.posMap, t);
    });
  }
  eachCapture(e) {
    for (let t of this.capture.values())
      e(t);
  }
  getUpdatedNodes() {
    let e = [];
    return this.posMap.forEach((t, s) => {
      (t.x !== s.x || t.y !== s.y) && e.push(s);
    }), e;
  }
  clear() {
    this.capture.clear(), this.posMap.clear();
  }
}
const Kt = (n = 16) => {
  let e = "";
  for (; e.length < n; )
    e += Math.random().toString(36).substring(2);
  return e.substring(0, n);
};
class Yt {
  constructor(e, t, s) {
    this.name = e, this.renderingContext = t, this.delegate = s;
  }
  _pickRenderer() {
    const e = this.renderingContext, { text: t, iconBadge: s, thumbnail: i, link: o } = this.delegate;
    let r = "text";
    return t ? r = "text" : s ? r = "icon-badge" : i ? r = "thumbnail" : o && (r = "link"), e.getRenderer(r);
  }
  install(e, t) {
    this._pickRenderer().install(e, t);
  }
  render(e, t, s) {
    this._pickRenderer().render(e, t, s);
  }
  editor(e) {
    throw new Error("Method not implemented.");
  }
}
const Gt = {
  text: '<span class="mwd-node-text"></span>',
  editor: `<div class="mwd-node-editor plain-text-editbox">
    <textarea value=""></textarea>
    <button data-cmd="save">SAVE</button>
  </div>`
};
class jt {
  constructor(e) {
    c(this, "ctx");
    this.ctx = e;
  }
  install(e, t) {
    const s = this.ctx.parse(Gt.text);
    t.append(s);
  }
  render(e, t) {
    const s = this.ctx.query(t, ".mwd-node-text"), i = e.text.split(`
`).map((o) => `<p>${o}</p>`).join("");
    s.innerHTML = i;
  }
  get name() {
    return "text";
  }
}
const Zt = {
  viewer: `<div class="icon-badge-node">
    <img>
    <span class="mwd-node-text"></span>
  </div>`,
  editor: '<div class=""></div>'
};
class Jt {
  constructor(e) {
    c(this, "ctx");
    this.ctx = e;
  }
  get name() {
    return "icon-badge";
  }
  install(e, t) {
    const s = this.ctx.parse(Zt.viewer);
    t.append(s);
  }
  render(e, t) {
    const { icon: s, text: i } = e["icon-badge"], o = this.ctx.query(t, "img");
    o.src = s;
    const r = this.ctx.query(t, ".mwd-node-text");
    r.innerText = i;
  }
}
const Qt = {
  viewer: '<div class="mwd-thumbnail-node"></div>'
};
class Ut {
  constructor(e) {
    c(this, "ctx");
    this.ctx = e;
  }
  get name() {
    return "thumbnail";
  }
  install(e, t) {
    const s = this.ctx.parse(Qt.viewer);
    t.append(s);
  }
  render(e, t) {
    const s = this.ctx.query(t, ".mwd-thumbnail-node"), { size: i, mode: o } = e.thumbnail, { width: r, height: d } = this.ctx.normalizeImageSize(i);
    this.ctx.css(s, {
      "background-image": `url("${e.thumbnail.path}")`,
      "background-size": o || "cover",
      width: r,
      height: d
    }), s.classList.add("cover");
  }
}
const es = {
  link: `
  <div class="mwd-link-node">
    <a data-url data-mwd-link></a>
    <span data-mwd-link-opener><a target="_" data-mwd-link></a></span>
  </div>`
};
class ts {
  constructor(e) {
    this.ctx = e;
  }
  get name() {
    return "link";
  }
  install(e, t) {
    const s = this.ctx.parse(es.link), { body: i } = e.link, o = this.ctx.getRenderer(i.type || "text"), r = this.ctx.query(s, "a");
    o.install(e, r), t.append(s);
  }
  render(e, t, s) {
    const { url: i, body: o } = e.link, r = this.ctx.query(t, "a");
    r.dataset.url = i;
    {
      const a = this.ctx.query(
        t,
        "[data-mwd-link-opener]"
      );
      s.selected ? a.classList.add("visible") : a.classList.remove("visible");
      const l = this.ctx.query(a, "a");
      l.href = i, l.textContent = i;
    }
    this.ctx.getRenderer(
      o.type || "text"
    ).render(o, r);
  }
}
const L = /* @__PURE__ */ new Map(), ss = (n) => (n.register(new jt(n)), n.register(new Jt(n)), n.register(new Ut(n)), n.register(new ts(n)), n);
class ns {
  constructor(e, t) {
    c(this, "editingNode");
    c(this, "canvas");
    c(this, "uid");
    this.datasourceFactory = t, this.canvas = e, this.uid = `node-rctx-${Kt()}`, L.set(this.uid, /* @__PURE__ */ new Map()), this.editingNode = null;
  }
  get event() {
    return this.canvas.dom.event;
  }
  get valid() {
    return this.canvas.dom.valid;
  }
  parse(e, t = !1) {
    const { dom: s } = this.canvas, i = s.parseTemplate(e);
    return t && s.css(i, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }), i;
  }
  register(e) {
    L.get(this.uid).set(e.name, e);
  }
  registerCustomRender(e) {
    const t = new Yt(e.name, this, e);
    this.register(t);
  }
  getRendererByModel(e) {
    let t;
    if (e.text)
      t = "text";
    else if (e.thumbnail)
      t = "thumbnail";
    else if (e["icon-badge"])
      t = "icon-badge";
    else if (e.link)
      t = "link";
    else if (e.provider) {
      const i = this.datasourceFactory.findDataSourceByKey(e.provider.key);
      i && (t = this.datasourceFactory.getRendererName(i.id));
    }
    const s = L.get(this.uid).get(t);
    if (!s)
      throw new Error(
        `no match node renderer found for ModelSpec: ${JSON.stringify(e)}`
      );
    return s;
  }
  getRenderer(e) {
    const t = L.get(this.uid).get(e || "text");
    if (!t)
      throw new Error(`[No Renderer] no such renderer, (type:${e})`);
    return t;
  }
  listRenderers() {
    return [...L.get(this.uid).values()];
  }
  select(e, t) {
    return e.$bodyEl.querySelector(t);
  }
  css(e, t) {
    this.canvas.dom.css(e, t);
  }
  query(e, t) {
    return this.canvas.dom.findOne(e, t);
  }
  normalizeImageSize(e) {
    let t, s;
    if (Array.isArray(e)) {
      const [i, o] = e;
      t = `${i}px`, s = o === void 0 ? "auto" : `${o}px`;
    } else typeof e == "number" ? t = s = `${e}px` : t = s = "auto";
    return { width: t, height: s };
  }
  dispose() {
    this.editingNode = void 0;
  }
}
const q = (n) => {
  const e = [...n.values()];
  return e.forEach((t) => {
    t.setSelected(!1);
  }), n.clear(), e;
}, he = (n) => !!(n.length !== 1 || n[0].isEditingState()), is = (n) => n.length === 0 ? !0 : !!n.find((t) => t.isRoot()), ue = (n, e, t) => {
  const s = n.config.mindWired();
  let i = t ? v.deepCopy(t.spec.model) : { text: "Text Node" };
  s.addNode(
    e,
    {
      model: i,
      view: void 0
    },
    { siblingNode: t }
  );
}, os = (n, e) => {
  n.config.mindWired().deleteNodes(e);
}, V = (n, e) => {
  const { config: t } = n, s = n.getNodes();
  setTimeout(
    () => t.emit(g.NODE.SELECTED.CLIENT, {
      nodes: s,
      append: e,
      type: "select"
    })
  );
};
class rs {
  constructor(e) {
    c(this, "config");
    /**
     * selected nodes<uid, NodeUI>
     *
     * @template key - uid of node
     * @template value - NodeUI instance
     */
    c(this, "nodeMap");
    this.config = e, this.nodeMap = /* @__PURE__ */ new Map();
    const t = this.config.getCanvas();
    this.config.listen(
      g.NODE.SELECTED,
      ({ nodes: i, append: o }) => {
        this.selectNodes(i, o, !0);
      }
    ), this.config.listen(g.VIEWPORT.CLICKED, () => {
      this.clearSelection();
    });
    const { dom: s } = this.config;
    s.event.keyup(t.$viewport, (i) => {
      if (this.isEmpty())
        return;
      const { code: o } = i, [r] = [...this.nodeMap.values()], d = r.isEditingState();
      o === "Space" && !d ? (i.stopPropagation(), t.clearNodeSelection(), this.config.emit(g.NODE.EDITING, { editing: !0, node: r })) : o === "Escape" && this.config.emit(g.NODE.EDITING, { editing: !1, node: r });
    }), s.event.keydown(
      t.$viewport,
      (i) => {
        const o = this.getNodes();
        he(o) || (i.stopPropagation(), i.stopImmediatePropagation(), ue(this, o[0].parent, o[0]));
      },
      "enter"
    ), s.event.keydown(
      t.$viewport,
      (i) => {
        const o = this.getNodes();
        he(o) || (i.stopPropagation(), i.stopImmediatePropagation(), ue(this, o[0], o[0].lastChild()));
      },
      "shift@enter"
    ), s.event.keydown(
      t.$viewport,
      (i) => {
        const o = this.getNodes();
        is(o) || (i.stopPropagation(), i.stopImmediatePropagation(), os(this, o), q(this.nodeMap), V(this, !1));
      },
      "delete"
    );
  }
  /**
   * set the state of nodes 'selected'
   * @param nodes nodes to select
   * @param append if true, keep current selection state, otherwise reset selection state with the nodes
   * @returns
   */
  selectNodes(e, t, s = !1) {
    const i = e.filter(
      (o) => !this.nodeMap.has(o.uid)
    );
    return i.length === 0 || (t || q(this.nodeMap), i.forEach((o) => {
      this.nodeMap.set(o.uid, o), o.setSelected(!0);
    }), s && V(this, t)), i;
  }
  isEmpty() {
    return this.nodeMap.size === 0;
  }
  getNodes() {
    return [...this.nodeMap.values()];
  }
  clearSelection() {
    const e = q(this.nodeMap);
    return e.length > 0 && (this.config.getCanvas().clearNodeSelection(), V(this, !1)), e;
  }
}
class ds {
  /**
   *
   * @param id unique identifier for datasource
   * @param keyOf extracts key from each item(user data)
   */
  constructor(e, t) {
    c(this, "_items", []);
    c(this, "_itemMap", /* @__PURE__ */ new Map());
    this.id = e, this.keyOf = t;
  }
  getData(e) {
    return this._itemMap.get(e);
  }
  /**
   *
   * @param items user data to use
   */
  setData(e) {
    e.forEach((t) => {
      const s = this.keyOf(t), i = this._itemMap.get(s);
      if (i)
        throw new Error(
          `duplicated item found: key[${s}], value is ${i}`
        );
      this._itemMap.set(s, t);
    }), this._items.push(...e);
  }
  containsData(e) {
    const t = this.keyOf(e);
    return this.containsKey(t);
  }
  containsKey(e) {
    return this._itemMap.has(e);
  }
}
class as {
  constructor() {
    c(this, "_dsMap", /* @__PURE__ */ new Map());
    /**
     * mapping datasource(key) to node render(value)
     * @key datasource id
     * @value name of custom node renderer
     */
    c(this, "_dsToRendererMap", /* @__PURE__ */ new Map());
    /**
     * mapping datasource(key) to node editor(value)
     * @key datasource id
     * @value name of custom node editor
     */
    c(this, "_dsToEditorMap", /* @__PURE__ */ new Map());
  }
  /**
   * creates new datasource
   *
   * @template T type of items in the datasource
   * @template K type of key for each items(default: 'string')
   * @param datasourceId unique identifier for datasource
   * @returns new datasource
   */
  createDataSource(e, t) {
    if (this._dsMap.has(e))
      throw new Error(`duplicated datasource id: [${e}]`);
    const s = new ds(e, t);
    return this._dsMap.set(e, s), s;
  }
  /**
   *
   * @template T type of items in the datasource
   * @template K type of key for each items(default: 'string')
   * @param dataSourceId unique identifier for datasource
   * @returns datasource
   */
  getDataSource(e) {
    return this._dsMap.get(e);
  }
  bindRendererMapping(e, t) {
    this._dsToRendererMap.set(e.id, t);
  }
  getRendererName(e) {
    return this._dsToRendererMap.get(e);
  }
  bindEditorMapping(e, t) {
    this._dsToEditorMap.set(e.id, t);
  }
  getEditorName(e) {
    return this._dsToEditorMap.get(e);
  }
  findDataSourceByData(e) {
    return this._findBy((t) => t.containsData(e));
  }
  findDataSourceByKey(e) {
    return this._findBy((t) => t.containsKey(e));
  }
  _findBy(e) {
    const t = [...this._dsMap.values()];
    for (let s = 0; s < t.length; s++) {
      const i = t[s];
      if (e(i))
        return i;
    }
  }
  findData(e) {
    return this._findBy((s) => s.containsKey(e)).getData(e);
  }
  clear() {
    this._dsToRendererMap.clear(), this._dsToEditorMap.clear(), this._dsMap.clear();
  }
}
const cs = () => {
}, ls = (n, e) => {
  n.update((t) => (e(t), t));
};
class hs {
  constructor() {
  }
  subscribe(e) {
    return this.store.subscribe(e);
  }
  update(e) {
    ls(this.store, e || cs);
  }
}
function X() {
}
function us(n, e) {
  return n != n ? e == e : n !== e || n && typeof n == "object" || typeof n == "function";
}
const x = [];
function gs(n, e = X) {
  let t;
  const s = /* @__PURE__ */ new Set();
  function i(d) {
    if (us(n, d) && (n = d, t)) {
      const a = !x.length;
      for (const l of s)
        l[1](), x.push(l, n);
      if (a) {
        for (let l = 0; l < x.length; l += 2)
          x[l][0](x[l + 1]);
        x.length = 0;
      }
    }
  }
  function o(d) {
    i(d(n));
  }
  function r(d, a = X) {
    const l = [d, a];
    return s.add(l), s.size === 1 && (t = e(i, o) || X), d(n), () => {
      s.delete(l), s.size === 0 && t && (t(), t = null);
    };
  }
  return { set: i, update: o, subscribe: r };
}
const ge = {
  overwriteIfExist: !1,
  skipEvent: !1
};
class fs extends hs {
  constructor(t, s = /* @__PURE__ */ new Map()) {
    super();
    c(this, "store");
    c(this, "_eventRef", { detail: void 0 });
    this._config = t, this._map = s, this.store = gs(this._eventRef);
  }
  get canvas() {
    return this._config.getCanvas();
  }
  _notify(t) {
    this._eventRef.detail = t, this.update(), this._eventRef.detail = void 0;
  }
  findSchema(t) {
    return this.getSchemas().find(t);
  }
  /**
   * create or update schema.
   * @param schema
   * @param param
   */
  addSchema(t, s = ge) {
    const i = this._map.has(t.name);
    if (i && !s.overwriteIfExist)
      throw new Error(`schema [${t.name}] exists.`);
    this._map.set(t.name, t), this._registerSchema(t), s.skipEvent || this._notify({
      type: i ? "update" : "create",
      schemas: [t]
    });
  }
  _registerSchema(t) {
    this.canvas.drawSchema(t);
  }
  getSchemas() {
    return [...this._map.values()];
  }
  removeSchema(t, s = ge) {
    const i = typeof t == "string" ? t : t.name, o = this._map.get(i);
    o && (this.canvas.removeSchema(o.name), this._map.delete(o.name), s.skipEvent || this._notify({ type: "delete", schemas: [o] }));
  }
  dispose() {
    for (const t of this._map.values())
      this.removeSchema(t, { skipEvent: !0 });
  }
}
class M {
  static has(e, t) {
    const { schema: s } = e;
    return s ? s.split(" ").filter((o) => o.length > 0).includes(t.name) : !1;
  }
  static toSchema(e, t) {
    return typeof e == "string" ? t.findSchema((s) => s.name === e) : e;
  }
}
const ps = {
  types: ["node", "schema", "ui"]
};
class ms {
  constructor(e) {
    this.mwd = e;
  }
  async export(e = ps) {
    const t = {}, s = new Set(e.types);
    if (s.has("node") && (t.node = v.deepCopy(await this.mwd.export(!1))), s.has("schema")) {
      const i = this.mwd.getSchemaContext();
      t.schema = v.deepCopy(i.getSchemas());
    }
    return s.has("ui") && (t.ui = v.deepCopy(this.mwd.config.ui), delete t.ui.offset), Promise.resolve(t);
  }
}
const Me = (n, e) => {
  const t = e.spec.view, s = {
    x: t.x,
    y: t.y,
    layout: void 0,
    folding: void 0,
    style: void 0
  }, i = e.isRoot();
  let o = i ? n.ui.offset.x : t.x, r = i ? n.ui.offset.y : t.y;
  s.x = Math.floor(10 * o) / 10, s.y = Math.floor(10 * r) / 10, t.layout && (s.layout = t.layout), t.edge && (s.edge = t.edge), t.folding && (s.folding = !0), t.style && (s.style = t.style);
  const d = [];
  return e.subs.forEach((a) => {
    d.push(Me(n, a));
  }), {
    model: e.model,
    view: s,
    subs: d.length > 0 ? d : void 0
  };
}, G = (n, e, t = !0) => {
  e.repaint(), t && e.subs.forEach((s) => {
    G(n, s);
  }), e.isFolded() && n.setFoldingState([e], !0);
}, j = (n, e, t) => {
  const s = t.nodeLevelClassName(n);
  t.dom.clazz[e](n.$bodyEl, s), n.subs.forEach((i) => j(i, e, t));
}, ys = (n, e) => e ? (v.mergeLeaf(n, e), e) : n;
class vs {
  /**
   *
   * @param {Configuration} config
   */
  constructor(e) {
    c(this, "config");
    c(this, "canvas");
    c(this, "nodeRenderingContext");
    c(this, "nodeSelectionModel");
    c(this, "_nodeLayoutContext");
    c(this, "nodeEditingContext");
    c(this, "_alignmentContext");
    c(this, "dragContext");
    c(this, "_edgeContext");
    c(this, "rootUI");
    c(this, "_dsFactory");
    c(this, "_schemaContext");
    this.config = e, e.mindWired = () => this, this.canvas = new nt(e), e.getCanvas = () => this.canvas, this._dsFactory = new as(), e.getNodeRenderer = () => this.nodeRenderingContext, this.nodeSelectionModel = new rs(e), this._nodeLayoutContext = new Dt(e), St(this._nodeLayoutContext), this.nodeRenderingContext = new ns(
      this.canvas,
      this._dsFactory
    ), ss(this.nodeRenderingContext), this.nodeEditingContext = new Pt(
      this.canvas,
      this._dsFactory
    ), At(this.nodeEditingContext), this._alignmentContext = new Ft(e), this.dragContext = new Xt(), this._edgeContext = new gt(e, this.canvas), ut(this._edgeContext), this._schemaContext = new fs(e), this._schemaContext.subscribe((t) => {
      if (t.detail) {
        const { detail: s } = t;
        setTimeout(() => {
          this._edgeContext.repaint(!0);
          const { type: i } = s, o = i === "create" ? "CREATED" : i === "update" ? "UPDATED" : "DELETED";
          this.config.emit(g.SCHEMA[o].CLIENT, s);
        });
      }
    }), this.config.listen(g.DRAG.VIEWPORT, (t) => {
      if (this.config.setOffset(t.offset), this.canvas.repaintNodeHolder(), this._edgeContext.repaint(), t.state === "done") {
        this.rootUI.setPos(t.offset.x, t.offset.y, !1);
        try {
          this.config.emit(g.NODE.UPDATED.CLIENT, {
            nodes: [this.rootUI],
            type: "pos"
          });
        } finally {
          this.rootUI.setPos(0, 0);
        }
      }
    }).listen(g.DRAG.NODE, (t) => {
      if (t.state === "ready") {
        const s = this.nodeSelectionModel.getNodes(), i = t.target === "all" ? s : s.flatMap((o) => o.subs);
        this.dragContext.prepareCaptures(i), this._alignmentContext.turnOn(this.rootUI, i), this.canvas.updateSelection(s);
      } else if (t.state === "drag") {
        const s = t.target === "all" ? 1 : 2.5;
        this.dragContext.eachCapture((i) => {
          const { node: o, dir: r, pos: d } = i;
          r.capture(), o.setPos(
            s * t.x + d.x,
            s * t.y + d.y,
            !this.config.snapEnabled
          );
        }), this._alignmentContext.doAlign(), this.dragContext.eachCapture((i) => {
          const { node: o, dir: r } = i;
          this._nodeLayoutContext.layout(o, {
            dir: r
          });
        }), this.canvas.updateSelection(this.nodeSelectionModel.getNodes()), this._edgeContext.repaint(!this.config.snapEnabled);
      } else if (t.state === "done") {
        this._alignmentContext.turnOff(), this._edgeContext.repaint(!0);
        const s = this.dragContext.getUpdatedNodes();
        if (s.length > 0)
          this.config.emit(g.NODE.UPDATED.CLIENT, {
            nodes: s,
            type: "pos"
          });
        else {
          const i = this.nodeSelectionModel.getNodes();
          this.config.emit(g.NODE.CLICKED.CLIENT, {
            nodes: i,
            type: "click"
          });
        }
        this.dragContext.clear();
      }
    }).listen(g.NODE.EDITING, ({ editing: t, node: s }) => {
      t ? this.nodeEditingContext.edit(s) : this.nodeEditingContext.close();
    }).listen(g.NODE.UPDATED, ({ nodes: t }) => {
      t.forEach((s) => s.repaint()), this._edgeContext.repaint(), this.config.emit(g.NODE.UPDATED.CLIENT, { nodes: t, type: "model" });
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
  createDataSource(e, t, s) {
    const i = this._dsFactory.createDataSource(e, t);
    if (s) {
      const { renderer: o, editor: r } = s;
      o && (this.nodeRenderingContext.registerCustomRender(o), this._dsFactory.bindRendererMapping(i, o.name)), r && (this.nodeEditingContext.registerCustomEditor(r), this._dsFactory.bindEditorMapping(i, r.name));
    }
    return i;
  }
  isEditing() {
    return this.nodeEditingContext.isEditing();
  }
  _dispose() {
    this.nodeRenderingContext.dispose(), this.nodeEditingContext.dispose(), this._dsFactory.clear(), this._edgeContext.dispose(), this._alignmentContext.turnOff(), this.dragContext.clear(), this.canvas.unregisterNodeTree(this.rootUI);
  }
  nodes(e) {
    if (this.rootUI && this._dispose(), e instanceof Ht) {
      const t = e.build();
      this.rootUI = D.build(t, this.config);
    } else e && (this.rootUI = D.build(e, this.config));
    return this._edgeContext.setRootNode(this.rootUI), this.config.ui.offset.x = this.rootUI.spec.view.x, this.config.ui.offset.y = this.rootUI.spec.view.y, this.rootUI.spec.view.x = 0, this.rootUI.spec.view.y = 0, this.repaint(), this;
  }
  findNode(e) {
    return this.rootUI.find(e);
  }
  addNode(e, t, s) {
    const i = {
      root: !1,
      model: t.model,
      view: t.view
    };
    i.view || (i.view = {
      x: 0,
      y: 0
    });
    const o = e.lastChild(), r = new D(i, this.config, e);
    return this.canvas.regsiterNode(r), e.addChild(r), r.repaint(), this._nodeLayoutContext.setPosition(r, {
      baseNode: o,
      offset: 60
    }), this._edgeContext.addEdge(r.parent, r), this.config.emit(g.NODE.CREATED.CLIENT, {
      nodes: [r],
      type: "create"
    }), r;
  }
  /**
   *
   * @param parentNode new parent of the given nodes
   * @param nodes nodes whoses parent is changed
   * @param trigger if true, event 'node.updated' is triggered
   */
  moveNodes(e, t, s = !1) {
    const i = t.filter((o) => o.parent !== e);
    i.forEach((o) => {
      j(o, "remove", this.config);
      const r = e.addChild(o);
      j(o, "add", this.config), this.config.emit(g.NODE.MOVED, { node: o, prevParent: r });
    }), e.setFolding(!1), G(this, e), this.canvas.updateSelection(t), s && this.config.emit(g.NODE.UPDATED.CLIENT, {
      nodes: i,
      type: "path"
    });
  }
  deleteNodes(e) {
    const t = [], s = [];
    e.forEach((i) => {
      const { parent: o, childNodes: r } = i;
      r.length > 0 && (r.forEach((a) => {
        a.setPos(a.x + i.x, a.y + i.y);
      }), this.moveNodes(o, r), t.push(...r.filter((a) => !e.includes(a))));
      const d = i.parent.removeChild(i);
      d && (this.canvas.unregisterNode(d), s.push(i));
    }), t.length > 0 && this.config.emit(g.NODE.UPDATED.CLIENT, {
      nodes: t,
      type: "path"
    }), s.length > 0 && (this._edgeContext.deleteEdges(s), this.config.emit(g.NODE.DELETED2.CLIENT, {
      nodes: s,
      updated: t,
      type: "delete"
    }));
  }
  getNodeSelectionModel() {
    return this.nodeSelectionModel;
  }
  getSelectedNodes() {
    return this.nodeSelectionModel.getNodes();
  }
  setLayout(e, t) {
    const s = t || this.rootUI;
    e ? s.spec.view.layout = e : delete s.spec.view.layout, this.repaint();
  }
  setEdge(e, t) {
    const s = t || this.rootUI;
    e ? s.spec.view.edge = ys(
      e,
      s.spec.view.edge
    ) : delete s.spec.view.edge, this.repaint(t);
  }
  setScale(e) {
    this.config.ui.scale = e, this.repaint();
  }
  /**
   * update  visibilityof of the given node's children
   * @param nodes
   * @param folding if true(false), children of the node are hidden(visible).
   */
  setFoldingState(e, t) {
    const s = e.filter((i) => {
      const o = i.setFolding(t);
      return this.canvas.updateFoldingNodes(i), this._edgeContext.setEdgeVisible(i, !t, !1), o;
    });
    this._edgeContext.repaint(), this.config.emit(g.NODE.UPDATED.CLIENT, {
      type: "folding",
      nodes: s
    });
  }
  repaint(e) {
    e = e || this.rootUI, G(this, e), this.canvas.repaintNodeHolder(), this._nodeLayoutContext.layout(e, { dir: void 0 }), this._edgeContext.repaint(), this.canvas.clearNodeSelection(), this.canvas.updateSelection(this.getSelectedNodes());
  }
  listen(e, t) {
    const s = ze(`${e}.client`);
    return this.config.ebus.listen(s, t), this;
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
  listenStrict(e, t) {
    e === g.NODE.DELETED && (e = g.NODE.DELETED2);
    const s = e.CLIENT || e;
    return this.config.ebus.listen(s, t), this;
  }
  getNodeRender(e) {
    return this.nodeRenderingContext.getRendererByModel(e);
  }
  /**
   * returns all node renderers
   * @returns all node renderers
   */
  listNodeRenderers() {
    return this.nodeRenderingContext.listRenderers();
  }
  /**
   * return all edge renderers
   * @returns all edge renderers
   */
  listEdgeRenderers() {
    return this._edgeContext.listRenderers();
  }
  listNodeLayoutManagers() {
    return this._nodeLayoutContext.listLayoutManagers();
  }
  translateModel(e) {
    if (e.provider) {
      const { key: t } = e.provider, s = this._dsFactory.findDataSourceByKey(t), i = s.getData(t), o = this._dsFactory.getRendererName(s.id), r = this.nodeRenderingContext.getRenderer(
        o
      ), { text: d, iconBadge: a, thumbnail: l, link: h } = r.delegate;
      let u;
      return d ? u = { type: "text", text: d(i) } : a ? u = { type: "icon-badge", "icon-badge": a(i) } : l ? u = { type: "thumbnail", thumbnail: l(i) } : h && (u = { type: "link", link: h(i) }), u;
    } else
      return e;
  }
  /**
   * return NodeSpec data. If you want to export schema or ui, use `exportwith` instead.
   * @see {exportWith}
   * @deprecated use exportWith(param: ExportParam)
   * @param stringify if true, return JSON.stringify(nodeSpec), else return nodeSpec itself
   * @returns nodeSpec
   */
  export(e = !0) {
    const t = Me(this.config, this.rootUI), s = e ? JSON.stringify(t) : t;
    return Promise.resolve(s);
  }
  exportWith(e) {
    return new ms(this).export(e);
  }
  registerEdgeRenderer(e) {
    this._edgeContext.registerEdgeRenderer(e);
  }
  getSchemaContext() {
    return this._schemaContext;
  }
  registerSchema(e) {
    this._schemaContext.addSchema(e);
  }
  bindSchema(e, t) {
    if (t = t || this.getSelectedNodes(), t.length === 0)
      return;
    const s = M.toSchema(e, this._schemaContext), i = t.filter((o) => this._bindSchema(s, o, !0));
    this._notifySchemaBinding(i);
  }
  unbindSchema(e, t) {
    if (t = t || this.getSelectedNodes(), t.length === 0)
      return;
    const s = M.toSchema(e, this._schemaContext), i = t.filter((o) => this._bindSchema(s, o, !1));
    this._notifySchemaBinding(i);
  }
  toggleSchema(e, t) {
    if (t = t || this.getSelectedNodes(), t.length === 0)
      return;
    const s = M.toSchema(e, this._schemaContext), i = t.filter((o) => {
      const r = M.has(o.spec.model, s);
      return this._bindSchema(s, o, !r);
    });
    this._notifySchemaBinding(i);
  }
  _notifySchemaBinding(e) {
    e.length > 0 && setTimeout(() => {
      this._edgeContext.repaint(!0), this.config.emit(g.NODE.UPDATED.CLIENT, {
        type: "schema",
        nodes: e
      });
    });
  }
  _bindSchema(e, t, s) {
    return s ? this.canvas.bindSchema(t, e) : this.canvas.unbindSchema(t, e);
  }
}
let ws = 1e3;
const _e = {
  width: 600,
  height: 600,
  scale: 1,
  uuid: () => `uuid-${ws++}`,
  clazz: {
    node: "active-node",
    edge: "active-edge",
    schema: (n) => n,
    level: (n) => `level-${n}`,
    folded: "folded"
  },
  styleDef: {
    schema: {
      styleId: "#mwd-schema-@schema@mapId",
      selector: "[data-mind-wired-viewport@mapId] .mwd-node.@schema > .mwd-body"
    }
  },
  offset: new m(0, 0),
  snap: {
    limit: 4,
    width: 0.4,
    dash: [6, 2],
    color: { horizontal: "orange", vertical: "#2bc490" }
  },
  selection: {
    padding: 5,
    "background-color": "#b3ddff6b",
    "border-radius": "4px"
  },
  useDefaultIcon: !0
};
class te {
  constructor({
    el: e,
    ui: t,
    dom: s,
    eventBus: i
  }) {
    c(this, "el");
    c(this, "ui");
    c(this, "ebus");
    c(this, "dom");
    c(this, "mindWired");
    c(this, "model");
    c(this, "view");
    c(this, "subs");
    c(this, "getCanvas");
    c(this, "getNodeRenderer");
    this.el = e, this.ui = t, this.dom = s, this.ebus = i || new We();
  }
  get width() {
    return this.ui.width;
  }
  get height() {
    return this.ui.height;
  }
  get scale() {
    return this.ui.scale;
  }
  get snapEnabled() {
    return this.ui.snap.enabled;
  }
  get snapSetting() {
    return this.ui.snap;
  }
  getOffset() {
    return this.ui.offset.clone();
  }
  setOffset(e) {
    this.ui.offset = e.clone();
  }
  relativeOffset(e) {
    return this.ui.offset.sum(e);
  }
  activeClassName(e) {
    const t = this.ui.clazz[e];
    if (!t)
      throw new Error(`[MINDWIRED][ERROR] no classname of type : "${e}"`);
    return t;
  }
  nodeLevelClassName(e) {
    const { level: t } = this.ui.clazz;
    let s;
    return typeof t == "string" ? s = t : typeof t == "function" ? s = t(e.level(), e.spec) : s = `level-${e.level()}`, s;
  }
  foldedNodeClassName() {
    return this.ui.clazz.folded || "folded";
  }
  listen(e, t) {
    return this.ebus.on(e, t), this;
  }
  off(e, t) {
    this.ebus.off(e.name, t);
  }
  emit(e, t) {
    return this.ebus.emit(e, t), this;
  }
  static parse(e, t, s) {
    const i = v.mergeLeaf(
      e.ui || {},
      v.deepCopy(_e)
    );
    Es(i), xs(i, t);
    const o = typeof e.el == "string" ? document.querySelector(e.el) : e.el;
    return new te({ el: o, ui: i, dom: t, eventBus: s });
  }
}
const Es = (n) => {
  const { offset: e } = n;
  e instanceof m || (n.offset = new m(n.offset.x, n.offset.y));
}, xs = (n, e) => {
  const { snap: t } = n, s = _e.snap;
  if (t === !1)
    n.snap = v.deepCopy(s), n.snap.enabled = !1;
  else {
    if (e.valid.string(t.color)) {
      const i = t.color;
      t.color = {
        horizontal: i.trim(),
        vertical: i.trim()
      };
    }
    t.limit = t.limit || s.limit, t.width = t.width || s.width, t.dash !== !1 && (t.dash = t.dash || s.dash), t.enabled === void 0 && (t.enabled = !0);
  }
};
class bs {
  constructor(e) {
    c(this, "expression");
    this.expression = e;
  }
  get isClass() {
    return this.expression.charAt(0) === ".";
  }
  get isId() {
    return this.expression.charAt(0) === "#";
  }
  get value() {
    return this.expression.substring(1);
  }
  setAttribute(e) {
    if (this.isId)
      e.setAttribute("id", this.value);
    else if (this.isClass)
      e.classList.add(this.value);
    else
      throw new Error(`neither id nor class : [${this.expression}]`);
  }
}
const Oe = (n, e) => {
  var t;
  if (n.nodeType === 1)
    return n.closest(e);
  if (n.nodeType === 3)
    return (t = n.parentElement) == null ? void 0 : t.closest(e);
  throw new Error(`node type ${n.nodeType}, tag(${n.nodeName})`);
}, $ = (n) => (n || "").split(" ").map((t) => t.trim()).filter((t) => t.length > 0), b = (n, e) => {
  const t = document.createElement(n);
  return e && e.forEach((s) => {
    new bs(s).setAttribute(t);
  }), t;
}, Cs = {
  span: (n, e) => {
    const t = b("span", $(n));
    return e && (t.innerHTML = e), t;
  },
  iconButton: (n, e) => {
    const t = b("BUTTON", $(n));
    return t.innerHTML = e, t;
  },
  img: (n) => {
    const e = b("img");
    return new Promise((t, s) => {
      e.onload = () => {
        t({ img: e, width: e.naturalWidth, height: e.naturalHeight });
      }, e.onerror = () => {
        console.log("ERROR"), s("NOT_ALLOWED");
      }, e.crossOrigin = "Anonymous", e.src = n;
    });
  },
  div: (n) => b("DIV", $(n)),
  style: (n) => b("STYLE", $(n)),
  canvas: (n) => b("CANVAS", $(n))
}, Ds = (n, e, t, s) => {
  const i = n.getAttribute(e);
  (s || !i) && n.setAttribute(e, t);
}, Ss = {
  add: (n, e) => n.classList.add(e),
  remove: (n, e) => n.classList.remove(e)
}, _ = (n, e, t, s) => {
  (n || globalThis).addEventListener(e, t, !1);
}, fe = (n, e, t, s) => {
  n.addEventListener(
    e,
    (i) => {
      const o = i.code.toLowerCase(), { keys: r } = s;
      for (let d = 0; d < r.length; d++) {
        const a = r[d], { ctrlKey: l, shiftKey: h, altKey: u, metaKey: f } = i;
        if (a.code === "*" || a.code === o && a.alt === u && a.meta === f && a.shift === h && a.ctrl === l) {
          t(i);
          break;
        }
      }
    },
    !1
  );
}, pe = (n) => {
  let [e, t] = n.split("@");
  t || (t = e, e = "");
  const s = e.split("+");
  return {
    ctrl: s.includes("ctrl"),
    shift: s.includes("shift"),
    alt: s.includes("alt"),
    meta: s.includes("meta"),
    code: t
  };
}, Ns = {
  int: (n, e) => {
    const t = {};
    return e.forEach((s) => {
      const i = n.dataset[s] || "";
      t[s] = parseInt(i, 10);
    }), t;
  }
}, Ls = (n) => n.stopPropagation(), $s = {
  consume: (n, e) => {
    n.addEventListener(e, Ls);
  },
  /*
  focus: (target: HTMLElement, callback: (e: Event) => void, options: string) =>
    registerEvent(target, "focus", callback, options),
  mousedown: (callback, target, options) => {
    registerEvent(target, "mousedown", callback, options);
  },
  mousemove: (callback, target, options) => {
    registerEvent(target, "mousemove", callback, options);
  },
  mouseup: (callback, target, options) => {
    registerEvent(target, "mouseup", callback, options);
  },
  touchstart: (callback, target, options) => {
    registerEvent(target, "touchstart", callback, options);
  },
  touchmove: (callback, target, options) => {
    registerEvent(target, "touchmove", callback, options);
  },
  touchend: (callback, target, options) => {
    registerEvent(target, "touchend", callback, options);
  },
  */
  click: (n, e, t) => {
    _(n, "click", e);
  },
  keydown: (n, e, t) => {
    t = t || "*";
    const s = t.split(" ").filter((i) => i.trim().length > 0).map((i) => pe(i));
    fe(n, "keydown", e, { keys: s });
  },
  keyup: (n, e, t) => {
    t = t || "*";
    const s = t.split(" ").filter((i) => i.trim().length > 0).map((i) => pe(i));
    fe(n, "keyup", e, {
      keys: s
    });
  },
  input: (n, e, t) => {
    if ((t == null ? void 0 : t.debouce) > 0) {
      let s;
      _(
        n,
        "input",
        (i) => {
          clearTimeout(s), s = setTimeout(e, t.debouce, i);
        }
      );
    } else
      _(n, "input", e);
  },
  change: (n, e) => {
    _(n, "change", e);
  }
}, Z = {
  width: (n) => typeof n === "number" ? `${n}px` : "" + n
};
"top,left,height,minWidth,minHeight".split(",").forEach((n) => {
  Z[n] = Z.width;
});
const Ts = (n, e) => {
  Object.keys(e).forEach((t) => {
    const i = (Z[t] || ((o) => o))(e[t]);
    n.style[t] = i;
  });
}, Rs = (n, e) => {
  let t = n;
  Object.keys(e || {}).forEach((i) => {
    const o = "@" + i, r = e[i];
    t = t.replaceAll(o, r);
  });
  const s = document.createElement("template");
  return s.innerHTML = t, s.content.firstElementChild;
}, Ms = (n, e) => n.querySelector(e), _s = (n, e) => e.reduce((t, s) => (n.querySelectorAll(s).forEach((o) => {
  t.push(o);
}), t), []), Os = (n, e, t = !0) => {
  const s = n.matches(e);
  return s || (t ? !!Oe(n, e) : !1);
}, ks = (n) => n.getBoundingClientRect(), As = {
  method: (n) => typeof n == "function"
}, Ps = {
  path: (n) => new Promise((e, t) => {
    const s = n && n.trim();
    s.length > 0 ? e(s) : t(n);
  }),
  number: (n) => new Promise((e, t) => {
    const s = Number.parseFloat(n);
    Number.isNaN(s) ? t(n) : e(s);
  }),
  string: (n) => typeof n == "string" && n.trim().length > 0
};
class zs {
  constructor() {
    c(this, "tag");
    c(this, "attr");
    c(this, "clazz");
    c(this, "closest");
    c(this, "event");
    c(this, "css");
    c(this, "parseTemplate");
    c(this, "findOne");
    c(this, "findAll");
    c(this, "is");
    c(this, "data");
    c(this, "domRect");
    c(this, "types");
    c(this, "valid");
    this.tag = Cs, this.attr = Ds, this.clazz = Ss, this.closest = Oe, this.event = $s, this.css = Ts, this.parseTemplate = Rs, this.findOne = Ms, this.findAll = _s, this.is = Os, this.data = Ns, this.domRect = ks, this.types = As, this.valid = Ps;
  }
  renderStyle(e, t, s = !0) {
    if (s)
      for (let i = e.style.length - 1; i >= 0; i--) {
        const o = e.style[i];
        e.style.removeProperty(o);
      }
    Object.keys(t).forEach((i) => {
      const o = t[i];
      o && (e.style[i] = o);
    });
  }
}
let Ws;
const Vs = () => Ws, Bs = (n, e) => {
  const t = e.tag.canvas();
  return n.append(t), t;
}, Fs = (n) => {
  const e = document.querySelector("[mind-wired-holder]");
  e && (n.findOne(e, "canvas") || Bs(e, n));
}, Is = (n) => new Promise((e, t) => {
  const s = new zs(), { el: i } = n;
  if (i) {
    window.addEventListener("DOMContentLoaded", () => {
      Fs(s);
    });
    const o = te.parse(n, s);
    o.dom = s;
    const r = new vs(o);
    if (n.schema) {
      const d = r.getSchemaContext();
      n.schema.forEach((a) => {
        d.addSchema(a, { skipEvent: !0 });
      });
    }
    e(r);
  } else
    t({ cause: "no_css_selector" });
}), Xs = Is;
export {
  O as AbstractEdgeRenderer,
  Ft as AlignmentContext,
  ds as BaseDataSource,
  nt as CanvasUI,
  Vt as Capture,
  te as Configuration,
  as as DataSourceFactory,
  Et as DefaultNodeLayout,
  qt as Direction,
  zs as DomUtil,
  Xt as DragContext,
  g as EVENT,
  xe as Edge,
  gt as EdgeContext,
  pt as EdgeStyle,
  ms as ExportContext,
  Ge as Geometry,
  Ye as Heading,
  $t as IconBadgeEditor,
  Jt as IconBadgeRenderer,
  ot as LineEdgeRenderer,
  Rt as LinkEditor,
  ts as LinkRenderer,
  vs as MindWired,
  hs as MindWiredStore,
  ct as MustacheLREdgeRenderer,
  ht as MustacheTBEdgeRenderer,
  rt as NaturalCourveEdgeRenderer,
  Pt as NodeEditingContext,
  Nt as NodeEditingDelegate,
  Dt as NodeLayoutContext,
  yt as NodeRect,
  ns as NodeRenderingContext,
  rs as NodeSelectionModel,
  D as NodeUI,
  _t as PlainTextEditor,
  jt as PlainTextRenderer,
  m as Point,
  Yt as RenderingDelegate,
  fs as SchemaContext,
  kt as ThumbnailEditor,
  Ut as ThumbnailRenderer,
  xt as XAxisNodeLayout,
  Ct as XYAxisNodeLayout,
  bt as YAxisNodeLayout,
  Vs as domUtil,
  qs as eventList,
  Is as init,
  Xs as initMindWired,
  St as installDefaultLayoutManagers
};
//# sourceMappingURL=mind-wired.js.map
