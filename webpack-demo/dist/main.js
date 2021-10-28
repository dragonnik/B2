/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/

module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/mithril/api/mount-redraw.js":
/*!**************************************************!*\
  !*** ./node_modules/mithril/api/mount-redraw.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js");

module.exports = function (render, schedule, console) {
  var subscriptions = [];
  var rendering = false;
  var pending = false;

  function sync() {
    if (rendering) throw new Error("Nested m.redraw.sync() call");
    rendering = true;

    for (var i = 0; i < subscriptions.length; i += 2) {
      try {
        render(subscriptions[i], Vnode(subscriptions[i + 1]), redraw);
      } catch (e) {
        console.error(e);
      }
    }

    rendering = false;
  }

  function redraw() {
    if (!pending) {
      pending = true;
      schedule(function () {
        pending = false;
        sync();
      });
    }
  }

  redraw.sync = sync;

  function mount(root, component) {
    if (component != null && component.view == null && typeof component !== "function") {
      throw new TypeError("m.mount(element, component) expects a component, not a vnode");
    }

    var index = subscriptions.indexOf(root);

    if (index >= 0) {
      subscriptions.splice(index, 2);
      render(root, [], redraw);
    }

    if (component != null) {
      subscriptions.push(root, component);
      render(root, Vnode(component), redraw);
    }
  }

  return {
    mount: mount,
    redraw: redraw
  };
};

/***/ }),

/***/ "./node_modules/mithril/api/router.js":
/*!********************************************!*\
  !*** ./node_modules/mithril/api/router.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js");

var m = __webpack_require__(/*! ../render/hyperscript */ "./node_modules/mithril/render/hyperscript.js");

var Promise = __webpack_require__(/*! ../promise/promise */ "./node_modules/mithril/promise/promise.js");

var buildPathname = __webpack_require__(/*! ../pathname/build */ "./node_modules/mithril/pathname/build.js");

var parsePathname = __webpack_require__(/*! ../pathname/parse */ "./node_modules/mithril/pathname/parse.js");

var compileTemplate = __webpack_require__(/*! ../pathname/compileTemplate */ "./node_modules/mithril/pathname/compileTemplate.js");

var assign = __webpack_require__(/*! ../pathname/assign */ "./node_modules/mithril/pathname/assign.js");

var sentinel = {};

module.exports = function ($window, mountRedraw) {
  var fireAsync;

  function setPath(path, data, options) {
    path = buildPathname(path, data);

    if (fireAsync != null) {
      fireAsync();
      var state = options ? options.state : null;
      var title = options ? options.title : null;
      if (options && options.replace) $window.history.replaceState(state, title, route.prefix + path);else $window.history.pushState(state, title, route.prefix + path);
    } else {
      $window.location.href = route.prefix + path;
    }
  }

  var currentResolver = sentinel,
      component,
      attrs,
      currentPath,
      lastUpdate;
  var SKIP = route.SKIP = {};

  function route(root, defaultRoute, routes) {
    if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined"); // 0 = start
    // 1 = init
    // 2 = ready

    var state = 0;
    var compiled = Object.keys(routes).map(function (route) {
      if (route[0] !== "/") throw new SyntaxError("Routes must start with a `/`");

      if (/:([^\/\.-]+)(\.{3})?:/.test(route)) {
        throw new SyntaxError("Route parameter names must be separated with either `/`, `.`, or `-`");
      }

      return {
        route: route,
        component: routes[route],
        check: compileTemplate(route)
      };
    });
    var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout;
    var p = Promise.resolve();
    var scheduled = false;
    var onremove;
    fireAsync = null;

    if (defaultRoute != null) {
      var defaultData = parsePathname(defaultRoute);

      if (!compiled.some(function (i) {
        return i.check(defaultData);
      })) {
        throw new ReferenceError("Default route doesn't match any known routes");
      }
    }

    function resolveRoute() {
      scheduled = false; // Consider the pathname holistically. The prefix might even be invalid,
      // but that's not our problem.

      var prefix = $window.location.hash;

      if (route.prefix[0] !== "#") {
        prefix = $window.location.search + prefix;

        if (route.prefix[0] !== "?") {
          prefix = $window.location.pathname + prefix;
          if (prefix[0] !== "/") prefix = "/" + prefix;
        }
      } // This seemingly useless `.concat()` speeds up the tests quite a bit,
      // since the representation is consistently a relatively poorly
      // optimized cons string.


      var path = prefix.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent).slice(route.prefix.length);
      var data = parsePathname(path);
      assign(data.params, $window.history.state);

      function fail() {
        if (path === defaultRoute) throw new Error("Could not resolve default route " + defaultRoute);
        setPath(defaultRoute, null, {
          replace: true
        });
      }

      loop(0);

      function loop(i) {
        // 0 = init
        // 1 = scheduled
        // 2 = done
        for (; i < compiled.length; i++) {
          if (compiled[i].check(data)) {
            var payload = compiled[i].component;
            var matchedRoute = compiled[i].route;
            var localComp = payload;

            var update = lastUpdate = function (comp) {
              if (update !== lastUpdate) return;
              if (comp === SKIP) return loop(i + 1);
              component = comp != null && (typeof comp.view === "function" || typeof comp === "function") ? comp : "div";
              attrs = data.params, currentPath = path, lastUpdate = null;
              currentResolver = payload.render ? payload : null;
              if (state === 2) mountRedraw.redraw();else {
                state = 2;
                mountRedraw.redraw.sync();
              }
            }; // There's no understating how much I *wish* I could
            // use `async`/`await` here...


            if (payload.view || typeof payload === "function") {
              payload = {};
              update(localComp);
            } else if (payload.onmatch) {
              p.then(function () {
                return payload.onmatch(data.params, path, matchedRoute);
              }).then(update, fail);
            } else update("div");

            return;
          }
        }

        fail();
      }
    } // Set it unconditionally so `m.route.set` and `m.route.Link` both work,
    // even if neither `pushState` nor `hashchange` are supported. It's
    // cleared if `hashchange` is used, since that makes it automatically
    // async.


    fireAsync = function () {
      if (!scheduled) {
        scheduled = true;
        callAsync(resolveRoute);
      }
    };

    if (typeof $window.history.pushState === "function") {
      onremove = function () {
        $window.removeEventListener("popstate", fireAsync, false);
      };

      $window.addEventListener("popstate", fireAsync, false);
    } else if (route.prefix[0] === "#") {
      fireAsync = null;

      onremove = function () {
        $window.removeEventListener("hashchange", resolveRoute, false);
      };

      $window.addEventListener("hashchange", resolveRoute, false);
    }

    return mountRedraw.mount(root, {
      onbeforeupdate: function () {
        state = state ? 2 : 1;
        return !(!state || sentinel === currentResolver);
      },
      oncreate: resolveRoute,
      onremove: onremove,
      view: function () {
        if (!state || sentinel === currentResolver) return; // Wrap in a fragment to preserve existing key semantics

        var vnode = [Vnode(component, attrs.key, attrs)];
        if (currentResolver) vnode = currentResolver.render(vnode[0]);
        return vnode;
      }
    });
  }

  route.set = function (path, data, options) {
    if (lastUpdate != null) {
      options = options || {};
      options.replace = true;
    }

    lastUpdate = null;
    setPath(path, data, options);
  };

  route.get = function () {
    return currentPath;
  };

  route.prefix = "#!";
  route.Link = {
    view: function (vnode) {
      var options = vnode.attrs.options; // Remove these so they don't get overwritten

      var attrs = {},
          onclick,
          href;
      assign(attrs, vnode.attrs); // The first two are internal, but the rest are magic attributes
      // that need censored to not screw up rendering.

      attrs.selector = attrs.options = attrs.key = attrs.oninit = attrs.oncreate = attrs.onbeforeupdate = attrs.onupdate = attrs.onbeforeremove = attrs.onremove = null; // Do this now so we can get the most current `href` and `disabled`.
      // Those attributes may also be specified in the selector, and we
      // should honor that.

      var child = m(vnode.attrs.selector || "a", attrs, vnode.children); // Let's provide a *right* way to disable a route link, rather than
      // letting people screw up accessibility on accident.
      //
      // The attribute is coerced so users don't get surprised over
      // `disabled: 0` resulting in a button that's somehow routable
      // despite being visibly disabled.

      if (child.attrs.disabled = Boolean(child.attrs.disabled)) {
        child.attrs.href = null;
        child.attrs["aria-disabled"] = "true"; // If you *really* do want to do this on a disabled link, use
        // an `oncreate` hook to add it.

        child.attrs.onclick = null;
      } else {
        onclick = child.attrs.onclick;
        href = child.attrs.href;
        child.attrs.href = route.prefix + href;

        child.attrs.onclick = function (e) {
          var result;

          if (typeof onclick === "function") {
            result = onclick.call(e.currentTarget, e);
          } else if (onclick == null || typeof onclick !== "object") {// do nothing
          } else if (typeof onclick.handleEvent === "function") {
            onclick.handleEvent(e);
          } // Adapted from React Router's implementation:
          // https://github.com/ReactTraining/react-router/blob/520a0acd48ae1b066eb0b07d6d4d1790a1d02482/packages/react-router-dom/modules/Link.js
          //
          // Try to be flexible and intuitive in how we handle links.
          // Fun fact: links aren't as obvious to get right as you
          // would expect. There's a lot more valid ways to click a
          // link than this, and one might want to not simply click a
          // link, but right click or command-click it to copy the
          // link target, etc. Nope, this isn't just for blind people.


          if ( // Skip if `onclick` prevented default
          result !== false && !e.defaultPrevented && ( // Ignore everything but left clicks
          e.button === 0 || e.which === 0 || e.which === 1) && ( // Let the browser handle `target=_blank`, etc.
          !e.currentTarget.target || e.currentTarget.target === "_self") && // No modifier keys
          !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            e.redraw = false;
            route.set(href, null, options);
          }
        };
      }

      return child;
    }
  };

  route.param = function (key) {
    return attrs && key != null ? attrs[key] : attrs;
  };

  return route;
};

/***/ }),

/***/ "./node_modules/mithril/hyperscript.js":
/*!*********************************************!*\
  !*** ./node_modules/mithril/hyperscript.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var hyperscript = __webpack_require__(/*! ./render/hyperscript */ "./node_modules/mithril/render/hyperscript.js");

hyperscript.trust = __webpack_require__(/*! ./render/trust */ "./node_modules/mithril/render/trust.js");
hyperscript.fragment = __webpack_require__(/*! ./render/fragment */ "./node_modules/mithril/render/fragment.js");
module.exports = hyperscript;

/***/ }),

/***/ "./node_modules/mithril/index.js":
/*!***************************************!*\
  !*** ./node_modules/mithril/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var hyperscript = __webpack_require__(/*! ./hyperscript */ "./node_modules/mithril/hyperscript.js");

var request = __webpack_require__(/*! ./request */ "./node_modules/mithril/request.js");

var mountRedraw = __webpack_require__(/*! ./mount-redraw */ "./node_modules/mithril/mount-redraw.js");

var m = function m() {
  return hyperscript.apply(this, arguments);
};

m.m = hyperscript;
m.trust = hyperscript.trust;
m.fragment = hyperscript.fragment;
m.mount = mountRedraw.mount;
m.route = __webpack_require__(/*! ./route */ "./node_modules/mithril/route.js");
m.render = __webpack_require__(/*! ./render */ "./node_modules/mithril/render.js");
m.redraw = mountRedraw.redraw;
m.request = request.request;
m.jsonp = request.jsonp;
m.parseQueryString = __webpack_require__(/*! ./querystring/parse */ "./node_modules/mithril/querystring/parse.js");
m.buildQueryString = __webpack_require__(/*! ./querystring/build */ "./node_modules/mithril/querystring/build.js");
m.parsePathname = __webpack_require__(/*! ./pathname/parse */ "./node_modules/mithril/pathname/parse.js");
m.buildPathname = __webpack_require__(/*! ./pathname/build */ "./node_modules/mithril/pathname/build.js");
m.vnode = __webpack_require__(/*! ./render/vnode */ "./node_modules/mithril/render/vnode.js");
m.PromisePolyfill = __webpack_require__(/*! ./promise/polyfill */ "./node_modules/mithril/promise/polyfill.js");
module.exports = m;

/***/ }),

/***/ "./node_modules/mithril/mount-redraw.js":
/*!**********************************************!*\
  !*** ./node_modules/mithril/mount-redraw.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var render = __webpack_require__(/*! ./render */ "./node_modules/mithril/render.js");

module.exports = __webpack_require__(/*! ./api/mount-redraw */ "./node_modules/mithril/api/mount-redraw.js")(render, requestAnimationFrame, console);

/***/ }),

/***/ "./node_modules/mithril/pathname/assign.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/pathname/assign.js ***!
  \*************************************************/
/***/ ((module) => {



module.exports = Object.assign || function (target, source) {
  if (source) Object.keys(source).forEach(function (key) {
    target[key] = source[key];
  });
};

/***/ }),

/***/ "./node_modules/mithril/pathname/build.js":
/*!************************************************!*\
  !*** ./node_modules/mithril/pathname/build.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var buildQueryString = __webpack_require__(/*! ../querystring/build */ "./node_modules/mithril/querystring/build.js");

var assign = __webpack_require__(/*! ./assign */ "./node_modules/mithril/pathname/assign.js"); // Returns `path` from `template` + `params`


module.exports = function (template, params) {
  if (/:([^\/\.-]+)(\.{3})?:/.test(template)) {
    throw new SyntaxError("Template parameter names *must* be separated");
  }

  if (params == null) return template;
  var queryIndex = template.indexOf("?");
  var hashIndex = template.indexOf("#");
  var queryEnd = hashIndex < 0 ? template.length : hashIndex;
  var pathEnd = queryIndex < 0 ? queryEnd : queryIndex;
  var path = template.slice(0, pathEnd);
  var query = {};
  assign(query, params);
  var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function (m, key, variadic) {
    delete query[key]; // If no such parameter exists, don't interpolate it.

    if (params[key] == null) return m; // Escape normal parameters, but not variadic ones.

    return variadic ? params[key] : encodeURIComponent(String(params[key]));
  }); // In case the template substitution adds new query/hash parameters.

  var newQueryIndex = resolved.indexOf("?");
  var newHashIndex = resolved.indexOf("#");
  var newQueryEnd = newHashIndex < 0 ? resolved.length : newHashIndex;
  var newPathEnd = newQueryIndex < 0 ? newQueryEnd : newQueryIndex;
  var result = resolved.slice(0, newPathEnd);
  if (queryIndex >= 0) result += template.slice(queryIndex, queryEnd);
  if (newQueryIndex >= 0) result += (queryIndex < 0 ? "?" : "&") + resolved.slice(newQueryIndex, newQueryEnd);
  var querystring = buildQueryString(query);
  if (querystring) result += (queryIndex < 0 && newQueryIndex < 0 ? "?" : "&") + querystring;
  if (hashIndex >= 0) result += template.slice(hashIndex);
  if (newHashIndex >= 0) result += (hashIndex < 0 ? "" : "&") + resolved.slice(newHashIndex);
  return result;
};

/***/ }),

/***/ "./node_modules/mithril/pathname/compileTemplate.js":
/*!**********************************************************!*\
  !*** ./node_modules/mithril/pathname/compileTemplate.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var parsePathname = __webpack_require__(/*! ./parse */ "./node_modules/mithril/pathname/parse.js"); // Compiles a template into a function that takes a resolved path (without query
// strings) and returns an object containing the template parameters with their
// parsed values. This expects the input of the compiled template to be the
// output of `parsePathname`. Note that it does *not* remove query parameters
// specified in the template.


module.exports = function (template) {
  var templateData = parsePathname(template);
  var templateKeys = Object.keys(templateData.params);
  var keys = [];
  var regexp = new RegExp("^" + templateData.path.replace( // I escape literal text so people can use things like `:file.:ext` or
  // `:lang-:locale` in routes. This is all merged into one pass so I
  // don't also accidentally escape `-` and make it harder to detect it to
  // ban it from template parameters.
  /:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g, function (m, key, extra) {
    if (key == null) return "\\" + m;
    keys.push({
      k: key,
      r: extra === "..."
    });
    if (extra === "...") return "(.*)";
    if (extra === ".") return "([^/]+)\\.";
    return "([^/]+)" + (extra || "");
  }) + "$");
  return function (data) {
    // First, check the params. Usually, there isn't any, and it's just
    // checking a static set.
    for (var i = 0; i < templateKeys.length; i++) {
      if (templateData.params[templateKeys[i]] !== data.params[templateKeys[i]]) return false;
    } // If no interpolations exist, let's skip all the ceremony


    if (!keys.length) return regexp.test(data.path);
    var values = regexp.exec(data.path);
    if (values == null) return false;

    for (var i = 0; i < keys.length; i++) {
      data.params[keys[i].k] = keys[i].r ? values[i + 1] : decodeURIComponent(values[i + 1]);
    }

    return true;
  };
};

/***/ }),

/***/ "./node_modules/mithril/pathname/parse.js":
/*!************************************************!*\
  !*** ./node_modules/mithril/pathname/parse.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var parseQueryString = __webpack_require__(/*! ../querystring/parse */ "./node_modules/mithril/querystring/parse.js"); // Returns `{path, params}` from `url`


module.exports = function (url) {
  var queryIndex = url.indexOf("?");
  var hashIndex = url.indexOf("#");
  var queryEnd = hashIndex < 0 ? url.length : hashIndex;
  var pathEnd = queryIndex < 0 ? queryEnd : queryIndex;
  var path = url.slice(0, pathEnd).replace(/\/{2,}/g, "/");
  if (!path) path = "/";else {
    if (path[0] !== "/") path = "/" + path;
    if (path.length > 1 && path[path.length - 1] === "/") path = path.slice(0, -1);
  }
  return {
    path: path,
    params: queryIndex < 0 ? {} : parseQueryString(url.slice(queryIndex + 1, queryEnd))
  };
};

/***/ }),

/***/ "./node_modules/mithril/promise/polyfill.js":
/*!**************************************************!*\
  !*** ./node_modules/mithril/promise/polyfill.js ***!
  \**************************************************/
/***/ ((module) => {


/** @constructor */

var PromisePolyfill = function (executor) {
  if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`");
  if (typeof executor !== "function") throw new TypeError("executor must be a function");
  var self = this,
      resolvers = [],
      rejectors = [],
      resolveCurrent = handler(resolvers, true),
      rejectCurrent = handler(rejectors, false);
  var instance = self._instance = {
    resolvers: resolvers,
    rejectors: rejectors
  };
  var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout;

  function handler(list, shouldAbsorb) {
    return function execute(value) {
      var then;

      try {
        if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
          if (value === self) throw new TypeError("Promise can't be resolved w/ itself");
          executeOnce(then.bind(value));
        } else {
          callAsync(function () {
            if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value);

            for (var i = 0; i < list.length; i++) list[i](value);

            resolvers.length = 0, rejectors.length = 0;
            instance.state = shouldAbsorb;

            instance.retry = function () {
              execute(value);
            };
          });
        }
      } catch (e) {
        rejectCurrent(e);
      }
    };
  }

  function executeOnce(then) {
    var runs = 0;

    function run(fn) {
      return function (value) {
        if (runs++ > 0) return;
        fn(value);
      };
    }

    var onerror = run(rejectCurrent);

    try {
      then(run(resolveCurrent), onerror);
    } catch (e) {
      onerror(e);
    }
  }

  executeOnce(executor);
};

PromisePolyfill.prototype.then = function (onFulfilled, onRejection) {
  var self = this,
      instance = self._instance;

  function handle(callback, list, next, state) {
    list.push(function (value) {
      if (typeof callback !== "function") next(value);else try {
        resolveNext(callback(value));
      } catch (e) {
        if (rejectNext) rejectNext(e);
      }
    });
    if (typeof instance.retry === "function" && state === instance.state) instance.retry();
  }

  var resolveNext, rejectNext;
  var promise = new PromisePolyfill(function (resolve, reject) {
    resolveNext = resolve, rejectNext = reject;
  });
  handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false);
  return promise;
};

PromisePolyfill.prototype.catch = function (onRejection) {
  return this.then(null, onRejection);
};

PromisePolyfill.prototype.finally = function (callback) {
  return this.then(function (value) {
    return PromisePolyfill.resolve(callback()).then(function () {
      return value;
    });
  }, function (reason) {
    return PromisePolyfill.resolve(callback()).then(function () {
      return PromisePolyfill.reject(reason);
    });
  });
};

PromisePolyfill.resolve = function (value) {
  if (value instanceof PromisePolyfill) return value;
  return new PromisePolyfill(function (resolve) {
    resolve(value);
  });
};

PromisePolyfill.reject = function (value) {
  return new PromisePolyfill(function (resolve, reject) {
    reject(value);
  });
};

PromisePolyfill.all = function (list) {
  return new PromisePolyfill(function (resolve, reject) {
    var total = list.length,
        count = 0,
        values = [];
    if (list.length === 0) resolve([]);else for (var i = 0; i < list.length; i++) {
      (function (i) {
        function consume(value) {
          count++;
          values[i] = value;
          if (count === total) resolve(values);
        }

        if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
          list[i].then(consume, reject);
        } else consume(list[i]);
      })(i);
    }
  });
};

PromisePolyfill.race = function (list) {
  return new PromisePolyfill(function (resolve, reject) {
    for (var i = 0; i < list.length; i++) {
      list[i].then(resolve, reject);
    }
  });
};

module.exports = PromisePolyfill;

/***/ }),

/***/ "./node_modules/mithril/promise/promise.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/promise/promise.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var PromisePolyfill = __webpack_require__(/*! ./polyfill */ "./node_modules/mithril/promise/polyfill.js");

if (typeof window !== "undefined") {
  if (typeof window.Promise === "undefined") {
    window.Promise = PromisePolyfill;
  } else if (!window.Promise.prototype.finally) {
    window.Promise.prototype.finally = PromisePolyfill.prototype.finally;
  }

  module.exports = window.Promise;
} else if (typeof __webpack_require__.g !== "undefined") {
  if (typeof __webpack_require__.g.Promise === "undefined") {
    __webpack_require__.g.Promise = PromisePolyfill;
  } else if (!__webpack_require__.g.Promise.prototype.finally) {
    __webpack_require__.g.Promise.prototype.finally = PromisePolyfill.prototype.finally;
  }

  module.exports = __webpack_require__.g.Promise;
} else {
  module.exports = PromisePolyfill;
}

/***/ }),

/***/ "./node_modules/mithril/querystring/build.js":
/*!***************************************************!*\
  !*** ./node_modules/mithril/querystring/build.js ***!
  \***************************************************/
/***/ ((module) => {



module.exports = function (object) {
  if (Object.prototype.toString.call(object) !== "[object Object]") return "";
  var args = [];

  for (var key in object) {
    destructure(key, object[key]);
  }

  return args.join("&");

  function destructure(key, value) {
    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        destructure(key + "[" + i + "]", value[i]);
      }
    } else if (Object.prototype.toString.call(value) === "[object Object]") {
      for (var i in value) {
        destructure(key + "[" + i + "]", value[i]);
      }
    } else args.push(encodeURIComponent(key) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""));
  }
};

/***/ }),

/***/ "./node_modules/mithril/querystring/parse.js":
/*!***************************************************!*\
  !*** ./node_modules/mithril/querystring/parse.js ***!
  \***************************************************/
/***/ ((module) => {



module.exports = function (string) {
  if (string === "" || string == null) return {};
  if (string.charAt(0) === "?") string = string.slice(1);
  var entries = string.split("&"),
      counters = {},
      data = {};

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i].split("=");
    var key = decodeURIComponent(entry[0]);
    var value = entry.length === 2 ? decodeURIComponent(entry[1]) : "";
    if (value === "true") value = true;else if (value === "false") value = false;
    var levels = key.split(/\]\[?|\[/);
    var cursor = data;
    if (key.indexOf("[") > -1) levels.pop();

    for (var j = 0; j < levels.length; j++) {
      var level = levels[j],
          nextLevel = levels[j + 1];
      var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10));

      if (level === "") {
        var key = levels.slice(0, j).join();

        if (counters[key] == null) {
          counters[key] = Array.isArray(cursor) ? cursor.length : 0;
        }

        level = counters[key]++;
      } // Disallow direct prototype pollution
      else if (level === "__proto__") break;

      if (j === levels.length - 1) cursor[level] = value;else {
        // Read own properties exclusively to disallow indirect
        // prototype pollution
        var desc = Object.getOwnPropertyDescriptor(cursor, level);
        if (desc != null) desc = desc.value;
        if (desc == null) cursor[level] = desc = isNumber ? [] : {};
        cursor = desc;
      }
    }
  }

  return data;
};

/***/ }),

/***/ "./node_modules/mithril/render.js":
/*!****************************************!*\
  !*** ./node_modules/mithril/render.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = __webpack_require__(/*! ./render/render */ "./node_modules/mithril/render/render.js")(window);

/***/ }),

/***/ "./node_modules/mithril/render/fragment.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/render/fragment.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js");

var hyperscriptVnode = __webpack_require__(/*! ./hyperscriptVnode */ "./node_modules/mithril/render/hyperscriptVnode.js");

module.exports = function () {
  var vnode = hyperscriptVnode.apply(0, arguments);
  vnode.tag = "[";
  vnode.children = Vnode.normalizeChildren(vnode.children);
  return vnode;
};

/***/ }),

/***/ "./node_modules/mithril/render/hyperscript.js":
/*!****************************************************!*\
  !*** ./node_modules/mithril/render/hyperscript.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js");

var hyperscriptVnode = __webpack_require__(/*! ./hyperscriptVnode */ "./node_modules/mithril/render/hyperscriptVnode.js");

var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
var selectorCache = {};
var hasOwn = {}.hasOwnProperty;

function isEmpty(object) {
  for (var key in object) if (hasOwn.call(object, key)) return false;

  return true;
}

function compileSelector(selector) {
  var match,
      tag = "div",
      classes = [],
      attrs = {};

  while (match = selectorParser.exec(selector)) {
    var type = match[1],
        value = match[2];
    if (type === "" && value !== "") tag = value;else if (type === "#") attrs.id = value;else if (type === ".") classes.push(value);else if (match[3][0] === "[") {
      var attrValue = match[6];
      if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\");
      if (match[4] === "class") classes.push(attrValue);else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true;
    }
  }

  if (classes.length > 0) attrs.className = classes.join(" ");
  return selectorCache[selector] = {
    tag: tag,
    attrs: attrs
  };
}

function execSelector(state, vnode) {
  var attrs = vnode.attrs;
  var children = Vnode.normalizeChildren(vnode.children);
  var hasClass = hasOwn.call(attrs, "class");
  var className = hasClass ? attrs.class : attrs.className;
  vnode.tag = state.tag;
  vnode.attrs = null;
  vnode.children = undefined;

  if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
    var newAttrs = {};

    for (var key in attrs) {
      if (hasOwn.call(attrs, key)) newAttrs[key] = attrs[key];
    }

    attrs = newAttrs;
  }

  for (var key in state.attrs) {
    if (hasOwn.call(state.attrs, key) && key !== "className" && !hasOwn.call(attrs, key)) {
      attrs[key] = state.attrs[key];
    }
  }

  if (className != null || state.attrs.className != null) attrs.className = className != null ? state.attrs.className != null ? String(state.attrs.className) + " " + String(className) : className : state.attrs.className != null ? state.attrs.className : null;
  if (hasClass) attrs.class = null;

  for (var key in attrs) {
    if (hasOwn.call(attrs, key) && key !== "key") {
      vnode.attrs = attrs;
      break;
    }
  }

  if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
    vnode.text = children[0].children;
  } else {
    vnode.children = children;
  }

  return vnode;
}

function hyperscript(selector) {
  if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
    throw Error("The selector must be either a string or a component.");
  }

  var vnode = hyperscriptVnode.apply(1, arguments);

  if (typeof selector === "string") {
    vnode.children = Vnode.normalizeChildren(vnode.children);
    if (selector !== "[") return execSelector(selectorCache[selector] || compileSelector(selector), vnode);
  }

  vnode.tag = selector;
  return vnode;
}

module.exports = hyperscript;

/***/ }),

/***/ "./node_modules/mithril/render/hyperscriptVnode.js":
/*!*********************************************************!*\
  !*** ./node_modules/mithril/render/hyperscriptVnode.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js"); // Call via `hyperscriptVnode.apply(startOffset, arguments)`
//
// The reason I do it this way, forwarding the arguments and passing the start
// offset in `this`, is so I don't have to create a temporary array in a
// performance-critical path.
//
// In native ES6, I'd instead add a final `...args` parameter to the
// `hyperscript` and `fragment` factories and define this as
// `hyperscriptVnode(...args)`, since modern engines do optimize that away. But
// ES5 (what Mithril requires thanks to IE support) doesn't give me that luxury,
// and engines aren't nearly intelligent enough to do either of these:
//
// 1. Elide the allocation for `[].slice.call(arguments, 1)` when it's passed to
//    another function only to be indexed.
// 2. Elide an `arguments` allocation when it's passed to any function other
//    than `Function.prototype.apply` or `Reflect.apply`.
//
// In ES6, it'd probably look closer to this (I'd need to profile it, though):
// module.exports = function(attrs, ...children) {
//     if (attrs == null || typeof attrs === "object" && attrs.tag == null && !Array.isArray(attrs)) {
//         if (children.length === 1 && Array.isArray(children[0])) children = children[0]
//     } else {
//         children = children.length === 0 && Array.isArray(attrs) ? attrs : [attrs, ...children]
//         attrs = undefined
//     }
//
//     if (attrs == null) attrs = {}
//     return Vnode("", attrs.key, attrs, children)
// }


module.exports = function () {
  var attrs = arguments[this],
      start = this + 1,
      children;

  if (attrs == null) {
    attrs = {};
  } else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
    attrs = {};
    start = this;
  }

  if (arguments.length === start + 1) {
    children = arguments[start];
    if (!Array.isArray(children)) children = [children];
  } else {
    children = [];

    while (start < arguments.length) children.push(arguments[start++]);
  }

  return Vnode("", attrs.key, attrs, children);
};

/***/ }),

/***/ "./node_modules/mithril/render/render.js":
/*!***********************************************!*\
  !*** ./node_modules/mithril/render/render.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js");

module.exports = function ($window) {
  var $doc = $window && $window.document;
  var currentRedraw;
  var nameSpace = {
    svg: "http://www.w3.org/2000/svg",
    math: "http://www.w3.org/1998/Math/MathML"
  };

  function getNameSpace(vnode) {
    return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag];
  } //sanity check to discourage people from doing `vnode.state = ...`


  function checkState(vnode, original) {
    if (vnode.state !== original) throw new Error("`vnode.state` must not be modified");
  } //Note: the hook is passed as the `this` argument to allow proxying the
  //arguments without requiring a full array allocation to do so. It also
  //takes advantage of the fact the current `vnode` is the first argument in
  //all lifecycle methods.


  function callHook(vnode) {
    var original = vnode.state;

    try {
      return this.apply(original, arguments);
    } finally {
      checkState(vnode, original);
    }
  } // IE11 (at least) throws an UnspecifiedError when accessing document.activeElement when
  // inside an iframe. Catch and swallow this error, and heavy-handidly return null.


  function activeElement() {
    try {
      return $doc.activeElement;
    } catch (e) {
      return null;
    }
  } //create


  function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
    for (var i = start; i < end; i++) {
      var vnode = vnodes[i];

      if (vnode != null) {
        createNode(parent, vnode, hooks, ns, nextSibling);
      }
    }
  }

  function createNode(parent, vnode, hooks, ns, nextSibling) {
    var tag = vnode.tag;

    if (typeof tag === "string") {
      vnode.state = {};
      if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);

      switch (tag) {
        case "#":
          createText(parent, vnode, nextSibling);
          break;

        case "<":
          createHTML(parent, vnode, ns, nextSibling);
          break;

        case "[":
          createFragment(parent, vnode, hooks, ns, nextSibling);
          break;

        default:
          createElement(parent, vnode, hooks, ns, nextSibling);
      }
    } else createComponent(parent, vnode, hooks, ns, nextSibling);
  }

  function createText(parent, vnode, nextSibling) {
    vnode.dom = $doc.createTextNode(vnode.children);
    insertNode(parent, vnode.dom, nextSibling);
  }

  var possibleParents = {
    caption: "table",
    thead: "table",
    tbody: "table",
    tfoot: "table",
    tr: "tbody",
    th: "tr",
    td: "tr",
    colgroup: "table",
    col: "colgroup"
  };

  function createHTML(parent, vnode, ns, nextSibling) {
    var match = vnode.children.match(/^\s*?<(\w+)/im) || []; // not using the proper parent makes the child element(s) vanish.
    //     var div = document.createElement("div")
    //     div.innerHTML = "<td>i</td><td>j</td>"
    //     console.log(div.innerHTML)
    // --> "ij", no <td> in sight.

    var temp = $doc.createElement(possibleParents[match[1]] || "div");

    if (ns === "http://www.w3.org/2000/svg") {
      temp.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\">" + vnode.children + "</svg>";
      temp = temp.firstChild;
    } else {
      temp.innerHTML = vnode.children;
    }

    vnode.dom = temp.firstChild;
    vnode.domSize = temp.childNodes.length; // Capture nodes to remove, so we don't confuse them.

    vnode.instance = [];
    var fragment = $doc.createDocumentFragment();
    var child;

    while (child = temp.firstChild) {
      vnode.instance.push(child);
      fragment.appendChild(child);
    }

    insertNode(parent, fragment, nextSibling);
  }

  function createFragment(parent, vnode, hooks, ns, nextSibling) {
    var fragment = $doc.createDocumentFragment();

    if (vnode.children != null) {
      var children = vnode.children;
      createNodes(fragment, children, 0, children.length, hooks, null, ns);
    }

    vnode.dom = fragment.firstChild;
    vnode.domSize = fragment.childNodes.length;
    insertNode(parent, fragment, nextSibling);
  }

  function createElement(parent, vnode, hooks, ns, nextSibling) {
    var tag = vnode.tag;
    var attrs = vnode.attrs;
    var is = attrs && attrs.is;
    ns = getNameSpace(vnode) || ns;
    var element = ns ? is ? $doc.createElementNS(ns, tag, {
      is: is
    }) : $doc.createElementNS(ns, tag) : is ? $doc.createElement(tag, {
      is: is
    }) : $doc.createElement(tag);
    vnode.dom = element;

    if (attrs != null) {
      setAttrs(vnode, attrs, ns);
    }

    insertNode(parent, element, nextSibling);

    if (!maybeSetContentEditable(vnode)) {
      if (vnode.text != null) {
        if (vnode.text !== "") element.textContent = vnode.text;else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)];
      }

      if (vnode.children != null) {
        var children = vnode.children;
        createNodes(element, children, 0, children.length, hooks, null, ns);
        if (vnode.tag === "select" && attrs != null) setLateSelectAttrs(vnode, attrs);
      }
    }
  }

  function initComponent(vnode, hooks) {
    var sentinel;

    if (typeof vnode.tag.view === "function") {
      vnode.state = Object.create(vnode.tag);
      sentinel = vnode.state.view;
      if (sentinel.$$reentrantLock$$ != null) return;
      sentinel.$$reentrantLock$$ = true;
    } else {
      vnode.state = void 0;
      sentinel = vnode.tag;
      if (sentinel.$$reentrantLock$$ != null) return;
      sentinel.$$reentrantLock$$ = true;
      vnode.state = vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function" ? new vnode.tag(vnode) : vnode.tag(vnode);
    }

    initLifecycle(vnode.state, vnode, hooks);
    if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);
    vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode));
    if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument");
    sentinel.$$reentrantLock$$ = null;
  }

  function createComponent(parent, vnode, hooks, ns, nextSibling) {
    initComponent(vnode, hooks);

    if (vnode.instance != null) {
      createNode(parent, vnode.instance, hooks, ns, nextSibling);
      vnode.dom = vnode.instance.dom;
      vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0;
    } else {
      vnode.domSize = 0;
    }
  } //update

  /**
   * @param {Element|Fragment} parent - the parent element
   * @param {Vnode[] | null} old - the list of vnodes of the last `render()` call for
   *                               this part of the tree
   * @param {Vnode[] | null} vnodes - as above, but for the current `render()` call.
   * @param {Function[]} hooks - an accumulator of post-render hooks (oncreate/onupdate)
   * @param {Element | null} nextSibling - the next DOM node if we're dealing with a
   *                                       fragment that is not the last item in its
   *                                       parent
   * @param {'svg' | 'math' | String | null} ns) - the current XML namespace, if any
   * @returns void
   */
  // This function diffs and patches lists of vnodes, both keyed and unkeyed.
  //
  // We will:
  //
  // 1. describe its general structure
  // 2. focus on the diff algorithm optimizations
  // 3. discuss DOM node operations.
  // ## Overview:
  //
  // The updateNodes() function:
  // - deals with trivial cases
  // - determines whether the lists are keyed or unkeyed based on the first non-null node
  //   of each list.
  // - diffs them and patches the DOM if needed (that's the brunt of the code)
  // - manages the leftovers: after diffing, are there:
  //   - old nodes left to remove?
  // 	 - new nodes to insert?
  // 	 deal with them!
  //
  // The lists are only iterated over once, with an exception for the nodes in `old` that
  // are visited in the fourth part of the diff and in the `removeNodes` loop.
  // ## Diffing
  //
  // Reading https://github.com/localvoid/ivi/blob/ddc09d06abaef45248e6133f7040d00d3c6be853/packages/ivi/src/vdom/implementation.ts#L617-L837
  // may be good for context on longest increasing subsequence-based logic for moving nodes.
  //
  // In order to diff keyed lists, one has to
  //
  // 1) match nodes in both lists, per key, and update them accordingly
  // 2) create the nodes present in the new list, but absent in the old one
  // 3) remove the nodes present in the old list, but absent in the new one
  // 4) figure out what nodes in 1) to move in order to minimize the DOM operations.
  //
  // To achieve 1) one can create a dictionary of keys => index (for the old list), then iterate
  // over the new list and for each new vnode, find the corresponding vnode in the old list using
  // the map.
  // 2) is achieved in the same step: if a new node has no corresponding entry in the map, it is new
  // and must be created.
  // For the removals, we actually remove the nodes that have been updated from the old list.
  // The nodes that remain in that list after 1) and 2) have been performed can be safely removed.
  // The fourth step is a bit more complex and relies on the longest increasing subsequence (LIS)
  // algorithm.
  //
  // the longest increasing subsequence is the list of nodes that can remain in place. Imagine going
  // from `1,2,3,4,5` to `4,5,1,2,3` where the numbers are not necessarily the keys, but the indices
  // corresponding to the keyed nodes in the old list (keyed nodes `e,d,c,b,a` => `b,a,e,d,c` would
  //  match the above lists, for example).
  //
  // In there are two increasing subsequences: `4,5` and `1,2,3`, the latter being the longest. We
  // can update those nodes without moving them, and only call `insertNode` on `4` and `5`.
  //
  // @localvoid adapted the algo to also support node deletions and insertions (the `lis` is actually
  // the longest increasing subsequence *of old nodes still present in the new list*).
  //
  // It is a general algorithm that is fireproof in all circumstances, but it requires the allocation
  // and the construction of a `key => oldIndex` map, and three arrays (one with `newIndex => oldIndex`,
  // the `LIS` and a temporary one to create the LIS).
  //
  // So we cheat where we can: if the tails of the lists are identical, they are guaranteed to be part of
  // the LIS and can be updated without moving them.
  //
  // If two nodes are swapped, they are guaranteed not to be part of the LIS, and must be moved (with
  // the exception of the last node if the list is fully reversed).
  //
  // ## Finding the next sibling.
  //
  // `updateNode()` and `createNode()` expect a nextSibling parameter to perform DOM operations.
  // When the list is being traversed top-down, at any index, the DOM nodes up to the previous
  // vnode reflect the content of the new list, whereas the rest of the DOM nodes reflect the old
  // list. The next sibling must be looked for in the old list using `getNextSibling(... oldStart + 1 ...)`.
  //
  // In the other scenarios (swaps, upwards traversal, map-based diff),
  // the new vnodes list is traversed upwards. The DOM nodes at the bottom of the list reflect the
  // bottom part of the new vnodes list, and we can use the `v.dom`  value of the previous node
  // as the next sibling (cached in the `nextSibling` variable).
  // ## DOM node moves
  //
  // In most scenarios `updateNode()` and `createNode()` perform the DOM operations. However,
  // this is not the case if the node moved (second and fourth part of the diff algo). We move
  // the old DOM nodes before updateNode runs because it enables us to use the cached `nextSibling`
  // variable rather than fetching it using `getNextSibling()`.
  //
  // The fourth part of the diff currently inserts nodes unconditionally, leading to issues
  // like #1791 and #1999. We need to be smarter about those situations where adjascent old
  // nodes remain together in the new list in a way that isn't covered by parts one and
  // three of the diff algo.


  function updateNodes(parent, old, vnodes, hooks, nextSibling, ns) {
    if (old === vnodes || old == null && vnodes == null) return;else if (old == null || old.length === 0) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns);else if (vnodes == null || vnodes.length === 0) removeNodes(parent, old, 0, old.length);else {
      var isOldKeyed = old[0] != null && old[0].key != null;
      var isKeyed = vnodes[0] != null && vnodes[0].key != null;
      var start = 0,
          oldStart = 0;
      if (!isOldKeyed) while (oldStart < old.length && old[oldStart] == null) oldStart++;
      if (!isKeyed) while (start < vnodes.length && vnodes[start] == null) start++;
      if (isKeyed === null && isOldKeyed == null) return; // both lists are full of nulls

      if (isOldKeyed !== isKeyed) {
        removeNodes(parent, old, oldStart, old.length);
        createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns);
      } else if (!isKeyed) {
        // Don't index past the end of either list (causes deopts).
        var commonLength = old.length < vnodes.length ? old.length : vnodes.length; // Rewind if necessary to the first non-null index on either side.
        // We could alternatively either explicitly create or remove nodes when `start !== oldStart`
        // but that would be optimizing for sparse lists which are more rare than dense ones.

        start = start < oldStart ? start : oldStart;

        for (; start < commonLength; start++) {
          o = old[start];
          v = vnodes[start];
          if (o === v || o == null && v == null) continue;else if (o == null) createNode(parent, v, hooks, ns, getNextSibling(old, start + 1, nextSibling));else if (v == null) removeNode(parent, o);else updateNode(parent, o, v, hooks, getNextSibling(old, start + 1, nextSibling), ns);
        }

        if (old.length > commonLength) removeNodes(parent, old, start, old.length);
        if (vnodes.length > commonLength) createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns);
      } else {
        // keyed diff
        var oldEnd = old.length - 1,
            end = vnodes.length - 1,
            map,
            o,
            v,
            oe,
            ve,
            topSibling; // bottom-up

        while (oldEnd >= oldStart && end >= start) {
          oe = old[oldEnd];
          ve = vnodes[end];
          if (oe.key !== ve.key) break;
          if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns);
          if (ve.dom != null) nextSibling = ve.dom;
          oldEnd--, end--;
        } // top-down


        while (oldEnd >= oldStart && end >= start) {
          o = old[oldStart];
          v = vnodes[start];
          if (o.key !== v.key) break;
          oldStart++, start++;
          if (o !== v) updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), ns);
        } // swaps and list reversals


        while (oldEnd >= oldStart && end >= start) {
          if (start === end) break;
          if (o.key !== ve.key || oe.key !== v.key) break;
          topSibling = getNextSibling(old, oldStart, nextSibling);
          moveNodes(parent, oe, topSibling);
          if (oe !== v) updateNode(parent, oe, v, hooks, topSibling, ns);
          if (++start <= --end) moveNodes(parent, o, nextSibling);
          if (o !== ve) updateNode(parent, o, ve, hooks, nextSibling, ns);
          if (ve.dom != null) nextSibling = ve.dom;
          oldStart++;
          oldEnd--;
          oe = old[oldEnd];
          ve = vnodes[end];
          o = old[oldStart];
          v = vnodes[start];
        } // bottom up once again


        while (oldEnd >= oldStart && end >= start) {
          if (oe.key !== ve.key) break;
          if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns);
          if (ve.dom != null) nextSibling = ve.dom;
          oldEnd--, end--;
          oe = old[oldEnd];
          ve = vnodes[end];
        }

        if (start > end) removeNodes(parent, old, oldStart, oldEnd + 1);else if (oldStart > oldEnd) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);else {
          // inspired by ivi https://github.com/ivijs/ivi/ by Boris Kaul
          var originalNextSibling = nextSibling,
              vnodesLength = end - start + 1,
              oldIndices = new Array(vnodesLength),
              li = 0,
              i = 0,
              pos = 2147483647,
              matched = 0,
              map,
              lisIndices;

          for (i = 0; i < vnodesLength; i++) oldIndices[i] = -1;

          for (i = end; i >= start; i--) {
            if (map == null) map = getKeyMap(old, oldStart, oldEnd + 1);
            ve = vnodes[i];
            var oldIndex = map[ve.key];

            if (oldIndex != null) {
              pos = oldIndex < pos ? oldIndex : -1; // becomes -1 if nodes were re-ordered

              oldIndices[i - start] = oldIndex;
              oe = old[oldIndex];
              old[oldIndex] = null;
              if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns);
              if (ve.dom != null) nextSibling = ve.dom;
              matched++;
            }
          }

          nextSibling = originalNextSibling;
          if (matched !== oldEnd - oldStart + 1) removeNodes(parent, old, oldStart, oldEnd + 1);
          if (matched === 0) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);else {
            if (pos === -1) {
              // the indices of the indices of the items that are part of the
              // longest increasing subsequence in the oldIndices list
              lisIndices = makeLisIndices(oldIndices);
              li = lisIndices.length - 1;

              for (i = end; i >= start; i--) {
                v = vnodes[i];
                if (oldIndices[i - start] === -1) createNode(parent, v, hooks, ns, nextSibling);else {
                  if (lisIndices[li] === i - start) li--;else moveNodes(parent, v, nextSibling);
                }
                if (v.dom != null) nextSibling = vnodes[i].dom;
              }
            } else {
              for (i = end; i >= start; i--) {
                v = vnodes[i];
                if (oldIndices[i - start] === -1) createNode(parent, v, hooks, ns, nextSibling);
                if (v.dom != null) nextSibling = vnodes[i].dom;
              }
            }
          }
        }
      }
    }
  }

  function updateNode(parent, old, vnode, hooks, nextSibling, ns) {
    var oldTag = old.tag,
        tag = vnode.tag;

    if (oldTag === tag) {
      vnode.state = old.state;
      vnode.events = old.events;
      if (shouldNotUpdate(vnode, old)) return;

      if (typeof oldTag === "string") {
        if (vnode.attrs != null) {
          updateLifecycle(vnode.attrs, vnode, hooks);
        }

        switch (oldTag) {
          case "#":
            updateText(old, vnode);
            break;

          case "<":
            updateHTML(parent, old, vnode, ns, nextSibling);
            break;

          case "[":
            updateFragment(parent, old, vnode, hooks, nextSibling, ns);
            break;

          default:
            updateElement(old, vnode, hooks, ns);
        }
      } else updateComponent(parent, old, vnode, hooks, nextSibling, ns);
    } else {
      removeNode(parent, old);
      createNode(parent, vnode, hooks, ns, nextSibling);
    }
  }

  function updateText(old, vnode) {
    if (old.children.toString() !== vnode.children.toString()) {
      old.dom.nodeValue = vnode.children;
    }

    vnode.dom = old.dom;
  }

  function updateHTML(parent, old, vnode, ns, nextSibling) {
    if (old.children !== vnode.children) {
      removeHTML(parent, old);
      createHTML(parent, vnode, ns, nextSibling);
    } else {
      vnode.dom = old.dom;
      vnode.domSize = old.domSize;
      vnode.instance = old.instance;
    }
  }

  function updateFragment(parent, old, vnode, hooks, nextSibling, ns) {
    updateNodes(parent, old.children, vnode.children, hooks, nextSibling, ns);
    var domSize = 0,
        children = vnode.children;
    vnode.dom = null;

    if (children != null) {
      for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (child != null && child.dom != null) {
          if (vnode.dom == null) vnode.dom = child.dom;
          domSize += child.domSize || 1;
        }
      }

      if (domSize !== 1) vnode.domSize = domSize;
    }
  }

  function updateElement(old, vnode, hooks, ns) {
    var element = vnode.dom = old.dom;
    ns = getNameSpace(vnode) || ns;

    if (vnode.tag === "textarea") {
      if (vnode.attrs == null) vnode.attrs = {};

      if (vnode.text != null) {
        vnode.attrs.value = vnode.text; //FIXME handle multiple children

        vnode.text = undefined;
      }
    }

    updateAttrs(vnode, old.attrs, vnode.attrs, ns);

    if (!maybeSetContentEditable(vnode)) {
      if (old.text != null && vnode.text != null && vnode.text !== "") {
        if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text;
      } else {
        if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)];
        if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)];
        updateNodes(element, old.children, vnode.children, hooks, null, ns);
      }
    }
  }

  function updateComponent(parent, old, vnode, hooks, nextSibling, ns) {
    vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode));
    if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument");
    updateLifecycle(vnode.state, vnode, hooks);
    if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks);

    if (vnode.instance != null) {
      if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling);else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, ns);
      vnode.dom = vnode.instance.dom;
      vnode.domSize = vnode.instance.domSize;
    } else if (old.instance != null) {
      removeNode(parent, old.instance);
      vnode.dom = undefined;
      vnode.domSize = 0;
    } else {
      vnode.dom = old.dom;
      vnode.domSize = old.domSize;
    }
  }

  function getKeyMap(vnodes, start, end) {
    var map = Object.create(null);

    for (; start < end; start++) {
      var vnode = vnodes[start];

      if (vnode != null) {
        var key = vnode.key;
        if (key != null) map[key] = start;
      }
    }

    return map;
  } // Lifted from ivi https://github.com/ivijs/ivi/
  // takes a list of unique numbers (-1 is special and can
  // occur multiple times) and returns an array with the indices
  // of the items that are part of the longest increasing
  // subsequece


  var lisTemp = [];

  function makeLisIndices(a) {
    var result = [0];
    var u = 0,
        v = 0,
        i = 0;
    var il = lisTemp.length = a.length;

    for (var i = 0; i < il; i++) lisTemp[i] = a[i];

    for (var i = 0; i < il; ++i) {
      if (a[i] === -1) continue;
      var j = result[result.length - 1];

      if (a[j] < a[i]) {
        lisTemp[i] = j;
        result.push(i);
        continue;
      }

      u = 0;
      v = result.length - 1;

      while (u < v) {
        // Fast integer average without overflow.
        // eslint-disable-next-line no-bitwise
        var c = (u >>> 1) + (v >>> 1) + (u & v & 1);

        if (a[result[c]] < a[i]) {
          u = c + 1;
        } else {
          v = c;
        }
      }

      if (a[i] < a[result[u]]) {
        if (u > 0) lisTemp[i] = result[u - 1];
        result[u] = i;
      }
    }

    u = result.length;
    v = result[u - 1];

    while (u-- > 0) {
      result[u] = v;
      v = lisTemp[v];
    }

    lisTemp.length = 0;
    return result;
  }

  function getNextSibling(vnodes, i, nextSibling) {
    for (; i < vnodes.length; i++) {
      if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom;
    }

    return nextSibling;
  } // This covers a really specific edge case:
  // - Parent node is keyed and contains child
  // - Child is removed, returns unresolved promise in `onbeforeremove`
  // - Parent node is moved in keyed diff
  // - Remaining children still need moved appropriately
  //
  // Ideally, I'd track removed nodes as well, but that introduces a lot more
  // complexity and I'm not exactly interested in doing that.


  function moveNodes(parent, vnode, nextSibling) {
    var frag = $doc.createDocumentFragment();
    moveChildToFrag(parent, frag, vnode);
    insertNode(parent, frag, nextSibling);
  }

  function moveChildToFrag(parent, frag, vnode) {
    // Dodge the recursion overhead in a few of the most common cases.
    while (vnode.dom != null && vnode.dom.parentNode === parent) {
      if (typeof vnode.tag !== "string") {
        vnode = vnode.instance;
        if (vnode != null) continue;
      } else if (vnode.tag === "<") {
        for (var i = 0; i < vnode.instance.length; i++) {
          frag.appendChild(vnode.instance[i]);
        }
      } else if (vnode.tag !== "[") {
        // Don't recurse for text nodes *or* elements, just fragments
        frag.appendChild(vnode.dom);
      } else if (vnode.children.length === 1) {
        vnode = vnode.children[0];
        if (vnode != null) continue;
      } else {
        for (var i = 0; i < vnode.children.length; i++) {
          var child = vnode.children[i];
          if (child != null) moveChildToFrag(parent, frag, child);
        }
      }

      break;
    }
  }

  function insertNode(parent, dom, nextSibling) {
    if (nextSibling != null) parent.insertBefore(dom, nextSibling);else parent.appendChild(dom);
  }

  function maybeSetContentEditable(vnode) {
    if (vnode.attrs == null || vnode.attrs.contenteditable == null && // attribute
    vnode.attrs.contentEditable == null // property
    ) return false;
    var children = vnode.children;

    if (children != null && children.length === 1 && children[0].tag === "<") {
      var content = children[0].children;
      if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content;
    } else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted");

    return true;
  } //remove


  function removeNodes(parent, vnodes, start, end) {
    for (var i = start; i < end; i++) {
      var vnode = vnodes[i];
      if (vnode != null) removeNode(parent, vnode);
    }
  }

  function removeNode(parent, vnode) {
    var mask = 0;
    var original = vnode.state;
    var stateResult, attrsResult;

    if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeremove === "function") {
      var result = callHook.call(vnode.state.onbeforeremove, vnode);

      if (result != null && typeof result.then === "function") {
        mask = 1;
        stateResult = result;
      }
    }

    if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
      var result = callHook.call(vnode.attrs.onbeforeremove, vnode);

      if (result != null && typeof result.then === "function") {
        // eslint-disable-next-line no-bitwise
        mask |= 2;
        attrsResult = result;
      }
    }

    checkState(vnode, original); // If we can, try to fast-path it and avoid all the overhead of awaiting

    if (!mask) {
      onremove(vnode);
      removeChild(parent, vnode);
    } else {
      if (stateResult != null) {
        var next = function () {
          // eslint-disable-next-line no-bitwise
          if (mask & 1) {
            mask &= 2;
            if (!mask) reallyRemove();
          }
        };

        stateResult.then(next, next);
      }

      if (attrsResult != null) {
        var next = function () {
          // eslint-disable-next-line no-bitwise
          if (mask & 2) {
            mask &= 1;
            if (!mask) reallyRemove();
          }
        };

        attrsResult.then(next, next);
      }
    }

    function reallyRemove() {
      checkState(vnode, original);
      onremove(vnode);
      removeChild(parent, vnode);
    }
  }

  function removeHTML(parent, vnode) {
    for (var i = 0; i < vnode.instance.length; i++) {
      parent.removeChild(vnode.instance[i]);
    }
  }

  function removeChild(parent, vnode) {
    // Dodge the recursion overhead in a few of the most common cases.
    while (vnode.dom != null && vnode.dom.parentNode === parent) {
      if (typeof vnode.tag !== "string") {
        vnode = vnode.instance;
        if (vnode != null) continue;
      } else if (vnode.tag === "<") {
        removeHTML(parent, vnode);
      } else {
        if (vnode.tag !== "[") {
          parent.removeChild(vnode.dom);
          if (!Array.isArray(vnode.children)) break;
        }

        if (vnode.children.length === 1) {
          vnode = vnode.children[0];
          if (vnode != null) continue;
        } else {
          for (var i = 0; i < vnode.children.length; i++) {
            var child = vnode.children[i];
            if (child != null) removeChild(parent, child);
          }
        }
      }

      break;
    }
  }

  function onremove(vnode) {
    if (typeof vnode.tag !== "string" && typeof vnode.state.onremove === "function") callHook.call(vnode.state.onremove, vnode);
    if (vnode.attrs && typeof vnode.attrs.onremove === "function") callHook.call(vnode.attrs.onremove, vnode);

    if (typeof vnode.tag !== "string") {
      if (vnode.instance != null) onremove(vnode.instance);
    } else {
      var children = vnode.children;

      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          if (child != null) onremove(child);
        }
      }
    }
  } //attrs


  function setAttrs(vnode, attrs, ns) {
    for (var key in attrs) {
      setAttr(vnode, key, null, attrs[key], ns);
    }
  }

  function setAttr(vnode, key, old, value, ns) {
    if (key === "key" || key === "is" || value == null || isLifecycleMethod(key) || old === value && !isFormAttribute(vnode, key) && typeof value !== "object") return;
    if (key[0] === "o" && key[1] === "n") return updateEvent(vnode, key, value);
    if (key.slice(0, 6) === "xlink:") vnode.dom.setAttributeNS("http://www.w3.org/1999/xlink", key.slice(6), value);else if (key === "style") updateStyle(vnode.dom, old, value);else if (hasPropertyKey(vnode, key, ns)) {
      if (key === "value") {
        // Only do the coercion if we're actually going to check the value.

        /* eslint-disable no-implicit-coercion */
        //setting input[value] to same value by typing on focused element moves cursor to end in Chrome
        if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === "" + value && vnode.dom === activeElement()) return; //setting select[value] to same value while having select open blinks select dropdown in Chrome

        if (vnode.tag === "select" && old !== null && vnode.dom.value === "" + value) return; //setting option[value] to same value while having select open blinks select dropdown in Chrome

        if (vnode.tag === "option" && old !== null && vnode.dom.value === "" + value) return;
        /* eslint-enable no-implicit-coercion */
      } // If you assign an input type that is not supported by IE 11 with an assignment expression, an error will occur.


      if (vnode.tag === "input" && key === "type") vnode.dom.setAttribute(key, value);else vnode.dom[key] = value;
    } else {
      if (typeof value === "boolean") {
        if (value) vnode.dom.setAttribute(key, "");else vnode.dom.removeAttribute(key);
      } else vnode.dom.setAttribute(key === "className" ? "class" : key, value);
    }
  }

  function removeAttr(vnode, key, old, ns) {
    if (key === "key" || key === "is" || old == null || isLifecycleMethod(key)) return;
    if (key[0] === "o" && key[1] === "n" && !isLifecycleMethod(key)) updateEvent(vnode, key, undefined);else if (key === "style") updateStyle(vnode.dom, old, null);else if (hasPropertyKey(vnode, key, ns) && key !== "className" && !(key === "value" && (vnode.tag === "option" || vnode.tag === "select" && vnode.dom.selectedIndex === -1 && vnode.dom === activeElement())) && !(vnode.tag === "input" && key === "type")) {
      vnode.dom[key] = null;
    } else {
      var nsLastIndex = key.indexOf(":");
      if (nsLastIndex !== -1) key = key.slice(nsLastIndex + 1);
      if (old !== false) vnode.dom.removeAttribute(key === "className" ? "class" : key);
    }
  }

  function setLateSelectAttrs(vnode, attrs) {
    if ("value" in attrs) {
      if (attrs.value === null) {
        if (vnode.dom.selectedIndex !== -1) vnode.dom.value = null;
      } else {
        var normalized = "" + attrs.value; // eslint-disable-line no-implicit-coercion

        if (vnode.dom.value !== normalized || vnode.dom.selectedIndex === -1) {
          vnode.dom.value = normalized;
        }
      }
    }

    if ("selectedIndex" in attrs) setAttr(vnode, "selectedIndex", null, attrs.selectedIndex, undefined);
  }

  function updateAttrs(vnode, old, attrs, ns) {
    if (attrs != null) {
      for (var key in attrs) {
        setAttr(vnode, key, old && old[key], attrs[key], ns);
      }
    }

    var val;

    if (old != null) {
      for (var key in old) {
        if ((val = old[key]) != null && (attrs == null || attrs[key] == null)) {
          removeAttr(vnode, key, val, ns);
        }
      }
    }
  }

  function isFormAttribute(vnode, attr) {
    return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === activeElement() || vnode.tag === "option" && vnode.dom.parentNode === $doc.activeElement;
  }

  function isLifecycleMethod(attr) {
    return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate";
  }

  function hasPropertyKey(vnode, key, ns) {
    // Filter out namespaced keys
    return ns === undefined && ( // If it's a custom element, just keep it.
    vnode.tag.indexOf("-") > -1 || vnode.attrs != null && vnode.attrs.is || // If it's a normal element, let's try to avoid a few browser bugs.
    key !== "href" && key !== "list" && key !== "form" && key !== "width" && key !== "height" // && key !== "type"
    // Defer the property check until *after* we check everything.
    ) && key in vnode.dom;
  } //style


  var uppercaseRegex = /[A-Z]/g;

  function toLowerCase(capital) {
    return "-" + capital.toLowerCase();
  }

  function normalizeKey(key) {
    return key[0] === "-" && key[1] === "-" ? key : key === "cssFloat" ? "float" : key.replace(uppercaseRegex, toLowerCase);
  }

  function updateStyle(element, old, style) {
    if (old === style) {// Styles are equivalent, do nothing.
    } else if (style == null) {
      // New style is missing, just clear it.
      element.style.cssText = "";
    } else if (typeof style !== "object") {
      // New style is a string, let engine deal with patching.
      element.style.cssText = style;
    } else if (old == null || typeof old !== "object") {
      // `old` is missing or a string, `style` is an object.
      element.style.cssText = ""; // Add new style properties

      for (var key in style) {
        var value = style[key];
        if (value != null) element.style.setProperty(normalizeKey(key), String(value));
      }
    } else {
      // Both old & new are (different) objects.
      // Update style properties that have changed
      for (var key in style) {
        var value = style[key];

        if (value != null && (value = String(value)) !== String(old[key])) {
          element.style.setProperty(normalizeKey(key), value);
        }
      } // Remove style properties that no longer exist


      for (var key in old) {
        if (old[key] != null && style[key] == null) {
          element.style.removeProperty(normalizeKey(key));
        }
      }
    }
  } // Here's an explanation of how this works:
  // 1. The event names are always (by design) prefixed by `on`.
  // 2. The EventListener interface accepts either a function or an object
  //    with a `handleEvent` method.
  // 3. The object does not inherit from `Object.prototype`, to avoid
  //    any potential interference with that (e.g. setters).
  // 4. The event name is remapped to the handler before calling it.
  // 5. In function-based event handlers, `ev.target === this`. We replicate
  //    that below.
  // 6. In function-based event handlers, `return false` prevents the default
  //    action and stops event propagation. We replicate that below.


  function EventDict() {
    // Save this, so the current redraw is correctly tracked.
    this._ = currentRedraw;
  }

  EventDict.prototype = Object.create(null);

  EventDict.prototype.handleEvent = function (ev) {
    var handler = this["on" + ev.type];
    var result;
    if (typeof handler === "function") result = handler.call(ev.currentTarget, ev);else if (typeof handler.handleEvent === "function") handler.handleEvent(ev);
    if (this._ && ev.redraw !== false) (0, this._)();

    if (result === false) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }; //event


  function updateEvent(vnode, key, value) {
    if (vnode.events != null) {
      if (vnode.events[key] === value) return;

      if (value != null && (typeof value === "function" || typeof value === "object")) {
        if (vnode.events[key] == null) vnode.dom.addEventListener(key.slice(2), vnode.events, false);
        vnode.events[key] = value;
      } else {
        if (vnode.events[key] != null) vnode.dom.removeEventListener(key.slice(2), vnode.events, false);
        vnode.events[key] = undefined;
      }
    } else if (value != null && (typeof value === "function" || typeof value === "object")) {
      vnode.events = new EventDict();
      vnode.dom.addEventListener(key.slice(2), vnode.events, false);
      vnode.events[key] = value;
    }
  } //lifecycle


  function initLifecycle(source, vnode, hooks) {
    if (typeof source.oninit === "function") callHook.call(source.oninit, vnode);
    if (typeof source.oncreate === "function") hooks.push(callHook.bind(source.oncreate, vnode));
  }

  function updateLifecycle(source, vnode, hooks) {
    if (typeof source.onupdate === "function") hooks.push(callHook.bind(source.onupdate, vnode));
  }

  function shouldNotUpdate(vnode, old) {
    do {
      if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") {
        var force = callHook.call(vnode.attrs.onbeforeupdate, vnode, old);
        if (force !== undefined && !force) break;
      }

      if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeupdate === "function") {
        var force = callHook.call(vnode.state.onbeforeupdate, vnode, old);
        if (force !== undefined && !force) break;
      }

      return false;
    } while (false); // eslint-disable-line no-constant-condition


    vnode.dom = old.dom;
    vnode.domSize = old.domSize;
    vnode.instance = old.instance; // One would think having the actual latest attributes would be ideal,
    // but it doesn't let us properly diff based on our current internal
    // representation. We have to save not only the old DOM info, but also
    // the attributes used to create it, as we diff *that*, not against the
    // DOM directly (with a few exceptions in `setAttr`). And, of course, we
    // need to save the children and text as they are conceptually not
    // unlike special "attributes" internally.

    vnode.attrs = old.attrs;
    vnode.children = old.children;
    vnode.text = old.text;
    return true;
  }

  return function (dom, vnodes, redraw) {
    if (!dom) throw new TypeError("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
    var hooks = [];
    var active = activeElement();
    var namespace = dom.namespaceURI; // First time rendering into a node clears it out

    if (dom.vnodes == null) dom.textContent = "";
    vnodes = Vnode.normalizeChildren(Array.isArray(vnodes) ? vnodes : [vnodes]);
    var prevRedraw = currentRedraw;

    try {
      currentRedraw = typeof redraw === "function" ? redraw : undefined;
      updateNodes(dom, dom.vnodes, vnodes, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace);
    } finally {
      currentRedraw = prevRedraw;
    }

    dom.vnodes = vnodes; // `document.activeElement` can return null: https://html.spec.whatwg.org/multipage/interaction.html#dom-document-activeelement

    if (active != null && activeElement() !== active && typeof active.focus === "function") active.focus();

    for (var i = 0; i < hooks.length; i++) hooks[i]();
  };
};

/***/ }),

/***/ "./node_modules/mithril/render/trust.js":
/*!**********************************************!*\
  !*** ./node_modules/mithril/render/trust.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var Vnode = __webpack_require__(/*! ../render/vnode */ "./node_modules/mithril/render/vnode.js");

module.exports = function (html) {
  if (html == null) html = "";
  return Vnode("<", undefined, undefined, html, undefined, undefined);
};

/***/ }),

/***/ "./node_modules/mithril/render/vnode.js":
/*!**********************************************!*\
  !*** ./node_modules/mithril/render/vnode.js ***!
  \**********************************************/
/***/ ((module) => {



function Vnode(tag, key, attrs, children, text, dom) {
  return {
    tag: tag,
    key: key,
    attrs: attrs,
    children: children,
    text: text,
    dom: dom,
    domSize: undefined,
    state: undefined,
    events: undefined,
    instance: undefined
  };
}

Vnode.normalize = function (node) {
  if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined);
  if (node == null || typeof node === "boolean") return null;
  if (typeof node === "object") return node;
  return Vnode("#", undefined, undefined, String(node), undefined, undefined);
};

Vnode.normalizeChildren = function (input) {
  var children = [];

  if (input.length) {
    var isKeyed = input[0] != null && input[0].key != null; // Note: this is a *very* perf-sensitive check.
    // Fun fact: merging the loop like this is somehow faster than splitting
    // it, noticeably so.

    for (var i = 1; i < input.length; i++) {
      if ((input[i] != null && input[i].key != null) !== isKeyed) {
        throw new TypeError("Vnodes must either always have keys or never have keys!");
      }
    }

    for (var i = 0; i < input.length; i++) {
      children[i] = Vnode.normalize(input[i]);
    }
  }

  return children;
};

module.exports = Vnode;

/***/ }),

/***/ "./node_modules/mithril/request.js":
/*!*****************************************!*\
  !*** ./node_modules/mithril/request.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var PromisePolyfill = __webpack_require__(/*! ./promise/promise */ "./node_modules/mithril/promise/promise.js");

var mountRedraw = __webpack_require__(/*! ./mount-redraw */ "./node_modules/mithril/mount-redraw.js");

module.exports = __webpack_require__(/*! ./request/request */ "./node_modules/mithril/request/request.js")(window, PromisePolyfill, mountRedraw.redraw);

/***/ }),

/***/ "./node_modules/mithril/request/request.js":
/*!*************************************************!*\
  !*** ./node_modules/mithril/request/request.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var buildPathname = __webpack_require__(/*! ../pathname/build */ "./node_modules/mithril/pathname/build.js");

module.exports = function ($window, Promise, oncompletion) {
  var callbackCount = 0;

  function PromiseProxy(executor) {
    return new Promise(executor);
  } // In case the global Promise is some userland library's where they rely on
  // `foo instanceof this.constructor`, `this.constructor.resolve(value)`, or
  // similar. Let's *not* break them.


  PromiseProxy.prototype = Promise.prototype;
  PromiseProxy.__proto__ = Promise; // eslint-disable-line no-proto

  function makeRequest(factory) {
    return function (url, args) {
      if (typeof url !== "string") {
        args = url;
        url = url.url;
      } else if (args == null) args = {};

      var promise = new Promise(function (resolve, reject) {
        factory(buildPathname(url, args.params), args, function (data) {
          if (typeof args.type === "function") {
            if (Array.isArray(data)) {
              for (var i = 0; i < data.length; i++) {
                data[i] = new args.type(data[i]);
              }
            } else data = new args.type(data);
          }

          resolve(data);
        }, reject);
      });
      if (args.background === true) return promise;
      var count = 0;

      function complete() {
        if (--count === 0 && typeof oncompletion === "function") oncompletion();
      }

      return wrap(promise);

      function wrap(promise) {
        var then = promise.then; // Set the constructor, so engines know to not await or resolve
        // this as a native promise. At the time of writing, this is
        // only necessary for V8, but their behavior is the correct
        // behavior per spec. See this spec issue for more details:
        // https://github.com/tc39/ecma262/issues/1577. Also, see the
        // corresponding comment in `request/tests/test-request.js` for
        // a bit more background on the issue at hand.

        promise.constructor = PromiseProxy;

        promise.then = function () {
          count++;
          var next = then.apply(promise, arguments);
          next.then(complete, function (e) {
            complete();
            if (count === 0) throw e;
          });
          return wrap(next);
        };

        return promise;
      }
    };
  }

  function hasHeader(args, name) {
    for (var key in args.headers) {
      if ({}.hasOwnProperty.call(args.headers, key) && name.test(key)) return true;
    }

    return false;
  }

  return {
    request: makeRequest(function (url, args, resolve, reject) {
      var method = args.method != null ? args.method.toUpperCase() : "GET";
      var body = args.body;
      var assumeJSON = (args.serialize == null || args.serialize === JSON.serialize) && !(body instanceof $window.FormData);
      var responseType = args.responseType || (typeof args.extract === "function" ? "" : "json");
      var xhr = new $window.XMLHttpRequest(),
          aborted = false;
      var original = xhr,
          replacedAbort;
      var abort = xhr.abort;

      xhr.abort = function () {
        aborted = true;
        abort.call(this);
      };

      xhr.open(method, url, args.async !== false, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined);

      if (assumeJSON && body != null && !hasHeader(args, /^content-type$/i)) {
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      }

      if (typeof args.deserialize !== "function" && !hasHeader(args, /^accept$/i)) {
        xhr.setRequestHeader("Accept", "application/json, text/*");
      }

      if (args.withCredentials) xhr.withCredentials = args.withCredentials;
      if (args.timeout) xhr.timeout = args.timeout;
      xhr.responseType = responseType;

      for (var key in args.headers) {
        if ({}.hasOwnProperty.call(args.headers, key)) {
          xhr.setRequestHeader(key, args.headers[key]);
        }
      }

      xhr.onreadystatechange = function (ev) {
        // Don't throw errors on xhr.abort().
        if (aborted) return;

        if (ev.target.readyState === 4) {
          try {
            var success = ev.target.status >= 200 && ev.target.status < 300 || ev.target.status === 304 || /^file:\/\//i.test(url); // When the response type isn't "" or "text",
            // `xhr.responseText` is the wrong thing to use.
            // Browsers do the right thing and throw here, and we
            // should honor that and do the right thing by
            // preferring `xhr.response` where possible/practical.

            var response = ev.target.response,
                message;

            if (responseType === "json") {
              // For IE and Edge, which don't implement
              // `responseType: "json"`.
              if (!ev.target.responseType && typeof args.extract !== "function") response = JSON.parse(ev.target.responseText);
            } else if (!responseType || responseType === "text") {
              // Only use this default if it's text. If a parsed
              // document is needed on old IE and friends (all
              // unsupported), the user should use a custom
              // `config` instead. They're already using this at
              // their own risk.
              if (response == null) response = ev.target.responseText;
            }

            if (typeof args.extract === "function") {
              response = args.extract(ev.target, args);
              success = true;
            } else if (typeof args.deserialize === "function") {
              response = args.deserialize(response);
            }

            if (success) resolve(response);else {
              try {
                message = ev.target.responseText;
              } catch (e) {
                message = response;
              }

              var error = new Error(message);
              error.code = ev.target.status;
              error.response = response;
              reject(error);
            }
          } catch (e) {
            reject(e);
          }
        }
      };

      if (typeof args.config === "function") {
        xhr = args.config(xhr, args, url) || xhr; // Propagate the `abort` to any replacement XHR as well.

        if (xhr !== original) {
          replacedAbort = xhr.abort;

          xhr.abort = function () {
            aborted = true;
            replacedAbort.call(this);
          };
        }
      }

      if (body == null) xhr.send();else if (typeof args.serialize === "function") xhr.send(args.serialize(body));else if (body instanceof $window.FormData) xhr.send(body);else xhr.send(JSON.stringify(body));
    }),
    jsonp: makeRequest(function (url, args, resolve, reject) {
      var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++;
      var script = $window.document.createElement("script");

      $window[callbackName] = function (data) {
        delete $window[callbackName];
        script.parentNode.removeChild(script);
        resolve(data);
      };

      script.onerror = function () {
        delete $window[callbackName];
        script.parentNode.removeChild(script);
        reject(new Error("JSONP request failed"));
      };

      script.src = url + (url.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(args.callbackKey || "callback") + "=" + encodeURIComponent(callbackName);
      $window.document.documentElement.appendChild(script);
    })
  };
};

/***/ }),

/***/ "./node_modules/mithril/route.js":
/*!***************************************!*\
  !*** ./node_modules/mithril/route.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var mountRedraw = __webpack_require__(/*! ./mount-redraw */ "./node_modules/mithril/mount-redraw.js");

module.exports = __webpack_require__(/*! ./api/router */ "./node_modules/mithril/api/router.js")(window, mountRedraw);

/***/ }),

/***/ "./src/view/Components/App.jsx":
/*!*************************************!*\
  !*** ./src/view/Components/App.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "App": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Header_Header_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Header/Header.jsx */ "./src/view/Components/Header/Header.jsx");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var App = /*#__PURE__*/function () {
  function App() {
    _classCallCheck(this, App);
  }

  _createClass(App, [{
    key: "view",
    value: function view() {
      return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div", null, mithril__WEBPACK_IMPORTED_MODULE_0___default()(_Header_Header_jsx__WEBPACK_IMPORTED_MODULE_1__.Header, null));
    }
  }]);

  return App;
}();

/***/ }),

/***/ "./src/view/Components/Header/Header.jsx":
/*!***********************************************!*\
  !*** ./src/view/Components/Header/Header.jsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Header": () => (/* binding */ Header)
/* harmony export */ });
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");
/* harmony import */ var mithril__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mithril__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _header_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_header.scss */ "./src/view/Components/Header/_header.scss");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Header = /*#__PURE__*/function () {
  function Header() {
    _classCallCheck(this, Header);
  }

  _createClass(Header, [{
    key: "view",
    value: function view() {
      return mithril__WEBPACK_IMPORTED_MODULE_0___default()("div", null, mithril__WEBPACK_IMPORTED_MODULE_0___default()("div", {
        "class": "main_area"
      }));
    }
  }]);

  return Header;
}();

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/view/Components/Header/_header.scss":
/*!***************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/view/Components/Header/_header.scss ***!
  \***************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*IMPORTS*/\n/*IMPORTS*/\n/*HEADER*/\n.main_area {\n  width: 100vw;\n  height: 45.417vw;\n  background: rgba(250, 251, 255, 0.7);\n  opacity: 0.9;\n  backdrop-filter: blur(44px);\n}\n\n/*HEADER*/", "",{"version":3,"sources":["webpack://./src/view/Components/Header/_header.scss"],"names":[],"mappings":"AAAA,UAAA;AAIA,UAAA;AAEA,SAAA;AACA;EACI,YAAA;EACA,gBAAA;EACA,oCAAA;EACA,YAAA;EACA,2BAAA;AAHJ;;AAKA,SAAA","sourcesContent":["/*IMPORTS*/\r\n@import '../padding';\r\n@import '../palette';\r\n@import '../size';\r\n/*IMPORTS*/\r\n\r\n/*HEADER*/\r\n.main_area{\r\n    width: toVw(1920);\r\n    height: toVw(872);\r\n    background: rgba(250, 251, 255, 0.7);\r\n    opacity: 0.9;\r\n    backdrop-filter: blur(44px);\r\n}\r\n/*HEADER*/"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/view/Components/Header/_header.scss":
/*!*************************************************!*\
  !*** ./src/view/Components/Header/_header.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_header_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!../../../../../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./_header.scss */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/view/Components/Header/_header.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_Components_App_jsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view/Components/App.jsx */ "./src/view/Components/App.jsx");
var m = __webpack_require__(/*! mithril */ "./node_modules/mithril/index.js");

var root = document.body;

m.render(root, [m(_view_Components_App_jsx__WEBPACK_IMPORTED_MODULE_0__.App)]);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTkEsSUFBSTNaLENBQUMsR0FBR3BCLG1CQUFPLENBQUMsZ0RBQUQsQ0FBZjs7QUFDQSxJQUFJYSxJQUFJLEdBQUcwTixRQUFRLENBQUNrSyxJQUFwQjtBQUVBO0FBRUFyWCxDQUFDLENBQUNuQixNQUFGLENBQVNZLElBQVQsRUFBZSxDQUNYTyxDQUFDLENBQUM0Wix5REFBRCxDQURVLENBQWYsRSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvYXBpL21vdW50LXJlZHJhdy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9hcGkvcm91dGVyLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL2h5cGVyc2NyaXB0LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL21vdW50LXJlZHJhdy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9wYXRobmFtZS9hc3NpZ24uanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcGF0aG5hbWUvYnVpbGQuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcGF0aG5hbWUvY29tcGlsZVRlbXBsYXRlLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL3BhdGhuYW1lL3BhcnNlLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL3Byb21pc2UvcG9seWZpbGwuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcHJvbWlzZS9wcm9taXNlLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL3F1ZXJ5c3RyaW5nL2J1aWxkLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL3F1ZXJ5c3RyaW5nL3BhcnNlLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL3JlbmRlci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9yZW5kZXIvZnJhZ21lbnQuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcmVuZGVyL2h5cGVyc2NyaXB0LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL3JlbmRlci9oeXBlcnNjcmlwdFZub2RlLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL3JlbmRlci9yZW5kZXIuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL21pdGhyaWwvcmVuZGVyL3RydXN0LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL3JlbmRlci92bm9kZS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9yZXF1ZXN0LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9taXRocmlsL3JlcXVlc3QvcmVxdWVzdC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvbWl0aHJpbC9yb3V0ZS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvdmlldy9Db21wb25lbnRzL0FwcC5qc3giLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vc3JjL3ZpZXcvQ29tcG9uZW50cy9IZWFkZXIvSGVhZGVyLmpzeCIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvdmlldy9Db21wb25lbnRzL0hlYWRlci9faGVhZGVyLnNjc3MiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vc3JjL3ZpZXcvQ29tcG9uZW50cy9IZWFkZXIvX2hlYWRlci5zY3NzPzRlZmMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dlYnBhY2stZGVtby93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdOyAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG5cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTsgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcblxuXG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG5cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG5cbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcblxuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblxuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICB2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8IFwiXCIpLmNvbmNhdChzb3VyY2UsIFwiICovXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBWbm9kZSA9IHJlcXVpcmUoXCIuLi9yZW5kZXIvdm5vZGVcIilcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyZW5kZXIsIHNjaGVkdWxlLCBjb25zb2xlKSB7XG5cdHZhciBzdWJzY3JpcHRpb25zID0gW11cblx0dmFyIHJlbmRlcmluZyA9IGZhbHNlXG5cdHZhciBwZW5kaW5nID0gZmFsc2VcblxuXHRmdW5jdGlvbiBzeW5jKCkge1xuXHRcdGlmIChyZW5kZXJpbmcpIHRocm93IG5ldyBFcnJvcihcIk5lc3RlZCBtLnJlZHJhdy5zeW5jKCkgY2FsbFwiKVxuXHRcdHJlbmRlcmluZyA9IHRydWVcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmlwdGlvbnMubGVuZ3RoOyBpICs9IDIpIHtcblx0XHRcdHRyeSB7IHJlbmRlcihzdWJzY3JpcHRpb25zW2ldLCBWbm9kZShzdWJzY3JpcHRpb25zW2kgKyAxXSksIHJlZHJhdykgfVxuXHRcdFx0Y2F0Y2ggKGUpIHsgY29uc29sZS5lcnJvcihlKSB9XG5cdFx0fVxuXHRcdHJlbmRlcmluZyA9IGZhbHNlXG5cdH1cblxuXHRmdW5jdGlvbiByZWRyYXcoKSB7XG5cdFx0aWYgKCFwZW5kaW5nKSB7XG5cdFx0XHRwZW5kaW5nID0gdHJ1ZVxuXHRcdFx0c2NoZWR1bGUoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHBlbmRpbmcgPSBmYWxzZVxuXHRcdFx0XHRzeW5jKClcblx0XHRcdH0pXG5cdFx0fVxuXHR9XG5cblx0cmVkcmF3LnN5bmMgPSBzeW5jXG5cblx0ZnVuY3Rpb24gbW91bnQocm9vdCwgY29tcG9uZW50KSB7XG5cdFx0aWYgKGNvbXBvbmVudCAhPSBudWxsICYmIGNvbXBvbmVudC52aWV3ID09IG51bGwgJiYgdHlwZW9mIGNvbXBvbmVudCAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwibS5tb3VudChlbGVtZW50LCBjb21wb25lbnQpIGV4cGVjdHMgYSBjb21wb25lbnQsIG5vdCBhIHZub2RlXCIpXG5cdFx0fVxuXG5cdFx0dmFyIGluZGV4ID0gc3Vic2NyaXB0aW9ucy5pbmRleE9mKHJvb3QpXG5cdFx0aWYgKGluZGV4ID49IDApIHtcblx0XHRcdHN1YnNjcmlwdGlvbnMuc3BsaWNlKGluZGV4LCAyKVxuXHRcdFx0cmVuZGVyKHJvb3QsIFtdLCByZWRyYXcpXG5cdFx0fVxuXG5cdFx0aWYgKGNvbXBvbmVudCAhPSBudWxsKSB7XG5cdFx0XHRzdWJzY3JpcHRpb25zLnB1c2gocm9vdCwgY29tcG9uZW50KVxuXHRcdFx0cmVuZGVyKHJvb3QsIFZub2RlKGNvbXBvbmVudCksIHJlZHJhdylcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge21vdW50OiBtb3VudCwgcmVkcmF3OiByZWRyYXd9XG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgVm5vZGUgPSByZXF1aXJlKFwiLi4vcmVuZGVyL3Zub2RlXCIpXG52YXIgbSA9IHJlcXVpcmUoXCIuLi9yZW5kZXIvaHlwZXJzY3JpcHRcIilcbnZhciBQcm9taXNlID0gcmVxdWlyZShcIi4uL3Byb21pc2UvcHJvbWlzZVwiKVxuXG52YXIgYnVpbGRQYXRobmFtZSA9IHJlcXVpcmUoXCIuLi9wYXRobmFtZS9idWlsZFwiKVxudmFyIHBhcnNlUGF0aG5hbWUgPSByZXF1aXJlKFwiLi4vcGF0aG5hbWUvcGFyc2VcIilcbnZhciBjb21waWxlVGVtcGxhdGUgPSByZXF1aXJlKFwiLi4vcGF0aG5hbWUvY29tcGlsZVRlbXBsYXRlXCIpXG52YXIgYXNzaWduID0gcmVxdWlyZShcIi4uL3BhdGhuYW1lL2Fzc2lnblwiKVxuXG52YXIgc2VudGluZWwgPSB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCR3aW5kb3csIG1vdW50UmVkcmF3KSB7XG5cdHZhciBmaXJlQXN5bmNcblxuXHRmdW5jdGlvbiBzZXRQYXRoKHBhdGgsIGRhdGEsIG9wdGlvbnMpIHtcblx0XHRwYXRoID0gYnVpbGRQYXRobmFtZShwYXRoLCBkYXRhKVxuXHRcdGlmIChmaXJlQXN5bmMgIT0gbnVsbCkge1xuXHRcdFx0ZmlyZUFzeW5jKClcblx0XHRcdHZhciBzdGF0ZSA9IG9wdGlvbnMgPyBvcHRpb25zLnN0YXRlIDogbnVsbFxuXHRcdFx0dmFyIHRpdGxlID0gb3B0aW9ucyA/IG9wdGlvbnMudGl0bGUgOiBudWxsXG5cdFx0XHRpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlcGxhY2UpICR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoc3RhdGUsIHRpdGxlLCByb3V0ZS5wcmVmaXggKyBwYXRoKVxuXHRcdFx0ZWxzZSAkd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlLCB0aXRsZSwgcm91dGUucHJlZml4ICsgcGF0aClcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQkd2luZG93LmxvY2F0aW9uLmhyZWYgPSByb3V0ZS5wcmVmaXggKyBwYXRoXG5cdFx0fVxuXHR9XG5cblx0dmFyIGN1cnJlbnRSZXNvbHZlciA9IHNlbnRpbmVsLCBjb21wb25lbnQsIGF0dHJzLCBjdXJyZW50UGF0aCwgbGFzdFVwZGF0ZVxuXG5cdHZhciBTS0lQID0gcm91dGUuU0tJUCA9IHt9XG5cblx0ZnVuY3Rpb24gcm91dGUocm9vdCwgZGVmYXVsdFJvdXRlLCByb3V0ZXMpIHtcblx0XHRpZiAocm9vdCA9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIERPTSBlbGVtZW50IHRoYXQgd2FzIHBhc3NlZCB0byBgbS5yb3V0ZWAgaXMgbm90IHVuZGVmaW5lZFwiKVxuXHRcdC8vIDAgPSBzdGFydFxuXHRcdC8vIDEgPSBpbml0XG5cdFx0Ly8gMiA9IHJlYWR5XG5cdFx0dmFyIHN0YXRlID0gMFxuXG5cdFx0dmFyIGNvbXBpbGVkID0gT2JqZWN0LmtleXMocm91dGVzKS5tYXAoZnVuY3Rpb24ocm91dGUpIHtcblx0XHRcdGlmIChyb3V0ZVswXSAhPT0gXCIvXCIpIHRocm93IG5ldyBTeW50YXhFcnJvcihcIlJvdXRlcyBtdXN0IHN0YXJ0IHdpdGggYSBgL2BcIilcblx0XHRcdGlmICgoLzooW15cXC9cXC4tXSspKFxcLnszfSk/Oi8pLnRlc3Qocm91dGUpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcIlJvdXRlIHBhcmFtZXRlciBuYW1lcyBtdXN0IGJlIHNlcGFyYXRlZCB3aXRoIGVpdGhlciBgL2AsIGAuYCwgb3IgYC1gXCIpXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyb3V0ZTogcm91dGUsXG5cdFx0XHRcdGNvbXBvbmVudDogcm91dGVzW3JvdXRlXSxcblx0XHRcdFx0Y2hlY2s6IGNvbXBpbGVUZW1wbGF0ZShyb3V0ZSksXG5cdFx0XHR9XG5cdFx0fSlcblx0XHR2YXIgY2FsbEFzeW5jID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0SW1tZWRpYXRlIDogc2V0VGltZW91dFxuXHRcdHZhciBwID0gUHJvbWlzZS5yZXNvbHZlKClcblx0XHR2YXIgc2NoZWR1bGVkID0gZmFsc2Vcblx0XHR2YXIgb25yZW1vdmVcblxuXHRcdGZpcmVBc3luYyA9IG51bGxcblxuXHRcdGlmIChkZWZhdWx0Um91dGUgIT0gbnVsbCkge1xuXHRcdFx0dmFyIGRlZmF1bHREYXRhID0gcGFyc2VQYXRobmFtZShkZWZhdWx0Um91dGUpXG5cblx0XHRcdGlmICghY29tcGlsZWQuc29tZShmdW5jdGlvbiAoaSkgeyByZXR1cm4gaS5jaGVjayhkZWZhdWx0RGF0YSkgfSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwiRGVmYXVsdCByb3V0ZSBkb2Vzbid0IG1hdGNoIGFueSBrbm93biByb3V0ZXNcIilcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZXNvbHZlUm91dGUoKSB7XG5cdFx0XHRzY2hlZHVsZWQgPSBmYWxzZVxuXHRcdFx0Ly8gQ29uc2lkZXIgdGhlIHBhdGhuYW1lIGhvbGlzdGljYWxseS4gVGhlIHByZWZpeCBtaWdodCBldmVuIGJlIGludmFsaWQsXG5cdFx0XHQvLyBidXQgdGhhdCdzIG5vdCBvdXIgcHJvYmxlbS5cblx0XHRcdHZhciBwcmVmaXggPSAkd2luZG93LmxvY2F0aW9uLmhhc2hcblx0XHRcdGlmIChyb3V0ZS5wcmVmaXhbMF0gIT09IFwiI1wiKSB7XG5cdFx0XHRcdHByZWZpeCA9ICR3aW5kb3cubG9jYXRpb24uc2VhcmNoICsgcHJlZml4XG5cdFx0XHRcdGlmIChyb3V0ZS5wcmVmaXhbMF0gIT09IFwiP1wiKSB7XG5cdFx0XHRcdFx0cHJlZml4ID0gJHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHByZWZpeFxuXHRcdFx0XHRcdGlmIChwcmVmaXhbMF0gIT09IFwiL1wiKSBwcmVmaXggPSBcIi9cIiArIHByZWZpeFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyBUaGlzIHNlZW1pbmdseSB1c2VsZXNzIGAuY29uY2F0KClgIHNwZWVkcyB1cCB0aGUgdGVzdHMgcXVpdGUgYSBiaXQsXG5cdFx0XHQvLyBzaW5jZSB0aGUgcmVwcmVzZW50YXRpb24gaXMgY29uc2lzdGVudGx5IGEgcmVsYXRpdmVseSBwb29ybHlcblx0XHRcdC8vIG9wdGltaXplZCBjb25zIHN0cmluZy5cblx0XHRcdHZhciBwYXRoID0gcHJlZml4LmNvbmNhdCgpXG5cdFx0XHRcdC5yZXBsYWNlKC8oPzolW2EtZjg5XVthLWYwLTldKSsvZ2ltLCBkZWNvZGVVUklDb21wb25lbnQpXG5cdFx0XHRcdC5zbGljZShyb3V0ZS5wcmVmaXgubGVuZ3RoKVxuXHRcdFx0dmFyIGRhdGEgPSBwYXJzZVBhdGhuYW1lKHBhdGgpXG5cblx0XHRcdGFzc2lnbihkYXRhLnBhcmFtcywgJHdpbmRvdy5oaXN0b3J5LnN0YXRlKVxuXG5cdFx0XHRmdW5jdGlvbiBmYWlsKCkge1xuXHRcdFx0XHRpZiAocGF0aCA9PT0gZGVmYXVsdFJvdXRlKSB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgcmVzb2x2ZSBkZWZhdWx0IHJvdXRlIFwiICsgZGVmYXVsdFJvdXRlKVxuXHRcdFx0XHRzZXRQYXRoKGRlZmF1bHRSb3V0ZSwgbnVsbCwge3JlcGxhY2U6IHRydWV9KVxuXHRcdFx0fVxuXG5cdFx0XHRsb29wKDApXG5cdFx0XHRmdW5jdGlvbiBsb29wKGkpIHtcblx0XHRcdFx0Ly8gMCA9IGluaXRcblx0XHRcdFx0Ly8gMSA9IHNjaGVkdWxlZFxuXHRcdFx0XHQvLyAyID0gZG9uZVxuXHRcdFx0XHRmb3IgKDsgaSA8IGNvbXBpbGVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKGNvbXBpbGVkW2ldLmNoZWNrKGRhdGEpKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGF5bG9hZCA9IGNvbXBpbGVkW2ldLmNvbXBvbmVudFxuXHRcdFx0XHRcdFx0dmFyIG1hdGNoZWRSb3V0ZSA9IGNvbXBpbGVkW2ldLnJvdXRlXG5cdFx0XHRcdFx0XHR2YXIgbG9jYWxDb21wID0gcGF5bG9hZFxuXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IGxhc3RVcGRhdGUgPSBmdW5jdGlvbihjb21wKSB7XG5cdFx0XHRcdFx0XHRcdGlmICh1cGRhdGUgIT09IGxhc3RVcGRhdGUpIHJldHVyblxuXHRcdFx0XHRcdFx0XHRpZiAoY29tcCA9PT0gU0tJUCkgcmV0dXJuIGxvb3AoaSArIDEpXG5cdFx0XHRcdFx0XHRcdGNvbXBvbmVudCA9IGNvbXAgIT0gbnVsbCAmJiAodHlwZW9mIGNvbXAudmlldyA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiBjb21wID09PSBcImZ1bmN0aW9uXCIpPyBjb21wIDogXCJkaXZcIlxuXHRcdFx0XHRcdFx0XHRhdHRycyA9IGRhdGEucGFyYW1zLCBjdXJyZW50UGF0aCA9IHBhdGgsIGxhc3RVcGRhdGUgPSBudWxsXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRSZXNvbHZlciA9IHBheWxvYWQucmVuZGVyID8gcGF5bG9hZCA6IG51bGxcblx0XHRcdFx0XHRcdFx0aWYgKHN0YXRlID09PSAyKSBtb3VudFJlZHJhdy5yZWRyYXcoKVxuXHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRzdGF0ZSA9IDJcblx0XHRcdFx0XHRcdFx0XHRtb3VudFJlZHJhdy5yZWRyYXcuc3luYygpXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vIFRoZXJlJ3Mgbm8gdW5kZXJzdGF0aW5nIGhvdyBtdWNoIEkgKndpc2gqIEkgY291bGRcblx0XHRcdFx0XHRcdC8vIHVzZSBgYXN5bmNgL2Bhd2FpdGAgaGVyZS4uLlxuXHRcdFx0XHRcdFx0aWYgKHBheWxvYWQudmlldyB8fCB0eXBlb2YgcGF5bG9hZCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRcdHBheWxvYWQgPSB7fVxuXHRcdFx0XHRcdFx0XHR1cGRhdGUobG9jYWxDb21wKVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAocGF5bG9hZC5vbm1hdGNoKSB7XG5cdFx0XHRcdFx0XHRcdHAudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHBheWxvYWQub25tYXRjaChkYXRhLnBhcmFtcywgcGF0aCwgbWF0Y2hlZFJvdXRlKVxuXHRcdFx0XHRcdFx0XHR9KS50aGVuKHVwZGF0ZSwgZmFpbClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgdXBkYXRlKFwiZGl2XCIpXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZmFpbCgpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2V0IGl0IHVuY29uZGl0aW9uYWxseSBzbyBgbS5yb3V0ZS5zZXRgIGFuZCBgbS5yb3V0ZS5MaW5rYCBib3RoIHdvcmssXG5cdFx0Ly8gZXZlbiBpZiBuZWl0aGVyIGBwdXNoU3RhdGVgIG5vciBgaGFzaGNoYW5nZWAgYXJlIHN1cHBvcnRlZC4gSXQnc1xuXHRcdC8vIGNsZWFyZWQgaWYgYGhhc2hjaGFuZ2VgIGlzIHVzZWQsIHNpbmNlIHRoYXQgbWFrZXMgaXQgYXV0b21hdGljYWxseVxuXHRcdC8vIGFzeW5jLlxuXHRcdGZpcmVBc3luYyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCFzY2hlZHVsZWQpIHtcblx0XHRcdFx0c2NoZWR1bGVkID0gdHJ1ZVxuXHRcdFx0XHRjYWxsQXN5bmMocmVzb2x2ZVJvdXRlKVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgJHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRvbnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCBmaXJlQXN5bmMsIGZhbHNlKVxuXHRcdFx0fVxuXHRcdFx0JHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgZmlyZUFzeW5jLCBmYWxzZSlcblx0XHR9IGVsc2UgaWYgKHJvdXRlLnByZWZpeFswXSA9PT0gXCIjXCIpIHtcblx0XHRcdGZpcmVBc3luYyA9IG51bGxcblx0XHRcdG9ucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2VcIiwgcmVzb2x2ZVJvdXRlLCBmYWxzZSlcblx0XHRcdH1cblx0XHRcdCR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2VcIiwgcmVzb2x2ZVJvdXRlLCBmYWxzZSlcblx0XHR9XG5cblx0XHRyZXR1cm4gbW91bnRSZWRyYXcubW91bnQocm9vdCwge1xuXHRcdFx0b25iZWZvcmV1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzdGF0ZSA9IHN0YXRlID8gMiA6IDFcblx0XHRcdFx0cmV0dXJuICEoIXN0YXRlIHx8IHNlbnRpbmVsID09PSBjdXJyZW50UmVzb2x2ZXIpXG5cdFx0XHR9LFxuXHRcdFx0b25jcmVhdGU6IHJlc29sdmVSb3V0ZSxcblx0XHRcdG9ucmVtb3ZlOiBvbnJlbW92ZSxcblx0XHRcdHZpZXc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoIXN0YXRlIHx8IHNlbnRpbmVsID09PSBjdXJyZW50UmVzb2x2ZXIpIHJldHVyblxuXHRcdFx0XHQvLyBXcmFwIGluIGEgZnJhZ21lbnQgdG8gcHJlc2VydmUgZXhpc3Rpbmcga2V5IHNlbWFudGljc1xuXHRcdFx0XHR2YXIgdm5vZGUgPSBbVm5vZGUoY29tcG9uZW50LCBhdHRycy5rZXksIGF0dHJzKV1cblx0XHRcdFx0aWYgKGN1cnJlbnRSZXNvbHZlcikgdm5vZGUgPSBjdXJyZW50UmVzb2x2ZXIucmVuZGVyKHZub2RlWzBdKVxuXHRcdFx0XHRyZXR1cm4gdm5vZGVcblx0XHRcdH0sXG5cdFx0fSlcblx0fVxuXHRyb3V0ZS5zZXQgPSBmdW5jdGlvbihwYXRoLCBkYXRhLCBvcHRpb25zKSB7XG5cdFx0aWYgKGxhc3RVcGRhdGUgIT0gbnVsbCkge1xuXHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblx0XHRcdG9wdGlvbnMucmVwbGFjZSA9IHRydWVcblx0XHR9XG5cdFx0bGFzdFVwZGF0ZSA9IG51bGxcblx0XHRzZXRQYXRoKHBhdGgsIGRhdGEsIG9wdGlvbnMpXG5cdH1cblx0cm91dGUuZ2V0ID0gZnVuY3Rpb24oKSB7cmV0dXJuIGN1cnJlbnRQYXRofVxuXHRyb3V0ZS5wcmVmaXggPSBcIiMhXCJcblx0cm91dGUuTGluayA9IHtcblx0XHR2aWV3OiBmdW5jdGlvbih2bm9kZSkge1xuXHRcdFx0dmFyIG9wdGlvbnMgPSB2bm9kZS5hdHRycy5vcHRpb25zXG5cdFx0XHQvLyBSZW1vdmUgdGhlc2Ugc28gdGhleSBkb24ndCBnZXQgb3ZlcndyaXR0ZW5cblx0XHRcdHZhciBhdHRycyA9IHt9LCBvbmNsaWNrLCBocmVmXG5cdFx0XHRhc3NpZ24oYXR0cnMsIHZub2RlLmF0dHJzKVxuXHRcdFx0Ly8gVGhlIGZpcnN0IHR3byBhcmUgaW50ZXJuYWwsIGJ1dCB0aGUgcmVzdCBhcmUgbWFnaWMgYXR0cmlidXRlc1xuXHRcdFx0Ly8gdGhhdCBuZWVkIGNlbnNvcmVkIHRvIG5vdCBzY3JldyB1cCByZW5kZXJpbmcuXG5cdFx0XHRhdHRycy5zZWxlY3RvciA9IGF0dHJzLm9wdGlvbnMgPSBhdHRycy5rZXkgPSBhdHRycy5vbmluaXQgPVxuXHRcdFx0YXR0cnMub25jcmVhdGUgPSBhdHRycy5vbmJlZm9yZXVwZGF0ZSA9IGF0dHJzLm9udXBkYXRlID1cblx0XHRcdGF0dHJzLm9uYmVmb3JlcmVtb3ZlID0gYXR0cnMub25yZW1vdmUgPSBudWxsXG5cblx0XHRcdC8vIERvIHRoaXMgbm93IHNvIHdlIGNhbiBnZXQgdGhlIG1vc3QgY3VycmVudCBgaHJlZmAgYW5kIGBkaXNhYmxlZGAuXG5cdFx0XHQvLyBUaG9zZSBhdHRyaWJ1dGVzIG1heSBhbHNvIGJlIHNwZWNpZmllZCBpbiB0aGUgc2VsZWN0b3IsIGFuZCB3ZVxuXHRcdFx0Ly8gc2hvdWxkIGhvbm9yIHRoYXQuXG5cdFx0XHR2YXIgY2hpbGQgPSBtKHZub2RlLmF0dHJzLnNlbGVjdG9yIHx8IFwiYVwiLCBhdHRycywgdm5vZGUuY2hpbGRyZW4pXG5cblx0XHRcdC8vIExldCdzIHByb3ZpZGUgYSAqcmlnaHQqIHdheSB0byBkaXNhYmxlIGEgcm91dGUgbGluaywgcmF0aGVyIHRoYW5cblx0XHRcdC8vIGxldHRpbmcgcGVvcGxlIHNjcmV3IHVwIGFjY2Vzc2liaWxpdHkgb24gYWNjaWRlbnQuXG5cdFx0XHQvL1xuXHRcdFx0Ly8gVGhlIGF0dHJpYnV0ZSBpcyBjb2VyY2VkIHNvIHVzZXJzIGRvbid0IGdldCBzdXJwcmlzZWQgb3ZlclxuXHRcdFx0Ly8gYGRpc2FibGVkOiAwYCByZXN1bHRpbmcgaW4gYSBidXR0b24gdGhhdCdzIHNvbWVob3cgcm91dGFibGVcblx0XHRcdC8vIGRlc3BpdGUgYmVpbmcgdmlzaWJseSBkaXNhYmxlZC5cblx0XHRcdGlmIChjaGlsZC5hdHRycy5kaXNhYmxlZCA9IEJvb2xlYW4oY2hpbGQuYXR0cnMuZGlzYWJsZWQpKSB7XG5cdFx0XHRcdGNoaWxkLmF0dHJzLmhyZWYgPSBudWxsXG5cdFx0XHRcdGNoaWxkLmF0dHJzW1wiYXJpYS1kaXNhYmxlZFwiXSA9IFwidHJ1ZVwiXG5cdFx0XHRcdC8vIElmIHlvdSAqcmVhbGx5KiBkbyB3YW50IHRvIGRvIHRoaXMgb24gYSBkaXNhYmxlZCBsaW5rLCB1c2Vcblx0XHRcdFx0Ly8gYW4gYG9uY3JlYXRlYCBob29rIHRvIGFkZCBpdC5cblx0XHRcdFx0Y2hpbGQuYXR0cnMub25jbGljayA9IG51bGxcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9uY2xpY2sgPSBjaGlsZC5hdHRycy5vbmNsaWNrXG5cdFx0XHRcdGhyZWYgPSBjaGlsZC5hdHRycy5ocmVmXG5cdFx0XHRcdGNoaWxkLmF0dHJzLmhyZWYgPSByb3V0ZS5wcmVmaXggKyBocmVmXG5cdFx0XHRcdGNoaWxkLmF0dHJzLm9uY2xpY2sgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0dmFyIHJlc3VsdFxuXHRcdFx0XHRcdGlmICh0eXBlb2Ygb25jbGljayA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBvbmNsaWNrLmNhbGwoZS5jdXJyZW50VGFyZ2V0LCBlKVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAob25jbGljayA9PSBudWxsIHx8IHR5cGVvZiBvbmNsaWNrICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0XHQvLyBkbyBub3RoaW5nXG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2Ygb25jbGljay5oYW5kbGVFdmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRvbmNsaWNrLmhhbmRsZUV2ZW50KGUpXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gQWRhcHRlZCBmcm9tIFJlYWN0IFJvdXRlcidzIGltcGxlbWVudGF0aW9uOlxuXHRcdFx0XHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdFRyYWluaW5nL3JlYWN0LXJvdXRlci9ibG9iLzUyMGEwYWNkNDhhZTFiMDY2ZWIwYjA3ZDZkNGQxNzkwYTFkMDI0ODIvcGFja2FnZXMvcmVhY3Qtcm91dGVyLWRvbS9tb2R1bGVzL0xpbmsuanNcblx0XHRcdFx0XHQvL1xuXHRcdFx0XHRcdC8vIFRyeSB0byBiZSBmbGV4aWJsZSBhbmQgaW50dWl0aXZlIGluIGhvdyB3ZSBoYW5kbGUgbGlua3MuXG5cdFx0XHRcdFx0Ly8gRnVuIGZhY3Q6IGxpbmtzIGFyZW4ndCBhcyBvYnZpb3VzIHRvIGdldCByaWdodCBhcyB5b3Vcblx0XHRcdFx0XHQvLyB3b3VsZCBleHBlY3QuIFRoZXJlJ3MgYSBsb3QgbW9yZSB2YWxpZCB3YXlzIHRvIGNsaWNrIGFcblx0XHRcdFx0XHQvLyBsaW5rIHRoYW4gdGhpcywgYW5kIG9uZSBtaWdodCB3YW50IHRvIG5vdCBzaW1wbHkgY2xpY2sgYVxuXHRcdFx0XHRcdC8vIGxpbmssIGJ1dCByaWdodCBjbGljayBvciBjb21tYW5kLWNsaWNrIGl0IHRvIGNvcHkgdGhlXG5cdFx0XHRcdFx0Ly8gbGluayB0YXJnZXQsIGV0Yy4gTm9wZSwgdGhpcyBpc24ndCBqdXN0IGZvciBibGluZCBwZW9wbGUuXG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0Ly8gU2tpcCBpZiBgb25jbGlja2AgcHJldmVudGVkIGRlZmF1bHRcblx0XHRcdFx0XHRcdHJlc3VsdCAhPT0gZmFsc2UgJiYgIWUuZGVmYXVsdFByZXZlbnRlZCAmJlxuXHRcdFx0XHRcdFx0Ly8gSWdub3JlIGV2ZXJ5dGhpbmcgYnV0IGxlZnQgY2xpY2tzXG5cdFx0XHRcdFx0XHQoZS5idXR0b24gPT09IDAgfHwgZS53aGljaCA9PT0gMCB8fCBlLndoaWNoID09PSAxKSAmJlxuXHRcdFx0XHRcdFx0Ly8gTGV0IHRoZSBicm93c2VyIGhhbmRsZSBgdGFyZ2V0PV9ibGFua2AsIGV0Yy5cblx0XHRcdFx0XHRcdCghZS5jdXJyZW50VGFyZ2V0LnRhcmdldCB8fCBlLmN1cnJlbnRUYXJnZXQudGFyZ2V0ID09PSBcIl9zZWxmXCIpICYmXG5cdFx0XHRcdFx0XHQvLyBObyBtb2RpZmllciBrZXlzXG5cdFx0XHRcdFx0XHQhZS5jdHJsS2V5ICYmICFlLm1ldGFLZXkgJiYgIWUuc2hpZnRLZXkgJiYgIWUuYWx0S2V5XG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdGUucmVkcmF3ID0gZmFsc2Vcblx0XHRcdFx0XHRcdHJvdXRlLnNldChocmVmLCBudWxsLCBvcHRpb25zKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoaWxkXG5cdFx0fSxcblx0fVxuXHRyb3V0ZS5wYXJhbSA9IGZ1bmN0aW9uKGtleSkge1xuXHRcdHJldHVybiBhdHRycyAmJiBrZXkgIT0gbnVsbCA/IGF0dHJzW2tleV0gOiBhdHRyc1xuXHR9XG5cblx0cmV0dXJuIHJvdXRlXG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgaHlwZXJzY3JpcHQgPSByZXF1aXJlKFwiLi9yZW5kZXIvaHlwZXJzY3JpcHRcIilcblxuaHlwZXJzY3JpcHQudHJ1c3QgPSByZXF1aXJlKFwiLi9yZW5kZXIvdHJ1c3RcIilcbmh5cGVyc2NyaXB0LmZyYWdtZW50ID0gcmVxdWlyZShcIi4vcmVuZGVyL2ZyYWdtZW50XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gaHlwZXJzY3JpcHRcbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBoeXBlcnNjcmlwdCA9IHJlcXVpcmUoXCIuL2h5cGVyc2NyaXB0XCIpXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoXCIuL3JlcXVlc3RcIilcbnZhciBtb3VudFJlZHJhdyA9IHJlcXVpcmUoXCIuL21vdW50LXJlZHJhd1wiKVxuXG52YXIgbSA9IGZ1bmN0aW9uIG0oKSB7IHJldHVybiBoeXBlcnNjcmlwdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIH1cbm0ubSA9IGh5cGVyc2NyaXB0XG5tLnRydXN0ID0gaHlwZXJzY3JpcHQudHJ1c3Rcbm0uZnJhZ21lbnQgPSBoeXBlcnNjcmlwdC5mcmFnbWVudFxubS5tb3VudCA9IG1vdW50UmVkcmF3Lm1vdW50XG5tLnJvdXRlID0gcmVxdWlyZShcIi4vcm91dGVcIilcbm0ucmVuZGVyID0gcmVxdWlyZShcIi4vcmVuZGVyXCIpXG5tLnJlZHJhdyA9IG1vdW50UmVkcmF3LnJlZHJhd1xubS5yZXF1ZXN0ID0gcmVxdWVzdC5yZXF1ZXN0XG5tLmpzb25wID0gcmVxdWVzdC5qc29ucFxubS5wYXJzZVF1ZXJ5U3RyaW5nID0gcmVxdWlyZShcIi4vcXVlcnlzdHJpbmcvcGFyc2VcIilcbm0uYnVpbGRRdWVyeVN0cmluZyA9IHJlcXVpcmUoXCIuL3F1ZXJ5c3RyaW5nL2J1aWxkXCIpXG5tLnBhcnNlUGF0aG5hbWUgPSByZXF1aXJlKFwiLi9wYXRobmFtZS9wYXJzZVwiKVxubS5idWlsZFBhdGhuYW1lID0gcmVxdWlyZShcIi4vcGF0aG5hbWUvYnVpbGRcIilcbm0udm5vZGUgPSByZXF1aXJlKFwiLi9yZW5kZXIvdm5vZGVcIilcbm0uUHJvbWlzZVBvbHlmaWxsID0gcmVxdWlyZShcIi4vcHJvbWlzZS9wb2x5ZmlsbFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciByZW5kZXIgPSByZXF1aXJlKFwiLi9yZW5kZXJcIilcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9hcGkvbW91bnQtcmVkcmF3XCIpKHJlbmRlciwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBjb25zb2xlKVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHRhcmdldCwgc291cmNlKSB7XG5cdGlmKHNvdXJjZSkgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldIH0pXG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgYnVpbGRRdWVyeVN0cmluZyA9IHJlcXVpcmUoXCIuLi9xdWVyeXN0cmluZy9idWlsZFwiKVxudmFyIGFzc2lnbiA9IHJlcXVpcmUoXCIuL2Fzc2lnblwiKVxuXG4vLyBSZXR1cm5zIGBwYXRoYCBmcm9tIGB0ZW1wbGF0ZWAgKyBgcGFyYW1zYFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZW1wbGF0ZSwgcGFyYW1zKSB7XG5cdGlmICgoLzooW15cXC9cXC4tXSspKFxcLnszfSk/Oi8pLnRlc3QodGVtcGxhdGUpKSB7XG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwiVGVtcGxhdGUgcGFyYW1ldGVyIG5hbWVzICptdXN0KiBiZSBzZXBhcmF0ZWRcIilcblx0fVxuXHRpZiAocGFyYW1zID09IG51bGwpIHJldHVybiB0ZW1wbGF0ZVxuXHR2YXIgcXVlcnlJbmRleCA9IHRlbXBsYXRlLmluZGV4T2YoXCI/XCIpXG5cdHZhciBoYXNoSW5kZXggPSB0ZW1wbGF0ZS5pbmRleE9mKFwiI1wiKVxuXHR2YXIgcXVlcnlFbmQgPSBoYXNoSW5kZXggPCAwID8gdGVtcGxhdGUubGVuZ3RoIDogaGFzaEluZGV4XG5cdHZhciBwYXRoRW5kID0gcXVlcnlJbmRleCA8IDAgPyBxdWVyeUVuZCA6IHF1ZXJ5SW5kZXhcblx0dmFyIHBhdGggPSB0ZW1wbGF0ZS5zbGljZSgwLCBwYXRoRW5kKVxuXHR2YXIgcXVlcnkgPSB7fVxuXG5cdGFzc2lnbihxdWVyeSwgcGFyYW1zKVxuXG5cdHZhciByZXNvbHZlZCA9IHBhdGgucmVwbGFjZSgvOihbXlxcL1xcLi1dKykoXFwuezN9KT8vZywgZnVuY3Rpb24obSwga2V5LCB2YXJpYWRpYykge1xuXHRcdGRlbGV0ZSBxdWVyeVtrZXldXG5cdFx0Ly8gSWYgbm8gc3VjaCBwYXJhbWV0ZXIgZXhpc3RzLCBkb24ndCBpbnRlcnBvbGF0ZSBpdC5cblx0XHRpZiAocGFyYW1zW2tleV0gPT0gbnVsbCkgcmV0dXJuIG1cblx0XHQvLyBFc2NhcGUgbm9ybWFsIHBhcmFtZXRlcnMsIGJ1dCBub3QgdmFyaWFkaWMgb25lcy5cblx0XHRyZXR1cm4gdmFyaWFkaWMgPyBwYXJhbXNba2V5XSA6IGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcocGFyYW1zW2tleV0pKVxuXHR9KVxuXG5cdC8vIEluIGNhc2UgdGhlIHRlbXBsYXRlIHN1YnN0aXR1dGlvbiBhZGRzIG5ldyBxdWVyeS9oYXNoIHBhcmFtZXRlcnMuXG5cdHZhciBuZXdRdWVyeUluZGV4ID0gcmVzb2x2ZWQuaW5kZXhPZihcIj9cIilcblx0dmFyIG5ld0hhc2hJbmRleCA9IHJlc29sdmVkLmluZGV4T2YoXCIjXCIpXG5cdHZhciBuZXdRdWVyeUVuZCA9IG5ld0hhc2hJbmRleCA8IDAgPyByZXNvbHZlZC5sZW5ndGggOiBuZXdIYXNoSW5kZXhcblx0dmFyIG5ld1BhdGhFbmQgPSBuZXdRdWVyeUluZGV4IDwgMCA/IG5ld1F1ZXJ5RW5kIDogbmV3UXVlcnlJbmRleFxuXHR2YXIgcmVzdWx0ID0gcmVzb2x2ZWQuc2xpY2UoMCwgbmV3UGF0aEVuZClcblxuXHRpZiAocXVlcnlJbmRleCA+PSAwKSByZXN1bHQgKz0gdGVtcGxhdGUuc2xpY2UocXVlcnlJbmRleCwgcXVlcnlFbmQpXG5cdGlmIChuZXdRdWVyeUluZGV4ID49IDApIHJlc3VsdCArPSAocXVlcnlJbmRleCA8IDAgPyBcIj9cIiA6IFwiJlwiKSArIHJlc29sdmVkLnNsaWNlKG5ld1F1ZXJ5SW5kZXgsIG5ld1F1ZXJ5RW5kKVxuXHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKHF1ZXJ5KVxuXHRpZiAocXVlcnlzdHJpbmcpIHJlc3VsdCArPSAocXVlcnlJbmRleCA8IDAgJiYgbmV3UXVlcnlJbmRleCA8IDAgPyBcIj9cIiA6IFwiJlwiKSArIHF1ZXJ5c3RyaW5nXG5cdGlmIChoYXNoSW5kZXggPj0gMCkgcmVzdWx0ICs9IHRlbXBsYXRlLnNsaWNlKGhhc2hJbmRleClcblx0aWYgKG5ld0hhc2hJbmRleCA+PSAwKSByZXN1bHQgKz0gKGhhc2hJbmRleCA8IDAgPyBcIlwiIDogXCImXCIpICsgcmVzb2x2ZWQuc2xpY2UobmV3SGFzaEluZGV4KVxuXHRyZXR1cm4gcmVzdWx0XG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgcGFyc2VQYXRobmFtZSA9IHJlcXVpcmUoXCIuL3BhcnNlXCIpXG5cbi8vIENvbXBpbGVzIGEgdGVtcGxhdGUgaW50byBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSByZXNvbHZlZCBwYXRoICh3aXRob3V0IHF1ZXJ5XG4vLyBzdHJpbmdzKSBhbmQgcmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgdGVtcGxhdGUgcGFyYW1ldGVycyB3aXRoIHRoZWlyXG4vLyBwYXJzZWQgdmFsdWVzLiBUaGlzIGV4cGVjdHMgdGhlIGlucHV0IG9mIHRoZSBjb21waWxlZCB0ZW1wbGF0ZSB0byBiZSB0aGVcbi8vIG91dHB1dCBvZiBgcGFyc2VQYXRobmFtZWAuIE5vdGUgdGhhdCBpdCBkb2VzICpub3QqIHJlbW92ZSBxdWVyeSBwYXJhbWV0ZXJzXG4vLyBzcGVjaWZpZWQgaW4gdGhlIHRlbXBsYXRlLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZW1wbGF0ZSkge1xuXHR2YXIgdGVtcGxhdGVEYXRhID0gcGFyc2VQYXRobmFtZSh0ZW1wbGF0ZSlcblx0dmFyIHRlbXBsYXRlS2V5cyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlRGF0YS5wYXJhbXMpXG5cdHZhciBrZXlzID0gW11cblx0dmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoXCJeXCIgKyB0ZW1wbGF0ZURhdGEucGF0aC5yZXBsYWNlKFxuXHRcdC8vIEkgZXNjYXBlIGxpdGVyYWwgdGV4dCBzbyBwZW9wbGUgY2FuIHVzZSB0aGluZ3MgbGlrZSBgOmZpbGUuOmV4dGAgb3Jcblx0XHQvLyBgOmxhbmctOmxvY2FsZWAgaW4gcm91dGVzLiBUaGlzIGlzIGFsbCBtZXJnZWQgaW50byBvbmUgcGFzcyBzbyBJXG5cdFx0Ly8gZG9uJ3QgYWxzbyBhY2NpZGVudGFsbHkgZXNjYXBlIGAtYCBhbmQgbWFrZSBpdCBoYXJkZXIgdG8gZGV0ZWN0IGl0IHRvXG5cdFx0Ly8gYmFuIGl0IGZyb20gdGVtcGxhdGUgcGFyYW1ldGVycy5cblx0XHQvOihbXlxcLy4tXSspKFxcLnszfXxcXC4oPyFcXC4pfC0pP3xbXFxcXF4kKisuKCl8XFxbXFxde31dL2csXG5cdFx0ZnVuY3Rpb24obSwga2V5LCBleHRyYSkge1xuXHRcdFx0aWYgKGtleSA9PSBudWxsKSByZXR1cm4gXCJcXFxcXCIgKyBtXG5cdFx0XHRrZXlzLnB1c2goe2s6IGtleSwgcjogZXh0cmEgPT09IFwiLi4uXCJ9KVxuXHRcdFx0aWYgKGV4dHJhID09PSBcIi4uLlwiKSByZXR1cm4gXCIoLiopXCJcblx0XHRcdGlmIChleHRyYSA9PT0gXCIuXCIpIHJldHVybiBcIihbXi9dKylcXFxcLlwiXG5cdFx0XHRyZXR1cm4gXCIoW14vXSspXCIgKyAoZXh0cmEgfHwgXCJcIilcblx0XHR9XG5cdCkgKyBcIiRcIilcblx0cmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHQvLyBGaXJzdCwgY2hlY2sgdGhlIHBhcmFtcy4gVXN1YWxseSwgdGhlcmUgaXNuJ3QgYW55LCBhbmQgaXQncyBqdXN0XG5cdFx0Ly8gY2hlY2tpbmcgYSBzdGF0aWMgc2V0LlxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcGxhdGVLZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAodGVtcGxhdGVEYXRhLnBhcmFtc1t0ZW1wbGF0ZUtleXNbaV1dICE9PSBkYXRhLnBhcmFtc1t0ZW1wbGF0ZUtleXNbaV1dKSByZXR1cm4gZmFsc2Vcblx0XHR9XG5cdFx0Ly8gSWYgbm8gaW50ZXJwb2xhdGlvbnMgZXhpc3QsIGxldCdzIHNraXAgYWxsIHRoZSBjZXJlbW9ueVxuXHRcdGlmICgha2V5cy5sZW5ndGgpIHJldHVybiByZWdleHAudGVzdChkYXRhLnBhdGgpXG5cdFx0dmFyIHZhbHVlcyA9IHJlZ2V4cC5leGVjKGRhdGEucGF0aClcblx0XHRpZiAodmFsdWVzID09IG51bGwpIHJldHVybiBmYWxzZVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZGF0YS5wYXJhbXNba2V5c1tpXS5rXSA9IGtleXNbaV0uciA/IHZhbHVlc1tpICsgMV0gOiBkZWNvZGVVUklDb21wb25lbnQodmFsdWVzW2kgKyAxXSlcblx0XHR9XG5cdFx0cmV0dXJuIHRydWVcblx0fVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIHBhcnNlUXVlcnlTdHJpbmcgPSByZXF1aXJlKFwiLi4vcXVlcnlzdHJpbmcvcGFyc2VcIilcblxuLy8gUmV0dXJucyBge3BhdGgsIHBhcmFtc31gIGZyb20gYHVybGBcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJsKSB7XG5cdHZhciBxdWVyeUluZGV4ID0gdXJsLmluZGV4T2YoXCI/XCIpXG5cdHZhciBoYXNoSW5kZXggPSB1cmwuaW5kZXhPZihcIiNcIilcblx0dmFyIHF1ZXJ5RW5kID0gaGFzaEluZGV4IDwgMCA/IHVybC5sZW5ndGggOiBoYXNoSW5kZXhcblx0dmFyIHBhdGhFbmQgPSBxdWVyeUluZGV4IDwgMCA/IHF1ZXJ5RW5kIDogcXVlcnlJbmRleFxuXHR2YXIgcGF0aCA9IHVybC5zbGljZSgwLCBwYXRoRW5kKS5yZXBsYWNlKC9cXC97Mix9L2csIFwiL1wiKVxuXG5cdGlmICghcGF0aCkgcGF0aCA9IFwiL1wiXG5cdGVsc2Uge1xuXHRcdGlmIChwYXRoWzBdICE9PSBcIi9cIikgcGF0aCA9IFwiL1wiICsgcGF0aFxuXHRcdGlmIChwYXRoLmxlbmd0aCA+IDEgJiYgcGF0aFtwYXRoLmxlbmd0aCAtIDFdID09PSBcIi9cIikgcGF0aCA9IHBhdGguc2xpY2UoMCwgLTEpXG5cdH1cblx0cmV0dXJuIHtcblx0XHRwYXRoOiBwYXRoLFxuXHRcdHBhcmFtczogcXVlcnlJbmRleCA8IDBcblx0XHRcdD8ge31cblx0XHRcdDogcGFyc2VRdWVyeVN0cmluZyh1cmwuc2xpY2UocXVlcnlJbmRleCArIDEsIHF1ZXJ5RW5kKSksXG5cdH1cbn1cbiIsIlwidXNlIHN0cmljdFwiXG4vKiogQGNvbnN0cnVjdG9yICovXG52YXIgUHJvbWlzZVBvbHlmaWxsID0gZnVuY3Rpb24oZXhlY3V0b3IpIHtcblx0aWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb21pc2VQb2x5ZmlsbCkpIHRocm93IG5ldyBFcnJvcihcIlByb21pc2UgbXVzdCBiZSBjYWxsZWQgd2l0aCBgbmV3YFwiKVxuXHRpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb25cIilcblxuXHR2YXIgc2VsZiA9IHRoaXMsIHJlc29sdmVycyA9IFtdLCByZWplY3RvcnMgPSBbXSwgcmVzb2x2ZUN1cnJlbnQgPSBoYW5kbGVyKHJlc29sdmVycywgdHJ1ZSksIHJlamVjdEN1cnJlbnQgPSBoYW5kbGVyKHJlamVjdG9ycywgZmFsc2UpXG5cdHZhciBpbnN0YW5jZSA9IHNlbGYuX2luc3RhbmNlID0ge3Jlc29sdmVyczogcmVzb2x2ZXJzLCByZWplY3RvcnM6IHJlamVjdG9yc31cblx0dmFyIGNhbGxBc3luYyA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHNldEltbWVkaWF0ZSA6IHNldFRpbWVvdXRcblx0ZnVuY3Rpb24gaGFuZGxlcihsaXN0LCBzaG91bGRBYnNvcmIpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gZXhlY3V0ZSh2YWx1ZSkge1xuXHRcdFx0dmFyIHRoZW5cblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChzaG91bGRBYnNvcmIgJiYgdmFsdWUgIT0gbnVsbCAmJiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSAmJiB0eXBlb2YgKHRoZW4gPSB2YWx1ZS50aGVuKSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0aWYgKHZhbHVlID09PSBzZWxmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCB3LyBpdHNlbGZcIilcblx0XHRcdFx0XHRleGVjdXRlT25jZSh0aGVuLmJpbmQodmFsdWUpKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGNhbGxBc3luYyhmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGlmICghc2hvdWxkQWJzb3JiICYmIGxpc3QubGVuZ3RoID09PSAwKSBjb25zb2xlLmVycm9yKFwiUG9zc2libGUgdW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uOlwiLCB2YWx1ZSlcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykgbGlzdFtpXSh2YWx1ZSlcblx0XHRcdFx0XHRcdHJlc29sdmVycy5sZW5ndGggPSAwLCByZWplY3RvcnMubGVuZ3RoID0gMFxuXHRcdFx0XHRcdFx0aW5zdGFuY2Uuc3RhdGUgPSBzaG91bGRBYnNvcmJcblx0XHRcdFx0XHRcdGluc3RhbmNlLnJldHJ5ID0gZnVuY3Rpb24oKSB7ZXhlY3V0ZSh2YWx1ZSl9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0cmVqZWN0Q3VycmVudChlKVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBleGVjdXRlT25jZSh0aGVuKSB7XG5cdFx0dmFyIHJ1bnMgPSAwXG5cdFx0ZnVuY3Rpb24gcnVuKGZuKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdFx0aWYgKHJ1bnMrKyA+IDApIHJldHVyblxuXHRcdFx0XHRmbih2YWx1ZSlcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIG9uZXJyb3IgPSBydW4ocmVqZWN0Q3VycmVudClcblx0XHR0cnkge3RoZW4ocnVuKHJlc29sdmVDdXJyZW50KSwgb25lcnJvcil9IGNhdGNoIChlKSB7b25lcnJvcihlKX1cblx0fVxuXG5cdGV4ZWN1dGVPbmNlKGV4ZWN1dG9yKVxufVxuUHJvbWlzZVBvbHlmaWxsLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0aW9uKSB7XG5cdHZhciBzZWxmID0gdGhpcywgaW5zdGFuY2UgPSBzZWxmLl9pbnN0YW5jZVxuXHRmdW5jdGlvbiBoYW5kbGUoY2FsbGJhY2ssIGxpc3QsIG5leHQsIHN0YXRlKSB7XG5cdFx0bGlzdC5wdXNoKGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIG5leHQodmFsdWUpXG5cdFx0XHRlbHNlIHRyeSB7cmVzb2x2ZU5leHQoY2FsbGJhY2sodmFsdWUpKX0gY2F0Y2ggKGUpIHtpZiAocmVqZWN0TmV4dCkgcmVqZWN0TmV4dChlKX1cblx0XHR9KVxuXHRcdGlmICh0eXBlb2YgaW5zdGFuY2UucmV0cnkgPT09IFwiZnVuY3Rpb25cIiAmJiBzdGF0ZSA9PT0gaW5zdGFuY2Uuc3RhdGUpIGluc3RhbmNlLnJldHJ5KClcblx0fVxuXHR2YXIgcmVzb2x2ZU5leHQsIHJlamVjdE5leHRcblx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge3Jlc29sdmVOZXh0ID0gcmVzb2x2ZSwgcmVqZWN0TmV4dCA9IHJlamVjdH0pXG5cdGhhbmRsZShvbkZ1bGZpbGxlZCwgaW5zdGFuY2UucmVzb2x2ZXJzLCByZXNvbHZlTmV4dCwgdHJ1ZSksIGhhbmRsZShvblJlamVjdGlvbiwgaW5zdGFuY2UucmVqZWN0b3JzLCByZWplY3ROZXh0LCBmYWxzZSlcblx0cmV0dXJuIHByb21pc2Vcbn1cblByb21pc2VQb2x5ZmlsbC5wcm90b3R5cGUuY2F0Y2ggPSBmdW5jdGlvbihvblJlamVjdGlvbikge1xuXHRyZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKVxufVxuUHJvbWlzZVBvbHlmaWxsLnByb3RvdHlwZS5maW5hbGx5ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0cmV0dXJuIHRoaXMudGhlbihcblx0XHRmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIFByb21pc2VQb2x5ZmlsbC5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiB2YWx1ZVxuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGZ1bmN0aW9uKHJlYXNvbikge1xuXHRcdFx0cmV0dXJuIFByb21pc2VQb2x5ZmlsbC5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlUG9seWZpbGwucmVqZWN0KHJlYXNvbik7XG5cdFx0XHR9KVxuXHRcdH1cblx0KVxufVxuUHJvbWlzZVBvbHlmaWxsLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAodmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlUG9seWZpbGwpIHJldHVybiB2YWx1ZVxuXHRyZXR1cm4gbmV3IFByb21pc2VQb2x5ZmlsbChmdW5jdGlvbihyZXNvbHZlKSB7cmVzb2x2ZSh2YWx1ZSl9KVxufVxuUHJvbWlzZVBvbHlmaWxsLnJlamVjdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZVBvbHlmaWxsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge3JlamVjdCh2YWx1ZSl9KVxufVxuUHJvbWlzZVBvbHlmaWxsLmFsbCA9IGZ1bmN0aW9uKGxpc3QpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0dmFyIHRvdGFsID0gbGlzdC5sZW5ndGgsIGNvdW50ID0gMCwgdmFsdWVzID0gW11cblx0XHRpZiAobGlzdC5sZW5ndGggPT09IDApIHJlc29sdmUoW10pXG5cdFx0ZWxzZSBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdChmdW5jdGlvbihpKSB7XG5cdFx0XHRcdGZ1bmN0aW9uIGNvbnN1bWUodmFsdWUpIHtcblx0XHRcdFx0XHRjb3VudCsrXG5cdFx0XHRcdFx0dmFsdWVzW2ldID0gdmFsdWVcblx0XHRcdFx0XHRpZiAoY291bnQgPT09IHRvdGFsKSByZXNvbHZlKHZhbHVlcylcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobGlzdFtpXSAhPSBudWxsICYmICh0eXBlb2YgbGlzdFtpXSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgbGlzdFtpXSA9PT0gXCJmdW5jdGlvblwiKSAmJiB0eXBlb2YgbGlzdFtpXS50aGVuID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRsaXN0W2ldLnRoZW4oY29uc3VtZSwgcmVqZWN0KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgY29uc3VtZShsaXN0W2ldKVxuXHRcdFx0fSkoaSlcblx0XHR9XG5cdH0pXG59XG5Qcm9taXNlUG9seWZpbGwucmFjZSA9IGZ1bmN0aW9uKGxpc3QpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlUG9seWZpbGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsaXN0W2ldLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KVxuXHRcdH1cblx0fSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlUG9seWZpbGxcbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBQcm9taXNlUG9seWZpbGwgPSByZXF1aXJlKFwiLi9wb2x5ZmlsbFwiKVxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRpZiAodHlwZW9mIHdpbmRvdy5Qcm9taXNlID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0d2luZG93LlByb21pc2UgPSBQcm9taXNlUG9seWZpbGxcblx0fSBlbHNlIGlmICghd2luZG93LlByb21pc2UucHJvdG90eXBlLmZpbmFsbHkpIHtcblx0XHR3aW5kb3cuUHJvbWlzZS5wcm90b3R5cGUuZmluYWxseSA9IFByb21pc2VQb2x5ZmlsbC5wcm90b3R5cGUuZmluYWxseVxuXHR9XG5cdG1vZHVsZS5leHBvcnRzID0gd2luZG93LlByb21pc2Vcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRpZiAodHlwZW9mIGdsb2JhbC5Qcm9taXNlID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0Z2xvYmFsLlByb21pc2UgPSBQcm9taXNlUG9seWZpbGxcblx0fSBlbHNlIGlmICghZ2xvYmFsLlByb21pc2UucHJvdG90eXBlLmZpbmFsbHkpIHtcblx0XHRnbG9iYWwuUHJvbWlzZS5wcm90b3R5cGUuZmluYWxseSA9IFByb21pc2VQb2x5ZmlsbC5wcm90b3R5cGUuZmluYWxseVxuXHR9XG5cdG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsLlByb21pc2Vcbn0gZWxzZSB7XG5cdG1vZHVsZS5leHBvcnRzID0gUHJvbWlzZVBvbHlmaWxsXG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXHRpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgIT09IFwiW29iamVjdCBPYmplY3RdXCIpIHJldHVybiBcIlwiXG5cblx0dmFyIGFyZ3MgPSBbXVxuXHRmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG5cdFx0ZGVzdHJ1Y3R1cmUoa2V5LCBvYmplY3Rba2V5XSlcblx0fVxuXG5cdHJldHVybiBhcmdzLmpvaW4oXCImXCIpXG5cblx0ZnVuY3Rpb24gZGVzdHJ1Y3R1cmUoa2V5LCB2YWx1ZSkge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRkZXN0cnVjdHVyZShrZXkgKyBcIltcIiArIGkgKyBcIl1cIiwgdmFsdWVbaV0pXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcblx0XHRcdGZvciAodmFyIGkgaW4gdmFsdWUpIHtcblx0XHRcdFx0ZGVzdHJ1Y3R1cmUoa2V5ICsgXCJbXCIgKyBpICsgXCJdXCIsIHZhbHVlW2ldKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGFyZ3MucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBcIlwiID8gXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpIDogXCJcIikpXG5cdH1cbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3RyaW5nKSB7XG5cdGlmIChzdHJpbmcgPT09IFwiXCIgfHwgc3RyaW5nID09IG51bGwpIHJldHVybiB7fVxuXHRpZiAoc3RyaW5nLmNoYXJBdCgwKSA9PT0gXCI/XCIpIHN0cmluZyA9IHN0cmluZy5zbGljZSgxKVxuXG5cdHZhciBlbnRyaWVzID0gc3RyaW5nLnNwbGl0KFwiJlwiKSwgY291bnRlcnMgPSB7fSwgZGF0YSA9IHt9XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBlbnRyeSA9IGVudHJpZXNbaV0uc3BsaXQoXCI9XCIpXG5cdFx0dmFyIGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChlbnRyeVswXSlcblx0XHR2YXIgdmFsdWUgPSBlbnRyeS5sZW5ndGggPT09IDIgPyBkZWNvZGVVUklDb21wb25lbnQoZW50cnlbMV0pIDogXCJcIlxuXG5cdFx0aWYgKHZhbHVlID09PSBcInRydWVcIikgdmFsdWUgPSB0cnVlXG5cdFx0ZWxzZSBpZiAodmFsdWUgPT09IFwiZmFsc2VcIikgdmFsdWUgPSBmYWxzZVxuXG5cdFx0dmFyIGxldmVscyA9IGtleS5zcGxpdCgvXFxdXFxbP3xcXFsvKVxuXHRcdHZhciBjdXJzb3IgPSBkYXRhXG5cdFx0aWYgKGtleS5pbmRleE9mKFwiW1wiKSA+IC0xKSBsZXZlbHMucG9wKClcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGxldmVscy5sZW5ndGg7IGorKykge1xuXHRcdFx0dmFyIGxldmVsID0gbGV2ZWxzW2pdLCBuZXh0TGV2ZWwgPSBsZXZlbHNbaiArIDFdXG5cdFx0XHR2YXIgaXNOdW1iZXIgPSBuZXh0TGV2ZWwgPT0gXCJcIiB8fCAhaXNOYU4ocGFyc2VJbnQobmV4dExldmVsLCAxMCkpXG5cdFx0XHRpZiAobGV2ZWwgPT09IFwiXCIpIHtcblx0XHRcdFx0dmFyIGtleSA9IGxldmVscy5zbGljZSgwLCBqKS5qb2luKClcblx0XHRcdFx0aWYgKGNvdW50ZXJzW2tleV0gPT0gbnVsbCkge1xuXHRcdFx0XHRcdGNvdW50ZXJzW2tleV0gPSBBcnJheS5pc0FycmF5KGN1cnNvcikgPyBjdXJzb3IubGVuZ3RoIDogMFxuXHRcdFx0XHR9XG5cdFx0XHRcdGxldmVsID0gY291bnRlcnNba2V5XSsrXG5cdFx0XHR9XG5cdFx0XHQvLyBEaXNhbGxvdyBkaXJlY3QgcHJvdG90eXBlIHBvbGx1dGlvblxuXHRcdFx0ZWxzZSBpZiAobGV2ZWwgPT09IFwiX19wcm90b19fXCIpIGJyZWFrXG5cdFx0XHRpZiAoaiA9PT0gbGV2ZWxzLmxlbmd0aCAtIDEpIGN1cnNvcltsZXZlbF0gPSB2YWx1ZVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIFJlYWQgb3duIHByb3BlcnRpZXMgZXhjbHVzaXZlbHkgdG8gZGlzYWxsb3cgaW5kaXJlY3Rcblx0XHRcdFx0Ly8gcHJvdG90eXBlIHBvbGx1dGlvblxuXHRcdFx0XHR2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY3Vyc29yLCBsZXZlbClcblx0XHRcdFx0aWYgKGRlc2MgIT0gbnVsbCkgZGVzYyA9IGRlc2MudmFsdWVcblx0XHRcdFx0aWYgKGRlc2MgPT0gbnVsbCkgY3Vyc29yW2xldmVsXSA9IGRlc2MgPSBpc051bWJlciA/IFtdIDoge31cblx0XHRcdFx0Y3Vyc29yID0gZGVzY1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gZGF0YVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9yZW5kZXIvcmVuZGVyXCIpKHdpbmRvdylcbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBWbm9kZSA9IHJlcXVpcmUoXCIuLi9yZW5kZXIvdm5vZGVcIilcbnZhciBoeXBlcnNjcmlwdFZub2RlID0gcmVxdWlyZShcIi4vaHlwZXJzY3JpcHRWbm9kZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdm5vZGUgPSBoeXBlcnNjcmlwdFZub2RlLmFwcGx5KDAsIGFyZ3VtZW50cylcblxuXHR2bm9kZS50YWcgPSBcIltcIlxuXHR2bm9kZS5jaGlsZHJlbiA9IFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKHZub2RlLmNoaWxkcmVuKVxuXHRyZXR1cm4gdm5vZGVcbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBWbm9kZSA9IHJlcXVpcmUoXCIuLi9yZW5kZXIvdm5vZGVcIilcbnZhciBoeXBlcnNjcmlwdFZub2RlID0gcmVxdWlyZShcIi4vaHlwZXJzY3JpcHRWbm9kZVwiKVxuXG52YXIgc2VsZWN0b3JQYXJzZXIgPSAvKD86KF58I3xcXC4pKFteI1xcLlxcW1xcXV0rKSl8KFxcWyguKz8pKD86XFxzKj1cXHMqKFwifCd8KSgoPzpcXFxcW1wiJ1xcXV18LikqPylcXDUpP1xcXSkvZ1xudmFyIHNlbGVjdG9yQ2FjaGUgPSB7fVxudmFyIGhhc093biA9IHt9Lmhhc093blByb3BlcnR5XG5cbmZ1bmN0aW9uIGlzRW1wdHkob2JqZWN0KSB7XG5cdGZvciAodmFyIGtleSBpbiBvYmplY3QpIGlmIChoYXNPd24uY2FsbChvYmplY3QsIGtleSkpIHJldHVybiBmYWxzZVxuXHRyZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBjb21waWxlU2VsZWN0b3Ioc2VsZWN0b3IpIHtcblx0dmFyIG1hdGNoLCB0YWcgPSBcImRpdlwiLCBjbGFzc2VzID0gW10sIGF0dHJzID0ge31cblx0d2hpbGUgKG1hdGNoID0gc2VsZWN0b3JQYXJzZXIuZXhlYyhzZWxlY3RvcikpIHtcblx0XHR2YXIgdHlwZSA9IG1hdGNoWzFdLCB2YWx1ZSA9IG1hdGNoWzJdXG5cdFx0aWYgKHR5cGUgPT09IFwiXCIgJiYgdmFsdWUgIT09IFwiXCIpIHRhZyA9IHZhbHVlXG5cdFx0ZWxzZSBpZiAodHlwZSA9PT0gXCIjXCIpIGF0dHJzLmlkID0gdmFsdWVcblx0XHRlbHNlIGlmICh0eXBlID09PSBcIi5cIikgY2xhc3Nlcy5wdXNoKHZhbHVlKVxuXHRcdGVsc2UgaWYgKG1hdGNoWzNdWzBdID09PSBcIltcIikge1xuXHRcdFx0dmFyIGF0dHJWYWx1ZSA9IG1hdGNoWzZdXG5cdFx0XHRpZiAoYXR0clZhbHVlKSBhdHRyVmFsdWUgPSBhdHRyVmFsdWUucmVwbGFjZSgvXFxcXChbXCInXSkvZywgXCIkMVwiKS5yZXBsYWNlKC9cXFxcXFxcXC9nLCBcIlxcXFxcIilcblx0XHRcdGlmIChtYXRjaFs0XSA9PT0gXCJjbGFzc1wiKSBjbGFzc2VzLnB1c2goYXR0clZhbHVlKVxuXHRcdFx0ZWxzZSBhdHRyc1ttYXRjaFs0XV0gPSBhdHRyVmFsdWUgPT09IFwiXCIgPyBhdHRyVmFsdWUgOiBhdHRyVmFsdWUgfHwgdHJ1ZVxuXHRcdH1cblx0fVxuXHRpZiAoY2xhc3Nlcy5sZW5ndGggPiAwKSBhdHRycy5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oXCIgXCIpXG5cdHJldHVybiBzZWxlY3RvckNhY2hlW3NlbGVjdG9yXSA9IHt0YWc6IHRhZywgYXR0cnM6IGF0dHJzfVxufVxuXG5mdW5jdGlvbiBleGVjU2VsZWN0b3Ioc3RhdGUsIHZub2RlKSB7XG5cdHZhciBhdHRycyA9IHZub2RlLmF0dHJzXG5cdHZhciBjaGlsZHJlbiA9IFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKHZub2RlLmNoaWxkcmVuKVxuXHR2YXIgaGFzQ2xhc3MgPSBoYXNPd24uY2FsbChhdHRycywgXCJjbGFzc1wiKVxuXHR2YXIgY2xhc3NOYW1lID0gaGFzQ2xhc3MgPyBhdHRycy5jbGFzcyA6IGF0dHJzLmNsYXNzTmFtZVxuXG5cdHZub2RlLnRhZyA9IHN0YXRlLnRhZ1xuXHR2bm9kZS5hdHRycyA9IG51bGxcblx0dm5vZGUuY2hpbGRyZW4gPSB1bmRlZmluZWRcblxuXHRpZiAoIWlzRW1wdHkoc3RhdGUuYXR0cnMpICYmICFpc0VtcHR5KGF0dHJzKSkge1xuXHRcdHZhciBuZXdBdHRycyA9IHt9XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcblx0XHRcdGlmIChoYXNPd24uY2FsbChhdHRycywga2V5KSkgbmV3QXR0cnNba2V5XSA9IGF0dHJzW2tleV1cblx0XHR9XG5cblx0XHRhdHRycyA9IG5ld0F0dHJzXG5cdH1cblxuXHRmb3IgKHZhciBrZXkgaW4gc3RhdGUuYXR0cnMpIHtcblx0XHRpZiAoaGFzT3duLmNhbGwoc3RhdGUuYXR0cnMsIGtleSkgJiYga2V5ICE9PSBcImNsYXNzTmFtZVwiICYmICFoYXNPd24uY2FsbChhdHRycywga2V5KSl7XG5cdFx0XHRhdHRyc1trZXldID0gc3RhdGUuYXR0cnNba2V5XVxuXHRcdH1cblx0fVxuXHRpZiAoY2xhc3NOYW1lICE9IG51bGwgfHwgc3RhdGUuYXR0cnMuY2xhc3NOYW1lICE9IG51bGwpIGF0dHJzLmNsYXNzTmFtZSA9XG5cdFx0Y2xhc3NOYW1lICE9IG51bGxcblx0XHRcdD8gc3RhdGUuYXR0cnMuY2xhc3NOYW1lICE9IG51bGxcblx0XHRcdFx0PyBTdHJpbmcoc3RhdGUuYXR0cnMuY2xhc3NOYW1lKSArIFwiIFwiICsgU3RyaW5nKGNsYXNzTmFtZSlcblx0XHRcdFx0OiBjbGFzc05hbWVcblx0XHRcdDogc3RhdGUuYXR0cnMuY2xhc3NOYW1lICE9IG51bGxcblx0XHRcdFx0PyBzdGF0ZS5hdHRycy5jbGFzc05hbWVcblx0XHRcdFx0OiBudWxsXG5cblx0aWYgKGhhc0NsYXNzKSBhdHRycy5jbGFzcyA9IG51bGxcblxuXHRmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcblx0XHRpZiAoaGFzT3duLmNhbGwoYXR0cnMsIGtleSkgJiYga2V5ICE9PSBcImtleVwiKSB7XG5cdFx0XHR2bm9kZS5hdHRycyA9IGF0dHJzXG5cdFx0XHRicmVha1xuXHRcdH1cblx0fVxuXG5cdGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSAmJiBjaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgY2hpbGRyZW5bMF0gIT0gbnVsbCAmJiBjaGlsZHJlblswXS50YWcgPT09IFwiI1wiKSB7XG5cdFx0dm5vZGUudGV4dCA9IGNoaWxkcmVuWzBdLmNoaWxkcmVuXG5cdH0gZWxzZSB7XG5cdFx0dm5vZGUuY2hpbGRyZW4gPSBjaGlsZHJlblxuXHR9XG5cblx0cmV0dXJuIHZub2RlXG59XG5cbmZ1bmN0aW9uIGh5cGVyc2NyaXB0KHNlbGVjdG9yKSB7XG5cdGlmIChzZWxlY3RvciA9PSBudWxsIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2Ygc2VsZWN0b3IgIT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygc2VsZWN0b3IudmlldyAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0dGhyb3cgRXJyb3IoXCJUaGUgc2VsZWN0b3IgbXVzdCBiZSBlaXRoZXIgYSBzdHJpbmcgb3IgYSBjb21wb25lbnQuXCIpO1xuXHR9XG5cblx0dmFyIHZub2RlID0gaHlwZXJzY3JpcHRWbm9kZS5hcHBseSgxLCBhcmd1bWVudHMpXG5cblx0aWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHZub2RlLmNoaWxkcmVuID0gVm5vZGUubm9ybWFsaXplQ2hpbGRyZW4odm5vZGUuY2hpbGRyZW4pXG5cdFx0aWYgKHNlbGVjdG9yICE9PSBcIltcIikgcmV0dXJuIGV4ZWNTZWxlY3RvcihzZWxlY3RvckNhY2hlW3NlbGVjdG9yXSB8fCBjb21waWxlU2VsZWN0b3Ioc2VsZWN0b3IpLCB2bm9kZSlcblx0fVxuXG5cdHZub2RlLnRhZyA9IHNlbGVjdG9yXG5cdHJldHVybiB2bm9kZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGh5cGVyc2NyaXB0XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgVm5vZGUgPSByZXF1aXJlKFwiLi4vcmVuZGVyL3Zub2RlXCIpXG5cbi8vIENhbGwgdmlhIGBoeXBlcnNjcmlwdFZub2RlLmFwcGx5KHN0YXJ0T2Zmc2V0LCBhcmd1bWVudHMpYFxuLy9cbi8vIFRoZSByZWFzb24gSSBkbyBpdCB0aGlzIHdheSwgZm9yd2FyZGluZyB0aGUgYXJndW1lbnRzIGFuZCBwYXNzaW5nIHRoZSBzdGFydFxuLy8gb2Zmc2V0IGluIGB0aGlzYCwgaXMgc28gSSBkb24ndCBoYXZlIHRvIGNyZWF0ZSBhIHRlbXBvcmFyeSBhcnJheSBpbiBhXG4vLyBwZXJmb3JtYW5jZS1jcml0aWNhbCBwYXRoLlxuLy9cbi8vIEluIG5hdGl2ZSBFUzYsIEknZCBpbnN0ZWFkIGFkZCBhIGZpbmFsIGAuLi5hcmdzYCBwYXJhbWV0ZXIgdG8gdGhlXG4vLyBgaHlwZXJzY3JpcHRgIGFuZCBgZnJhZ21lbnRgIGZhY3RvcmllcyBhbmQgZGVmaW5lIHRoaXMgYXNcbi8vIGBoeXBlcnNjcmlwdFZub2RlKC4uLmFyZ3MpYCwgc2luY2UgbW9kZXJuIGVuZ2luZXMgZG8gb3B0aW1pemUgdGhhdCBhd2F5LiBCdXRcbi8vIEVTNSAod2hhdCBNaXRocmlsIHJlcXVpcmVzIHRoYW5rcyB0byBJRSBzdXBwb3J0KSBkb2Vzbid0IGdpdmUgbWUgdGhhdCBsdXh1cnksXG4vLyBhbmQgZW5naW5lcyBhcmVuJ3QgbmVhcmx5IGludGVsbGlnZW50IGVub3VnaCB0byBkbyBlaXRoZXIgb2YgdGhlc2U6XG4vL1xuLy8gMS4gRWxpZGUgdGhlIGFsbG9jYXRpb24gZm9yIGBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlgIHdoZW4gaXQncyBwYXNzZWQgdG9cbi8vICAgIGFub3RoZXIgZnVuY3Rpb24gb25seSB0byBiZSBpbmRleGVkLlxuLy8gMi4gRWxpZGUgYW4gYGFyZ3VtZW50c2AgYWxsb2NhdGlvbiB3aGVuIGl0J3MgcGFzc2VkIHRvIGFueSBmdW5jdGlvbiBvdGhlclxuLy8gICAgdGhhbiBgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5YCBvciBgUmVmbGVjdC5hcHBseWAuXG4vL1xuLy8gSW4gRVM2LCBpdCdkIHByb2JhYmx5IGxvb2sgY2xvc2VyIHRvIHRoaXMgKEknZCBuZWVkIHRvIHByb2ZpbGUgaXQsIHRob3VnaCk6XG4vLyBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGF0dHJzLCAuLi5jaGlsZHJlbikge1xuLy8gICAgIGlmIChhdHRycyA9PSBudWxsIHx8IHR5cGVvZiBhdHRycyA9PT0gXCJvYmplY3RcIiAmJiBhdHRycy50YWcgPT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheShhdHRycykpIHtcbi8vICAgICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiBBcnJheS5pc0FycmF5KGNoaWxkcmVuWzBdKSkgY2hpbGRyZW4gPSBjaGlsZHJlblswXVxuLy8gICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIGNoaWxkcmVuID0gY2hpbGRyZW4ubGVuZ3RoID09PSAwICYmIEFycmF5LmlzQXJyYXkoYXR0cnMpID8gYXR0cnMgOiBbYXR0cnMsIC4uLmNoaWxkcmVuXVxuLy8gICAgICAgICBhdHRycyA9IHVuZGVmaW5lZFxuLy8gICAgIH1cbi8vXG4vLyAgICAgaWYgKGF0dHJzID09IG51bGwpIGF0dHJzID0ge31cbi8vICAgICByZXR1cm4gVm5vZGUoXCJcIiwgYXR0cnMua2V5LCBhdHRycywgY2hpbGRyZW4pXG4vLyB9XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgYXR0cnMgPSBhcmd1bWVudHNbdGhpc10sIHN0YXJ0ID0gdGhpcyArIDEsIGNoaWxkcmVuXG5cblx0aWYgKGF0dHJzID09IG51bGwpIHtcblx0XHRhdHRycyA9IHt9XG5cdH0gZWxzZSBpZiAodHlwZW9mIGF0dHJzICE9PSBcIm9iamVjdFwiIHx8IGF0dHJzLnRhZyAhPSBudWxsIHx8IEFycmF5LmlzQXJyYXkoYXR0cnMpKSB7XG5cdFx0YXR0cnMgPSB7fVxuXHRcdHN0YXJ0ID0gdGhpc1xuXHR9XG5cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IHN0YXJ0ICsgMSkge1xuXHRcdGNoaWxkcmVuID0gYXJndW1lbnRzW3N0YXJ0XVxuXHRcdGlmICghQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIGNoaWxkcmVuID0gW2NoaWxkcmVuXVxuXHR9IGVsc2Uge1xuXHRcdGNoaWxkcmVuID0gW11cblx0XHR3aGlsZSAoc3RhcnQgPCBhcmd1bWVudHMubGVuZ3RoKSBjaGlsZHJlbi5wdXNoKGFyZ3VtZW50c1tzdGFydCsrXSlcblx0fVxuXG5cdHJldHVybiBWbm9kZShcIlwiLCBhdHRycy5rZXksIGF0dHJzLCBjaGlsZHJlbilcbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBWbm9kZSA9IHJlcXVpcmUoXCIuLi9yZW5kZXIvdm5vZGVcIilcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkd2luZG93KSB7XG5cdHZhciAkZG9jID0gJHdpbmRvdyAmJiAkd2luZG93LmRvY3VtZW50XG5cdHZhciBjdXJyZW50UmVkcmF3XG5cblx0dmFyIG5hbWVTcGFjZSA9IHtcblx0XHRzdmc6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcblx0XHRtYXRoOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUxcIlxuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0TmFtZVNwYWNlKHZub2RlKSB7XG5cdFx0cmV0dXJuIHZub2RlLmF0dHJzICYmIHZub2RlLmF0dHJzLnhtbG5zIHx8IG5hbWVTcGFjZVt2bm9kZS50YWddXG5cdH1cblxuXHQvL3Nhbml0eSBjaGVjayB0byBkaXNjb3VyYWdlIHBlb3BsZSBmcm9tIGRvaW5nIGB2bm9kZS5zdGF0ZSA9IC4uLmBcblx0ZnVuY3Rpb24gY2hlY2tTdGF0ZSh2bm9kZSwgb3JpZ2luYWwpIHtcblx0XHRpZiAodm5vZGUuc3RhdGUgIT09IG9yaWdpbmFsKSB0aHJvdyBuZXcgRXJyb3IoXCJgdm5vZGUuc3RhdGVgIG11c3Qgbm90IGJlIG1vZGlmaWVkXCIpXG5cdH1cblxuXHQvL05vdGU6IHRoZSBob29rIGlzIHBhc3NlZCBhcyB0aGUgYHRoaXNgIGFyZ3VtZW50IHRvIGFsbG93IHByb3h5aW5nIHRoZVxuXHQvL2FyZ3VtZW50cyB3aXRob3V0IHJlcXVpcmluZyBhIGZ1bGwgYXJyYXkgYWxsb2NhdGlvbiB0byBkbyBzby4gSXQgYWxzb1xuXHQvL3Rha2VzIGFkdmFudGFnZSBvZiB0aGUgZmFjdCB0aGUgY3VycmVudCBgdm5vZGVgIGlzIHRoZSBmaXJzdCBhcmd1bWVudCBpblxuXHQvL2FsbCBsaWZlY3ljbGUgbWV0aG9kcy5cblx0ZnVuY3Rpb24gY2FsbEhvb2sodm5vZGUpIHtcblx0XHR2YXIgb3JpZ2luYWwgPSB2bm9kZS5zdGF0ZVxuXHRcdHRyeSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hcHBseShvcmlnaW5hbCwgYXJndW1lbnRzKVxuXHRcdH0gZmluYWxseSB7XG5cdFx0XHRjaGVja1N0YXRlKHZub2RlLCBvcmlnaW5hbClcblx0XHR9XG5cdH1cblxuXHQvLyBJRTExIChhdCBsZWFzdCkgdGhyb3dzIGFuIFVuc3BlY2lmaWVkRXJyb3Igd2hlbiBhY2Nlc3NpbmcgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCB3aGVuXG5cdC8vIGluc2lkZSBhbiBpZnJhbWUuIENhdGNoIGFuZCBzd2FsbG93IHRoaXMgZXJyb3IsIGFuZCBoZWF2eS1oYW5kaWRseSByZXR1cm4gbnVsbC5cblx0ZnVuY3Rpb24gYWN0aXZlRWxlbWVudCgpIHtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuICRkb2MuYWN0aXZlRWxlbWVudFxuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdHJldHVybiBudWxsXG5cdFx0fVxuXHR9XG5cdC8vY3JlYXRlXG5cdGZ1bmN0aW9uIGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCBzdGFydCwgZW5kLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKSB7XG5cdFx0Zm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcblx0XHRcdHZhciB2bm9kZSA9IHZub2Rlc1tpXVxuXHRcdFx0aWYgKHZub2RlICE9IG51bGwpIHtcblx0XHRcdFx0Y3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgdGFnID0gdm5vZGUudGFnXG5cdFx0aWYgKHR5cGVvZiB0YWcgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHZub2RlLnN0YXRlID0ge31cblx0XHRcdGlmICh2bm9kZS5hdHRycyAhPSBudWxsKSBpbml0TGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0XHRzd2l0Y2ggKHRhZykge1xuXHRcdFx0XHRjYXNlIFwiI1wiOiBjcmVhdGVUZXh0KHBhcmVudCwgdm5vZGUsIG5leHRTaWJsaW5nKTsgYnJlYWtcblx0XHRcdFx0Y2FzZSBcIjxcIjogY3JlYXRlSFRNTChwYXJlbnQsIHZub2RlLCBucywgbmV4dFNpYmxpbmcpOyBicmVha1xuXHRcdFx0XHRjYXNlIFwiW1wiOiBjcmVhdGVGcmFnbWVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKTsgYnJlYWtcblx0XHRcdFx0ZGVmYXVsdDogY3JlYXRlRWxlbWVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIGNyZWF0ZUNvbXBvbmVudChwYXJlbnQsIHZub2RlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHR9XG5cdGZ1bmN0aW9uIGNyZWF0ZVRleHQocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpIHtcblx0XHR2bm9kZS5kb20gPSAkZG9jLmNyZWF0ZVRleHROb2RlKHZub2RlLmNoaWxkcmVuKVxuXHRcdGluc2VydE5vZGUocGFyZW50LCB2bm9kZS5kb20sIG5leHRTaWJsaW5nKVxuXHR9XG5cdHZhciBwb3NzaWJsZVBhcmVudHMgPSB7Y2FwdGlvbjogXCJ0YWJsZVwiLCB0aGVhZDogXCJ0YWJsZVwiLCB0Ym9keTogXCJ0YWJsZVwiLCB0Zm9vdDogXCJ0YWJsZVwiLCB0cjogXCJ0Ym9keVwiLCB0aDogXCJ0clwiLCB0ZDogXCJ0clwiLCBjb2xncm91cDogXCJ0YWJsZVwiLCBjb2w6IFwiY29sZ3JvdXBcIn1cblx0ZnVuY3Rpb24gY3JlYXRlSFRNTChwYXJlbnQsIHZub2RlLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgbWF0Y2ggPSB2bm9kZS5jaGlsZHJlbi5tYXRjaCgvXlxccyo/PChcXHcrKS9pbSkgfHwgW11cblx0XHQvLyBub3QgdXNpbmcgdGhlIHByb3BlciBwYXJlbnQgbWFrZXMgdGhlIGNoaWxkIGVsZW1lbnQocykgdmFuaXNoLlxuXHRcdC8vICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuXHRcdC8vICAgICBkaXYuaW5uZXJIVE1MID0gXCI8dGQ+aTwvdGQ+PHRkPmo8L3RkPlwiXG5cdFx0Ly8gICAgIGNvbnNvbGUubG9nKGRpdi5pbm5lckhUTUwpXG5cdFx0Ly8gLS0+IFwiaWpcIiwgbm8gPHRkPiBpbiBzaWdodC5cblx0XHR2YXIgdGVtcCA9ICRkb2MuY3JlYXRlRWxlbWVudChwb3NzaWJsZVBhcmVudHNbbWF0Y2hbMV1dIHx8IFwiZGl2XCIpXG5cdFx0aWYgKG5zID09PSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIpIHtcblx0XHRcdHRlbXAuaW5uZXJIVE1MID0gXCI8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCI+XCIgKyB2bm9kZS5jaGlsZHJlbiArIFwiPC9zdmc+XCJcblx0XHRcdHRlbXAgPSB0ZW1wLmZpcnN0Q2hpbGRcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGVtcC5pbm5lckhUTUwgPSB2bm9kZS5jaGlsZHJlblxuXHRcdH1cblx0XHR2bm9kZS5kb20gPSB0ZW1wLmZpcnN0Q2hpbGRcblx0XHR2bm9kZS5kb21TaXplID0gdGVtcC5jaGlsZE5vZGVzLmxlbmd0aFxuXHRcdC8vIENhcHR1cmUgbm9kZXMgdG8gcmVtb3ZlLCBzbyB3ZSBkb24ndCBjb25mdXNlIHRoZW0uXG5cdFx0dm5vZGUuaW5zdGFuY2UgPSBbXVxuXHRcdHZhciBmcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0dmFyIGNoaWxkXG5cdFx0d2hpbGUgKGNoaWxkID0gdGVtcC5maXJzdENoaWxkKSB7XG5cdFx0XHR2bm9kZS5pbnN0YW5jZS5wdXNoKGNoaWxkKVxuXHRcdFx0ZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpXG5cdFx0fVxuXHRcdGluc2VydE5vZGUocGFyZW50LCBmcmFnbWVudCwgbmV4dFNpYmxpbmcpXG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnQocGFyZW50LCB2bm9kZSwgaG9va3MsIG5zLCBuZXh0U2libGluZykge1xuXHRcdHZhciBmcmFnbWVudCA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0aWYgKHZub2RlLmNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdHZhciBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0XHRjcmVhdGVOb2RlcyhmcmFnbWVudCwgY2hpbGRyZW4sIDAsIGNoaWxkcmVuLmxlbmd0aCwgaG9va3MsIG51bGwsIG5zKVxuXHRcdH1cblx0XHR2bm9kZS5kb20gPSBmcmFnbWVudC5maXJzdENoaWxkXG5cdFx0dm5vZGUuZG9tU2l6ZSA9IGZyYWdtZW50LmNoaWxkTm9kZXMubGVuZ3RoXG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGZyYWdtZW50LCBuZXh0U2libGluZylcblx0fVxuXHRmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgdGFnID0gdm5vZGUudGFnXG5cdFx0dmFyIGF0dHJzID0gdm5vZGUuYXR0cnNcblx0XHR2YXIgaXMgPSBhdHRycyAmJiBhdHRycy5pc1xuXG5cdFx0bnMgPSBnZXROYW1lU3BhY2Uodm5vZGUpIHx8IG5zXG5cblx0XHR2YXIgZWxlbWVudCA9IG5zID9cblx0XHRcdGlzID8gJGRvYy5jcmVhdGVFbGVtZW50TlMobnMsIHRhZywge2lzOiBpc30pIDogJGRvYy5jcmVhdGVFbGVtZW50TlMobnMsIHRhZykgOlxuXHRcdFx0aXMgPyAkZG9jLmNyZWF0ZUVsZW1lbnQodGFnLCB7aXM6IGlzfSkgOiAkZG9jLmNyZWF0ZUVsZW1lbnQodGFnKVxuXHRcdHZub2RlLmRvbSA9IGVsZW1lbnRcblxuXHRcdGlmIChhdHRycyAhPSBudWxsKSB7XG5cdFx0XHRzZXRBdHRycyh2bm9kZSwgYXR0cnMsIG5zKVxuXHRcdH1cblxuXHRcdGluc2VydE5vZGUocGFyZW50LCBlbGVtZW50LCBuZXh0U2libGluZylcblxuXHRcdGlmICghbWF5YmVTZXRDb250ZW50RWRpdGFibGUodm5vZGUpKSB7XG5cdFx0XHRpZiAodm5vZGUudGV4dCAhPSBudWxsKSB7XG5cdFx0XHRcdGlmICh2bm9kZS50ZXh0ICE9PSBcIlwiKSBlbGVtZW50LnRleHRDb250ZW50ID0gdm5vZGUudGV4dFxuXHRcdFx0XHRlbHNlIHZub2RlLmNoaWxkcmVuID0gW1Zub2RlKFwiI1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdm5vZGUudGV4dCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpXVxuXHRcdFx0fVxuXHRcdFx0aWYgKHZub2RlLmNoaWxkcmVuICE9IG51bGwpIHtcblx0XHRcdFx0dmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHRcdFx0Y3JlYXRlTm9kZXMoZWxlbWVudCwgY2hpbGRyZW4sIDAsIGNoaWxkcmVuLmxlbmd0aCwgaG9va3MsIG51bGwsIG5zKVxuXHRcdFx0XHRpZiAodm5vZGUudGFnID09PSBcInNlbGVjdFwiICYmIGF0dHJzICE9IG51bGwpIHNldExhdGVTZWxlY3RBdHRycyh2bm9kZSwgYXR0cnMpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGluaXRDb21wb25lbnQodm5vZGUsIGhvb2tzKSB7XG5cdFx0dmFyIHNlbnRpbmVsXG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcudmlldyA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHR2bm9kZS5zdGF0ZSA9IE9iamVjdC5jcmVhdGUodm5vZGUudGFnKVxuXHRcdFx0c2VudGluZWwgPSB2bm9kZS5zdGF0ZS52aWV3XG5cdFx0XHRpZiAoc2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgIT0gbnVsbCkgcmV0dXJuXG5cdFx0XHRzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCA9IHRydWVcblx0XHR9IGVsc2Uge1xuXHRcdFx0dm5vZGUuc3RhdGUgPSB2b2lkIDBcblx0XHRcdHNlbnRpbmVsID0gdm5vZGUudGFnXG5cdFx0XHRpZiAoc2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgIT0gbnVsbCkgcmV0dXJuXG5cdFx0XHRzZW50aW5lbC4kJHJlZW50cmFudExvY2skJCA9IHRydWVcblx0XHRcdHZub2RlLnN0YXRlID0gKHZub2RlLnRhZy5wcm90b3R5cGUgIT0gbnVsbCAmJiB0eXBlb2Ygdm5vZGUudGFnLnByb3RvdHlwZS52aWV3ID09PSBcImZ1bmN0aW9uXCIpID8gbmV3IHZub2RlLnRhZyh2bm9kZSkgOiB2bm9kZS50YWcodm5vZGUpXG5cdFx0fVxuXHRcdGluaXRMaWZlY3ljbGUodm5vZGUuc3RhdGUsIHZub2RlLCBob29rcylcblx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCkgaW5pdExpZmVjeWNsZSh2bm9kZS5hdHRycywgdm5vZGUsIGhvb2tzKVxuXHRcdHZub2RlLmluc3RhbmNlID0gVm5vZGUubm9ybWFsaXplKGNhbGxIb29rLmNhbGwodm5vZGUuc3RhdGUudmlldywgdm5vZGUpKVxuXHRcdGlmICh2bm9kZS5pbnN0YW5jZSA9PT0gdm5vZGUpIHRocm93IEVycm9yKFwiQSB2aWV3IGNhbm5vdCByZXR1cm4gdGhlIHZub2RlIGl0IHJlY2VpdmVkIGFzIGFyZ3VtZW50XCIpXG5cdFx0c2VudGluZWwuJCRyZWVudHJhbnRMb2NrJCQgPSBudWxsXG5cdH1cblx0ZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50KHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpIHtcblx0XHRpbml0Q29tcG9uZW50KHZub2RlLCBob29rcylcblx0XHRpZiAodm5vZGUuaW5zdGFuY2UgIT0gbnVsbCkge1xuXHRcdFx0Y3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLmluc3RhbmNlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0dm5vZGUuZG9tID0gdm5vZGUuaW5zdGFuY2UuZG9tXG5cdFx0XHR2bm9kZS5kb21TaXplID0gdm5vZGUuZG9tICE9IG51bGwgPyB2bm9kZS5pbnN0YW5jZS5kb21TaXplIDogMFxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHZub2RlLmRvbVNpemUgPSAwXG5cdFx0fVxuXHR9XG5cblx0Ly91cGRhdGVcblx0LyoqXG5cdCAqIEBwYXJhbSB7RWxlbWVudHxGcmFnbWVudH0gcGFyZW50IC0gdGhlIHBhcmVudCBlbGVtZW50XG5cdCAqIEBwYXJhbSB7Vm5vZGVbXSB8IG51bGx9IG9sZCAtIHRoZSBsaXN0IG9mIHZub2RlcyBvZiB0aGUgbGFzdCBgcmVuZGVyKClgIGNhbGwgZm9yXG5cdCAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgcGFydCBvZiB0aGUgdHJlZVxuXHQgKiBAcGFyYW0ge1Zub2RlW10gfCBudWxsfSB2bm9kZXMgLSBhcyBhYm92ZSwgYnV0IGZvciB0aGUgY3VycmVudCBgcmVuZGVyKClgIGNhbGwuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gaG9va3MgLSBhbiBhY2N1bXVsYXRvciBvZiBwb3N0LXJlbmRlciBob29rcyAob25jcmVhdGUvb251cGRhdGUpXG5cdCAqIEBwYXJhbSB7RWxlbWVudCB8IG51bGx9IG5leHRTaWJsaW5nIC0gdGhlIG5leHQgRE9NIG5vZGUgaWYgd2UncmUgZGVhbGluZyB3aXRoIGFcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFnbWVudCB0aGF0IGlzIG5vdCB0aGUgbGFzdCBpdGVtIGluIGl0c1xuXHQgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFxuXHQgKiBAcGFyYW0geydzdmcnIHwgJ21hdGgnIHwgU3RyaW5nIHwgbnVsbH0gbnMpIC0gdGhlIGN1cnJlbnQgWE1MIG5hbWVzcGFjZSwgaWYgYW55XG5cdCAqIEByZXR1cm5zIHZvaWRcblx0ICovXG5cdC8vIFRoaXMgZnVuY3Rpb24gZGlmZnMgYW5kIHBhdGNoZXMgbGlzdHMgb2Ygdm5vZGVzLCBib3RoIGtleWVkIGFuZCB1bmtleWVkLlxuXHQvL1xuXHQvLyBXZSB3aWxsOlxuXHQvL1xuXHQvLyAxLiBkZXNjcmliZSBpdHMgZ2VuZXJhbCBzdHJ1Y3R1cmVcblx0Ly8gMi4gZm9jdXMgb24gdGhlIGRpZmYgYWxnb3JpdGhtIG9wdGltaXphdGlvbnNcblx0Ly8gMy4gZGlzY3VzcyBET00gbm9kZSBvcGVyYXRpb25zLlxuXG5cdC8vICMjIE92ZXJ2aWV3OlxuXHQvL1xuXHQvLyBUaGUgdXBkYXRlTm9kZXMoKSBmdW5jdGlvbjpcblx0Ly8gLSBkZWFscyB3aXRoIHRyaXZpYWwgY2FzZXNcblx0Ly8gLSBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGxpc3RzIGFyZSBrZXllZCBvciB1bmtleWVkIGJhc2VkIG9uIHRoZSBmaXJzdCBub24tbnVsbCBub2RlXG5cdC8vICAgb2YgZWFjaCBsaXN0LlxuXHQvLyAtIGRpZmZzIHRoZW0gYW5kIHBhdGNoZXMgdGhlIERPTSBpZiBuZWVkZWQgKHRoYXQncyB0aGUgYnJ1bnQgb2YgdGhlIGNvZGUpXG5cdC8vIC0gbWFuYWdlcyB0aGUgbGVmdG92ZXJzOiBhZnRlciBkaWZmaW5nLCBhcmUgdGhlcmU6XG5cdC8vICAgLSBvbGQgbm9kZXMgbGVmdCB0byByZW1vdmU/XG5cdC8vIFx0IC0gbmV3IG5vZGVzIHRvIGluc2VydD9cblx0Ly8gXHQgZGVhbCB3aXRoIHRoZW0hXG5cdC8vXG5cdC8vIFRoZSBsaXN0cyBhcmUgb25seSBpdGVyYXRlZCBvdmVyIG9uY2UsIHdpdGggYW4gZXhjZXB0aW9uIGZvciB0aGUgbm9kZXMgaW4gYG9sZGAgdGhhdFxuXHQvLyBhcmUgdmlzaXRlZCBpbiB0aGUgZm91cnRoIHBhcnQgb2YgdGhlIGRpZmYgYW5kIGluIHRoZSBgcmVtb3ZlTm9kZXNgIGxvb3AuXG5cblx0Ly8gIyMgRGlmZmluZ1xuXHQvL1xuXHQvLyBSZWFkaW5nIGh0dHBzOi8vZ2l0aHViLmNvbS9sb2NhbHZvaWQvaXZpL2Jsb2IvZGRjMDlkMDZhYmFlZjQ1MjQ4ZTYxMzNmNzA0MGQwMGQzYzZiZTg1My9wYWNrYWdlcy9pdmkvc3JjL3Zkb20vaW1wbGVtZW50YXRpb24udHMjTDYxNy1MODM3XG5cdC8vIG1heSBiZSBnb29kIGZvciBjb250ZXh0IG9uIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZS1iYXNlZCBsb2dpYyBmb3IgbW92aW5nIG5vZGVzLlxuXHQvL1xuXHQvLyBJbiBvcmRlciB0byBkaWZmIGtleWVkIGxpc3RzLCBvbmUgaGFzIHRvXG5cdC8vXG5cdC8vIDEpIG1hdGNoIG5vZGVzIGluIGJvdGggbGlzdHMsIHBlciBrZXksIGFuZCB1cGRhdGUgdGhlbSBhY2NvcmRpbmdseVxuXHQvLyAyKSBjcmVhdGUgdGhlIG5vZGVzIHByZXNlbnQgaW4gdGhlIG5ldyBsaXN0LCBidXQgYWJzZW50IGluIHRoZSBvbGQgb25lXG5cdC8vIDMpIHJlbW92ZSB0aGUgbm9kZXMgcHJlc2VudCBpbiB0aGUgb2xkIGxpc3QsIGJ1dCBhYnNlbnQgaW4gdGhlIG5ldyBvbmVcblx0Ly8gNCkgZmlndXJlIG91dCB3aGF0IG5vZGVzIGluIDEpIHRvIG1vdmUgaW4gb3JkZXIgdG8gbWluaW1pemUgdGhlIERPTSBvcGVyYXRpb25zLlxuXHQvL1xuXHQvLyBUbyBhY2hpZXZlIDEpIG9uZSBjYW4gY3JlYXRlIGEgZGljdGlvbmFyeSBvZiBrZXlzID0+IGluZGV4IChmb3IgdGhlIG9sZCBsaXN0KSwgdGhlbiBpdGVyYXRlXG5cdC8vIG92ZXIgdGhlIG5ldyBsaXN0IGFuZCBmb3IgZWFjaCBuZXcgdm5vZGUsIGZpbmQgdGhlIGNvcnJlc3BvbmRpbmcgdm5vZGUgaW4gdGhlIG9sZCBsaXN0IHVzaW5nXG5cdC8vIHRoZSBtYXAuXG5cdC8vIDIpIGlzIGFjaGlldmVkIGluIHRoZSBzYW1lIHN0ZXA6IGlmIGEgbmV3IG5vZGUgaGFzIG5vIGNvcnJlc3BvbmRpbmcgZW50cnkgaW4gdGhlIG1hcCwgaXQgaXMgbmV3XG5cdC8vIGFuZCBtdXN0IGJlIGNyZWF0ZWQuXG5cdC8vIEZvciB0aGUgcmVtb3ZhbHMsIHdlIGFjdHVhbGx5IHJlbW92ZSB0aGUgbm9kZXMgdGhhdCBoYXZlIGJlZW4gdXBkYXRlZCBmcm9tIHRoZSBvbGQgbGlzdC5cblx0Ly8gVGhlIG5vZGVzIHRoYXQgcmVtYWluIGluIHRoYXQgbGlzdCBhZnRlciAxKSBhbmQgMikgaGF2ZSBiZWVuIHBlcmZvcm1lZCBjYW4gYmUgc2FmZWx5IHJlbW92ZWQuXG5cdC8vIFRoZSBmb3VydGggc3RlcCBpcyBhIGJpdCBtb3JlIGNvbXBsZXggYW5kIHJlbGllcyBvbiB0aGUgbG9uZ2VzdCBpbmNyZWFzaW5nIHN1YnNlcXVlbmNlIChMSVMpXG5cdC8vIGFsZ29yaXRobS5cblx0Ly9cblx0Ly8gdGhlIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSBpcyB0aGUgbGlzdCBvZiBub2RlcyB0aGF0IGNhbiByZW1haW4gaW4gcGxhY2UuIEltYWdpbmUgZ29pbmdcblx0Ly8gZnJvbSBgMSwyLDMsNCw1YCB0byBgNCw1LDEsMiwzYCB3aGVyZSB0aGUgbnVtYmVycyBhcmUgbm90IG5lY2Vzc2FyaWx5IHRoZSBrZXlzLCBidXQgdGhlIGluZGljZXNcblx0Ly8gY29ycmVzcG9uZGluZyB0byB0aGUga2V5ZWQgbm9kZXMgaW4gdGhlIG9sZCBsaXN0IChrZXllZCBub2RlcyBgZSxkLGMsYixhYCA9PiBgYixhLGUsZCxjYCB3b3VsZFxuXHQvLyAgbWF0Y2ggdGhlIGFib3ZlIGxpc3RzLCBmb3IgZXhhbXBsZSkuXG5cdC8vXG5cdC8vIEluIHRoZXJlIGFyZSB0d28gaW5jcmVhc2luZyBzdWJzZXF1ZW5jZXM6IGA0LDVgIGFuZCBgMSwyLDNgLCB0aGUgbGF0dGVyIGJlaW5nIHRoZSBsb25nZXN0LiBXZVxuXHQvLyBjYW4gdXBkYXRlIHRob3NlIG5vZGVzIHdpdGhvdXQgbW92aW5nIHRoZW0sIGFuZCBvbmx5IGNhbGwgYGluc2VydE5vZGVgIG9uIGA0YCBhbmQgYDVgLlxuXHQvL1xuXHQvLyBAbG9jYWx2b2lkIGFkYXB0ZWQgdGhlIGFsZ28gdG8gYWxzbyBzdXBwb3J0IG5vZGUgZGVsZXRpb25zIGFuZCBpbnNlcnRpb25zICh0aGUgYGxpc2AgaXMgYWN0dWFsbHlcblx0Ly8gdGhlIGxvbmdlc3QgaW5jcmVhc2luZyBzdWJzZXF1ZW5jZSAqb2Ygb2xkIG5vZGVzIHN0aWxsIHByZXNlbnQgaW4gdGhlIG5ldyBsaXN0KikuXG5cdC8vXG5cdC8vIEl0IGlzIGEgZ2VuZXJhbCBhbGdvcml0aG0gdGhhdCBpcyBmaXJlcHJvb2YgaW4gYWxsIGNpcmN1bXN0YW5jZXMsIGJ1dCBpdCByZXF1aXJlcyB0aGUgYWxsb2NhdGlvblxuXHQvLyBhbmQgdGhlIGNvbnN0cnVjdGlvbiBvZiBhIGBrZXkgPT4gb2xkSW5kZXhgIG1hcCwgYW5kIHRocmVlIGFycmF5cyAob25lIHdpdGggYG5ld0luZGV4ID0+IG9sZEluZGV4YCxcblx0Ly8gdGhlIGBMSVNgIGFuZCBhIHRlbXBvcmFyeSBvbmUgdG8gY3JlYXRlIHRoZSBMSVMpLlxuXHQvL1xuXHQvLyBTbyB3ZSBjaGVhdCB3aGVyZSB3ZSBjYW46IGlmIHRoZSB0YWlscyBvZiB0aGUgbGlzdHMgYXJlIGlkZW50aWNhbCwgdGhleSBhcmUgZ3VhcmFudGVlZCB0byBiZSBwYXJ0IG9mXG5cdC8vIHRoZSBMSVMgYW5kIGNhbiBiZSB1cGRhdGVkIHdpdGhvdXQgbW92aW5nIHRoZW0uXG5cdC8vXG5cdC8vIElmIHR3byBub2RlcyBhcmUgc3dhcHBlZCwgdGhleSBhcmUgZ3VhcmFudGVlZCBub3QgdG8gYmUgcGFydCBvZiB0aGUgTElTLCBhbmQgbXVzdCBiZSBtb3ZlZCAod2l0aFxuXHQvLyB0aGUgZXhjZXB0aW9uIG9mIHRoZSBsYXN0IG5vZGUgaWYgdGhlIGxpc3QgaXMgZnVsbHkgcmV2ZXJzZWQpLlxuXHQvL1xuXHQvLyAjIyBGaW5kaW5nIHRoZSBuZXh0IHNpYmxpbmcuXG5cdC8vXG5cdC8vIGB1cGRhdGVOb2RlKClgIGFuZCBgY3JlYXRlTm9kZSgpYCBleHBlY3QgYSBuZXh0U2libGluZyBwYXJhbWV0ZXIgdG8gcGVyZm9ybSBET00gb3BlcmF0aW9ucy5cblx0Ly8gV2hlbiB0aGUgbGlzdCBpcyBiZWluZyB0cmF2ZXJzZWQgdG9wLWRvd24sIGF0IGFueSBpbmRleCwgdGhlIERPTSBub2RlcyB1cCB0byB0aGUgcHJldmlvdXNcblx0Ly8gdm5vZGUgcmVmbGVjdCB0aGUgY29udGVudCBvZiB0aGUgbmV3IGxpc3QsIHdoZXJlYXMgdGhlIHJlc3Qgb2YgdGhlIERPTSBub2RlcyByZWZsZWN0IHRoZSBvbGRcblx0Ly8gbGlzdC4gVGhlIG5leHQgc2libGluZyBtdXN0IGJlIGxvb2tlZCBmb3IgaW4gdGhlIG9sZCBsaXN0IHVzaW5nIGBnZXROZXh0U2libGluZyguLi4gb2xkU3RhcnQgKyAxIC4uLilgLlxuXHQvL1xuXHQvLyBJbiB0aGUgb3RoZXIgc2NlbmFyaW9zIChzd2FwcywgdXB3YXJkcyB0cmF2ZXJzYWwsIG1hcC1iYXNlZCBkaWZmKSxcblx0Ly8gdGhlIG5ldyB2bm9kZXMgbGlzdCBpcyB0cmF2ZXJzZWQgdXB3YXJkcy4gVGhlIERPTSBub2RlcyBhdCB0aGUgYm90dG9tIG9mIHRoZSBsaXN0IHJlZmxlY3QgdGhlXG5cdC8vIGJvdHRvbSBwYXJ0IG9mIHRoZSBuZXcgdm5vZGVzIGxpc3QsIGFuZCB3ZSBjYW4gdXNlIHRoZSBgdi5kb21gICB2YWx1ZSBvZiB0aGUgcHJldmlvdXMgbm9kZVxuXHQvLyBhcyB0aGUgbmV4dCBzaWJsaW5nIChjYWNoZWQgaW4gdGhlIGBuZXh0U2libGluZ2AgdmFyaWFibGUpLlxuXG5cblx0Ly8gIyMgRE9NIG5vZGUgbW92ZXNcblx0Ly9cblx0Ly8gSW4gbW9zdCBzY2VuYXJpb3MgYHVwZGF0ZU5vZGUoKWAgYW5kIGBjcmVhdGVOb2RlKClgIHBlcmZvcm0gdGhlIERPTSBvcGVyYXRpb25zLiBIb3dldmVyLFxuXHQvLyB0aGlzIGlzIG5vdCB0aGUgY2FzZSBpZiB0aGUgbm9kZSBtb3ZlZCAoc2Vjb25kIGFuZCBmb3VydGggcGFydCBvZiB0aGUgZGlmZiBhbGdvKS4gV2UgbW92ZVxuXHQvLyB0aGUgb2xkIERPTSBub2RlcyBiZWZvcmUgdXBkYXRlTm9kZSBydW5zIGJlY2F1c2UgaXQgZW5hYmxlcyB1cyB0byB1c2UgdGhlIGNhY2hlZCBgbmV4dFNpYmxpbmdgXG5cdC8vIHZhcmlhYmxlIHJhdGhlciB0aGFuIGZldGNoaW5nIGl0IHVzaW5nIGBnZXROZXh0U2libGluZygpYC5cblx0Ly9cblx0Ly8gVGhlIGZvdXJ0aCBwYXJ0IG9mIHRoZSBkaWZmIGN1cnJlbnRseSBpbnNlcnRzIG5vZGVzIHVuY29uZGl0aW9uYWxseSwgbGVhZGluZyB0byBpc3N1ZXNcblx0Ly8gbGlrZSAjMTc5MSBhbmQgIzE5OTkuIFdlIG5lZWQgdG8gYmUgc21hcnRlciBhYm91dCB0aG9zZSBzaXR1YXRpb25zIHdoZXJlIGFkamFzY2VudCBvbGRcblx0Ly8gbm9kZXMgcmVtYWluIHRvZ2V0aGVyIGluIHRoZSBuZXcgbGlzdCBpbiBhIHdheSB0aGF0IGlzbid0IGNvdmVyZWQgYnkgcGFydHMgb25lIGFuZFxuXHQvLyB0aHJlZSBvZiB0aGUgZGlmZiBhbGdvLlxuXG5cdGZ1bmN0aW9uIHVwZGF0ZU5vZGVzKHBhcmVudCwgb2xkLCB2bm9kZXMsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHRpZiAob2xkID09PSB2bm9kZXMgfHwgb2xkID09IG51bGwgJiYgdm5vZGVzID09IG51bGwpIHJldHVyblxuXHRcdGVsc2UgaWYgKG9sZCA9PSBudWxsIHx8IG9sZC5sZW5ndGggPT09IDApIGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCAwLCB2bm9kZXMubGVuZ3RoLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdGVsc2UgaWYgKHZub2RlcyA9PSBudWxsIHx8IHZub2Rlcy5sZW5ndGggPT09IDApIHJlbW92ZU5vZGVzKHBhcmVudCwgb2xkLCAwLCBvbGQubGVuZ3RoKVxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIGlzT2xkS2V5ZWQgPSBvbGRbMF0gIT0gbnVsbCAmJiBvbGRbMF0ua2V5ICE9IG51bGxcblx0XHRcdHZhciBpc0tleWVkID0gdm5vZGVzWzBdICE9IG51bGwgJiYgdm5vZGVzWzBdLmtleSAhPSBudWxsXG5cdFx0XHR2YXIgc3RhcnQgPSAwLCBvbGRTdGFydCA9IDBcblx0XHRcdGlmICghaXNPbGRLZXllZCkgd2hpbGUgKG9sZFN0YXJ0IDwgb2xkLmxlbmd0aCAmJiBvbGRbb2xkU3RhcnRdID09IG51bGwpIG9sZFN0YXJ0Kytcblx0XHRcdGlmICghaXNLZXllZCkgd2hpbGUgKHN0YXJ0IDwgdm5vZGVzLmxlbmd0aCAmJiB2bm9kZXNbc3RhcnRdID09IG51bGwpIHN0YXJ0Kytcblx0XHRcdGlmIChpc0tleWVkID09PSBudWxsICYmIGlzT2xkS2V5ZWQgPT0gbnVsbCkgcmV0dXJuIC8vIGJvdGggbGlzdHMgYXJlIGZ1bGwgb2YgbnVsbHNcblx0XHRcdGlmIChpc09sZEtleWVkICE9PSBpc0tleWVkKSB7XG5cdFx0XHRcdHJlbW92ZU5vZGVzKHBhcmVudCwgb2xkLCBvbGRTdGFydCwgb2xkLmxlbmd0aClcblx0XHRcdFx0Y3JlYXRlTm9kZXMocGFyZW50LCB2bm9kZXMsIHN0YXJ0LCB2bm9kZXMubGVuZ3RoLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdFx0fSBlbHNlIGlmICghaXNLZXllZCkge1xuXHRcdFx0XHQvLyBEb24ndCBpbmRleCBwYXN0IHRoZSBlbmQgb2YgZWl0aGVyIGxpc3QgKGNhdXNlcyBkZW9wdHMpLlxuXHRcdFx0XHR2YXIgY29tbW9uTGVuZ3RoID0gb2xkLmxlbmd0aCA8IHZub2Rlcy5sZW5ndGggPyBvbGQubGVuZ3RoIDogdm5vZGVzLmxlbmd0aFxuXHRcdFx0XHQvLyBSZXdpbmQgaWYgbmVjZXNzYXJ5IHRvIHRoZSBmaXJzdCBub24tbnVsbCBpbmRleCBvbiBlaXRoZXIgc2lkZS5cblx0XHRcdFx0Ly8gV2UgY291bGQgYWx0ZXJuYXRpdmVseSBlaXRoZXIgZXhwbGljaXRseSBjcmVhdGUgb3IgcmVtb3ZlIG5vZGVzIHdoZW4gYHN0YXJ0ICE9PSBvbGRTdGFydGBcblx0XHRcdFx0Ly8gYnV0IHRoYXQgd291bGQgYmUgb3B0aW1pemluZyBmb3Igc3BhcnNlIGxpc3RzIHdoaWNoIGFyZSBtb3JlIHJhcmUgdGhhbiBkZW5zZSBvbmVzLlxuXHRcdFx0XHRzdGFydCA9IHN0YXJ0IDwgb2xkU3RhcnQgPyBzdGFydCA6IG9sZFN0YXJ0XG5cdFx0XHRcdGZvciAoOyBzdGFydCA8IGNvbW1vbkxlbmd0aDsgc3RhcnQrKykge1xuXHRcdFx0XHRcdG8gPSBvbGRbc3RhcnRdXG5cdFx0XHRcdFx0diA9IHZub2Rlc1tzdGFydF1cblx0XHRcdFx0XHRpZiAobyA9PT0gdiB8fCBvID09IG51bGwgJiYgdiA9PSBudWxsKSBjb250aW51ZVxuXHRcdFx0XHRcdGVsc2UgaWYgKG8gPT0gbnVsbCkgY3JlYXRlTm9kZShwYXJlbnQsIHYsIGhvb2tzLCBucywgZ2V0TmV4dFNpYmxpbmcob2xkLCBzdGFydCArIDEsIG5leHRTaWJsaW5nKSlcblx0XHRcdFx0XHRlbHNlIGlmICh2ID09IG51bGwpIHJlbW92ZU5vZGUocGFyZW50LCBvKVxuXHRcdFx0XHRcdGVsc2UgdXBkYXRlTm9kZShwYXJlbnQsIG8sIHYsIGhvb2tzLCBnZXROZXh0U2libGluZyhvbGQsIHN0YXJ0ICsgMSwgbmV4dFNpYmxpbmcpLCBucylcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob2xkLmxlbmd0aCA+IGNvbW1vbkxlbmd0aCkgcmVtb3ZlTm9kZXMocGFyZW50LCBvbGQsIHN0YXJ0LCBvbGQubGVuZ3RoKVxuXHRcdFx0XHRpZiAodm5vZGVzLmxlbmd0aCA+IGNvbW1vbkxlbmd0aCkgY3JlYXRlTm9kZXMocGFyZW50LCB2bm9kZXMsIHN0YXJ0LCB2bm9kZXMubGVuZ3RoLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8ga2V5ZWQgZGlmZlxuXHRcdFx0XHR2YXIgb2xkRW5kID0gb2xkLmxlbmd0aCAtIDEsIGVuZCA9IHZub2Rlcy5sZW5ndGggLSAxLCBtYXAsIG8sIHYsIG9lLCB2ZSwgdG9wU2libGluZ1xuXG5cdFx0XHRcdC8vIGJvdHRvbS11cFxuXHRcdFx0XHR3aGlsZSAob2xkRW5kID49IG9sZFN0YXJ0ICYmIGVuZCA+PSBzdGFydCkge1xuXHRcdFx0XHRcdG9lID0gb2xkW29sZEVuZF1cblx0XHRcdFx0XHR2ZSA9IHZub2Rlc1tlbmRdXG5cdFx0XHRcdFx0aWYgKG9lLmtleSAhPT0gdmUua2V5KSBicmVha1xuXHRcdFx0XHRcdGlmIChvZSAhPT0gdmUpIHVwZGF0ZU5vZGUocGFyZW50LCBvZSwgdmUsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0XHRcdFx0aWYgKHZlLmRvbSAhPSBudWxsKSBuZXh0U2libGluZyA9IHZlLmRvbVxuXHRcdFx0XHRcdG9sZEVuZC0tLCBlbmQtLVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIHRvcC1kb3duXG5cdFx0XHRcdHdoaWxlIChvbGRFbmQgPj0gb2xkU3RhcnQgJiYgZW5kID49IHN0YXJ0KSB7XG5cdFx0XHRcdFx0byA9IG9sZFtvbGRTdGFydF1cblx0XHRcdFx0XHR2ID0gdm5vZGVzW3N0YXJ0XVxuXHRcdFx0XHRcdGlmIChvLmtleSAhPT0gdi5rZXkpIGJyZWFrXG5cdFx0XHRcdFx0b2xkU3RhcnQrKywgc3RhcnQrK1xuXHRcdFx0XHRcdGlmIChvICE9PSB2KSB1cGRhdGVOb2RlKHBhcmVudCwgbywgdiwgaG9va3MsIGdldE5leHRTaWJsaW5nKG9sZCwgb2xkU3RhcnQsIG5leHRTaWJsaW5nKSwgbnMpXG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gc3dhcHMgYW5kIGxpc3QgcmV2ZXJzYWxzXG5cdFx0XHRcdHdoaWxlIChvbGRFbmQgPj0gb2xkU3RhcnQgJiYgZW5kID49IHN0YXJ0KSB7XG5cdFx0XHRcdFx0aWYgKHN0YXJ0ID09PSBlbmQpIGJyZWFrXG5cdFx0XHRcdFx0aWYgKG8ua2V5ICE9PSB2ZS5rZXkgfHwgb2Uua2V5ICE9PSB2LmtleSkgYnJlYWtcblx0XHRcdFx0XHR0b3BTaWJsaW5nID0gZ2V0TmV4dFNpYmxpbmcob2xkLCBvbGRTdGFydCwgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0bW92ZU5vZGVzKHBhcmVudCwgb2UsIHRvcFNpYmxpbmcpXG5cdFx0XHRcdFx0aWYgKG9lICE9PSB2KSB1cGRhdGVOb2RlKHBhcmVudCwgb2UsIHYsIGhvb2tzLCB0b3BTaWJsaW5nLCBucylcblx0XHRcdFx0XHRpZiAoKytzdGFydCA8PSAtLWVuZCkgbW92ZU5vZGVzKHBhcmVudCwgbywgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0aWYgKG8gIT09IHZlKSB1cGRhdGVOb2RlKHBhcmVudCwgbywgdmUsIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0XHRcdFx0aWYgKHZlLmRvbSAhPSBudWxsKSBuZXh0U2libGluZyA9IHZlLmRvbVxuXHRcdFx0XHRcdG9sZFN0YXJ0Kys7IG9sZEVuZC0tXG5cdFx0XHRcdFx0b2UgPSBvbGRbb2xkRW5kXVxuXHRcdFx0XHRcdHZlID0gdm5vZGVzW2VuZF1cblx0XHRcdFx0XHRvID0gb2xkW29sZFN0YXJ0XVxuXHRcdFx0XHRcdHYgPSB2bm9kZXNbc3RhcnRdXG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gYm90dG9tIHVwIG9uY2UgYWdhaW5cblx0XHRcdFx0d2hpbGUgKG9sZEVuZCA+PSBvbGRTdGFydCAmJiBlbmQgPj0gc3RhcnQpIHtcblx0XHRcdFx0XHRpZiAob2Uua2V5ICE9PSB2ZS5rZXkpIGJyZWFrXG5cdFx0XHRcdFx0aWYgKG9lICE9PSB2ZSkgdXBkYXRlTm9kZShwYXJlbnQsIG9lLCB2ZSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdFx0XHRpZiAodmUuZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gdmUuZG9tXG5cdFx0XHRcdFx0b2xkRW5kLS0sIGVuZC0tXG5cdFx0XHRcdFx0b2UgPSBvbGRbb2xkRW5kXVxuXHRcdFx0XHRcdHZlID0gdm5vZGVzW2VuZF1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc3RhcnQgPiBlbmQpIHJlbW92ZU5vZGVzKHBhcmVudCwgb2xkLCBvbGRTdGFydCwgb2xkRW5kICsgMSlcblx0XHRcdFx0ZWxzZSBpZiAob2xkU3RhcnQgPiBvbGRFbmQpIGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCBzdGFydCwgZW5kICsgMSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Ly8gaW5zcGlyZWQgYnkgaXZpIGh0dHBzOi8vZ2l0aHViLmNvbS9pdmlqcy9pdmkvIGJ5IEJvcmlzIEthdWxcblx0XHRcdFx0XHR2YXIgb3JpZ2luYWxOZXh0U2libGluZyA9IG5leHRTaWJsaW5nLCB2bm9kZXNMZW5ndGggPSBlbmQgLSBzdGFydCArIDEsIG9sZEluZGljZXMgPSBuZXcgQXJyYXkodm5vZGVzTGVuZ3RoKSwgbGk9MCwgaT0wLCBwb3MgPSAyMTQ3NDgzNjQ3LCBtYXRjaGVkID0gMCwgbWFwLCBsaXNJbmRpY2VzXG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHZub2Rlc0xlbmd0aDsgaSsrKSBvbGRJbmRpY2VzW2ldID0gLTFcblx0XHRcdFx0XHRmb3IgKGkgPSBlbmQ7IGkgPj0gc3RhcnQ7IGktLSkge1xuXHRcdFx0XHRcdFx0aWYgKG1hcCA9PSBudWxsKSBtYXAgPSBnZXRLZXlNYXAob2xkLCBvbGRTdGFydCwgb2xkRW5kICsgMSlcblx0XHRcdFx0XHRcdHZlID0gdm5vZGVzW2ldXG5cdFx0XHRcdFx0XHR2YXIgb2xkSW5kZXggPSBtYXBbdmUua2V5XVxuXHRcdFx0XHRcdFx0aWYgKG9sZEluZGV4ICE9IG51bGwpIHtcblx0XHRcdFx0XHRcdFx0cG9zID0gKG9sZEluZGV4IDwgcG9zKSA/IG9sZEluZGV4IDogLTEgLy8gYmVjb21lcyAtMSBpZiBub2RlcyB3ZXJlIHJlLW9yZGVyZWRcblx0XHRcdFx0XHRcdFx0b2xkSW5kaWNlc1tpLXN0YXJ0XSA9IG9sZEluZGV4XG5cdFx0XHRcdFx0XHRcdG9lID0gb2xkW29sZEluZGV4XVxuXHRcdFx0XHRcdFx0XHRvbGRbb2xkSW5kZXhdID0gbnVsbFxuXHRcdFx0XHRcdFx0XHRpZiAob2UgIT09IHZlKSB1cGRhdGVOb2RlKHBhcmVudCwgb2UsIHZlLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdFx0XHRcdFx0XHRpZiAodmUuZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gdmUuZG9tXG5cdFx0XHRcdFx0XHRcdG1hdGNoZWQrK1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRuZXh0U2libGluZyA9IG9yaWdpbmFsTmV4dFNpYmxpbmdcblx0XHRcdFx0XHRpZiAobWF0Y2hlZCAhPT0gb2xkRW5kIC0gb2xkU3RhcnQgKyAxKSByZW1vdmVOb2RlcyhwYXJlbnQsIG9sZCwgb2xkU3RhcnQsIG9sZEVuZCArIDEpXG5cdFx0XHRcdFx0aWYgKG1hdGNoZWQgPT09IDApIGNyZWF0ZU5vZGVzKHBhcmVudCwgdm5vZGVzLCBzdGFydCwgZW5kICsgMSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChwb3MgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdC8vIHRoZSBpbmRpY2VzIG9mIHRoZSBpbmRpY2VzIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBwYXJ0IG9mIHRoZVxuXHRcdFx0XHRcdFx0XHQvLyBsb25nZXN0IGluY3JlYXNpbmcgc3Vic2VxdWVuY2UgaW4gdGhlIG9sZEluZGljZXMgbGlzdFxuXHRcdFx0XHRcdFx0XHRsaXNJbmRpY2VzID0gbWFrZUxpc0luZGljZXMob2xkSW5kaWNlcylcblx0XHRcdFx0XHRcdFx0bGkgPSBsaXNJbmRpY2VzLmxlbmd0aCAtIDFcblx0XHRcdFx0XHRcdFx0Zm9yIChpID0gZW5kOyBpID49IHN0YXJ0OyBpLS0pIHtcblx0XHRcdFx0XHRcdFx0XHR2ID0gdm5vZGVzW2ldXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9sZEluZGljZXNbaS1zdGFydF0gPT09IC0xKSBjcmVhdGVOb2RlKHBhcmVudCwgdiwgaG9va3MsIG5zLCBuZXh0U2libGluZylcblx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChsaXNJbmRpY2VzW2xpXSA9PT0gaSAtIHN0YXJ0KSBsaS0tXG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIG1vdmVOb2RlcyhwYXJlbnQsIHYsIG5leHRTaWJsaW5nKVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRpZiAodi5kb20gIT0gbnVsbCkgbmV4dFNpYmxpbmcgPSB2bm9kZXNbaV0uZG9tXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IGVuZDsgaSA+PSBzdGFydDsgaS0tKSB7XG5cdFx0XHRcdFx0XHRcdFx0diA9IHZub2Rlc1tpXVxuXHRcdFx0XHRcdFx0XHRcdGlmIChvbGRJbmRpY2VzW2ktc3RhcnRdID09PSAtMSkgY3JlYXRlTm9kZShwYXJlbnQsIHYsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHYuZG9tICE9IG51bGwpIG5leHRTaWJsaW5nID0gdm5vZGVzW2ldLmRvbVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZU5vZGUocGFyZW50LCBvbGQsIHZub2RlLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKSB7XG5cdFx0dmFyIG9sZFRhZyA9IG9sZC50YWcsIHRhZyA9IHZub2RlLnRhZ1xuXHRcdGlmIChvbGRUYWcgPT09IHRhZykge1xuXHRcdFx0dm5vZGUuc3RhdGUgPSBvbGQuc3RhdGVcblx0XHRcdHZub2RlLmV2ZW50cyA9IG9sZC5ldmVudHNcblx0XHRcdGlmIChzaG91bGROb3RVcGRhdGUodm5vZGUsIG9sZCkpIHJldHVyblxuXHRcdFx0aWYgKHR5cGVvZiBvbGRUYWcgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0aWYgKHZub2RlLmF0dHJzICE9IG51bGwpIHtcblx0XHRcdFx0XHR1cGRhdGVMaWZlY3ljbGUodm5vZGUuYXR0cnMsIHZub2RlLCBob29rcylcblx0XHRcdFx0fVxuXHRcdFx0XHRzd2l0Y2ggKG9sZFRhZykge1xuXHRcdFx0XHRcdGNhc2UgXCIjXCI6IHVwZGF0ZVRleHQob2xkLCB2bm9kZSk7IGJyZWFrXG5cdFx0XHRcdFx0Y2FzZSBcIjxcIjogdXBkYXRlSFRNTChwYXJlbnQsIG9sZCwgdm5vZGUsIG5zLCBuZXh0U2libGluZyk7IGJyZWFrXG5cdFx0XHRcdFx0Y2FzZSBcIltcIjogdXBkYXRlRnJhZ21lbnQocGFyZW50LCBvbGQsIHZub2RlLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKTsgYnJlYWtcblx0XHRcdFx0XHRkZWZhdWx0OiB1cGRhdGVFbGVtZW50KG9sZCwgdm5vZGUsIGhvb2tzLCBucylcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB1cGRhdGVDb21wb25lbnQocGFyZW50LCBvbGQsIHZub2RlLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJlbW92ZU5vZGUocGFyZW50LCBvbGQpXG5cdFx0XHRjcmVhdGVOb2RlKHBhcmVudCwgdm5vZGUsIGhvb2tzLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZVRleHQob2xkLCB2bm9kZSkge1xuXHRcdGlmIChvbGQuY2hpbGRyZW4udG9TdHJpbmcoKSAhPT0gdm5vZGUuY2hpbGRyZW4udG9TdHJpbmcoKSkge1xuXHRcdFx0b2xkLmRvbS5ub2RlVmFsdWUgPSB2bm9kZS5jaGlsZHJlblxuXHRcdH1cblx0XHR2bm9kZS5kb20gPSBvbGQuZG9tXG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlSFRNTChwYXJlbnQsIG9sZCwgdm5vZGUsIG5zLCBuZXh0U2libGluZykge1xuXHRcdGlmIChvbGQuY2hpbGRyZW4gIT09IHZub2RlLmNoaWxkcmVuKSB7XG5cdFx0XHRyZW1vdmVIVE1MKHBhcmVudCwgb2xkKVxuXHRcdFx0Y3JlYXRlSFRNTChwYXJlbnQsIHZub2RlLCBucywgbmV4dFNpYmxpbmcpXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dm5vZGUuZG9tID0gb2xkLmRvbVxuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IG9sZC5kb21TaXplXG5cdFx0XHR2bm9kZS5pbnN0YW5jZSA9IG9sZC5pbnN0YW5jZVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVGcmFnbWVudChwYXJlbnQsIG9sZCwgdm5vZGUsIGhvb2tzLCBuZXh0U2libGluZywgbnMpIHtcblx0XHR1cGRhdGVOb2RlcyhwYXJlbnQsIG9sZC5jaGlsZHJlbiwgdm5vZGUuY2hpbGRyZW4sIGhvb2tzLCBuZXh0U2libGluZywgbnMpXG5cdFx0dmFyIGRvbVNpemUgPSAwLCBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG5cdFx0dm5vZGUuZG9tID0gbnVsbFxuXHRcdGlmIChjaGlsZHJlbiAhPSBudWxsKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG5cdFx0XHRcdGlmIChjaGlsZCAhPSBudWxsICYmIGNoaWxkLmRvbSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aWYgKHZub2RlLmRvbSA9PSBudWxsKSB2bm9kZS5kb20gPSBjaGlsZC5kb21cblx0XHRcdFx0XHRkb21TaXplICs9IGNoaWxkLmRvbVNpemUgfHwgMVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZG9tU2l6ZSAhPT0gMSkgdm5vZGUuZG9tU2l6ZSA9IGRvbVNpemVcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gdXBkYXRlRWxlbWVudChvbGQsIHZub2RlLCBob29rcywgbnMpIHtcblx0XHR2YXIgZWxlbWVudCA9IHZub2RlLmRvbSA9IG9sZC5kb21cblx0XHRucyA9IGdldE5hbWVTcGFjZSh2bm9kZSkgfHwgbnNcblxuXHRcdGlmICh2bm9kZS50YWcgPT09IFwidGV4dGFyZWFcIikge1xuXHRcdFx0aWYgKHZub2RlLmF0dHJzID09IG51bGwpIHZub2RlLmF0dHJzID0ge31cblx0XHRcdGlmICh2bm9kZS50ZXh0ICE9IG51bGwpIHtcblx0XHRcdFx0dm5vZGUuYXR0cnMudmFsdWUgPSB2bm9kZS50ZXh0IC8vRklYTUUgaGFuZGxlIG11bHRpcGxlIGNoaWxkcmVuXG5cdFx0XHRcdHZub2RlLnRleHQgPSB1bmRlZmluZWRcblx0XHRcdH1cblx0XHR9XG5cdFx0dXBkYXRlQXR0cnModm5vZGUsIG9sZC5hdHRycywgdm5vZGUuYXR0cnMsIG5zKVxuXHRcdGlmICghbWF5YmVTZXRDb250ZW50RWRpdGFibGUodm5vZGUpKSB7XG5cdFx0XHRpZiAob2xkLnRleHQgIT0gbnVsbCAmJiB2bm9kZS50ZXh0ICE9IG51bGwgJiYgdm5vZGUudGV4dCAhPT0gXCJcIikge1xuXHRcdFx0XHRpZiAob2xkLnRleHQudG9TdHJpbmcoKSAhPT0gdm5vZGUudGV4dC50b1N0cmluZygpKSBvbGQuZG9tLmZpcnN0Q2hpbGQubm9kZVZhbHVlID0gdm5vZGUudGV4dFxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmIChvbGQudGV4dCAhPSBudWxsKSBvbGQuY2hpbGRyZW4gPSBbVm5vZGUoXCIjXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBvbGQudGV4dCwgdW5kZWZpbmVkLCBvbGQuZG9tLmZpcnN0Q2hpbGQpXVxuXHRcdFx0XHRpZiAodm5vZGUudGV4dCAhPSBudWxsKSB2bm9kZS5jaGlsZHJlbiA9IFtWbm9kZShcIiNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHZub2RlLnRleHQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKV1cblx0XHRcdFx0dXBkYXRlTm9kZXMoZWxlbWVudCwgb2xkLmNoaWxkcmVuLCB2bm9kZS5jaGlsZHJlbiwgaG9va3MsIG51bGwsIG5zKVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVDb21wb25lbnQocGFyZW50LCBvbGQsIHZub2RlLCBob29rcywgbmV4dFNpYmxpbmcsIG5zKSB7XG5cdFx0dm5vZGUuaW5zdGFuY2UgPSBWbm9kZS5ub3JtYWxpemUoY2FsbEhvb2suY2FsbCh2bm9kZS5zdGF0ZS52aWV3LCB2bm9kZSkpXG5cdFx0aWYgKHZub2RlLmluc3RhbmNlID09PSB2bm9kZSkgdGhyb3cgRXJyb3IoXCJBIHZpZXcgY2Fubm90IHJldHVybiB0aGUgdm5vZGUgaXQgcmVjZWl2ZWQgYXMgYXJndW1lbnRcIilcblx0XHR1cGRhdGVMaWZlY3ljbGUodm5vZGUuc3RhdGUsIHZub2RlLCBob29rcylcblx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCkgdXBkYXRlTGlmZWN5Y2xlKHZub2RlLmF0dHJzLCB2bm9kZSwgaG9va3MpXG5cdFx0aWYgKHZub2RlLmluc3RhbmNlICE9IG51bGwpIHtcblx0XHRcdGlmIChvbGQuaW5zdGFuY2UgPT0gbnVsbCkgY3JlYXRlTm9kZShwYXJlbnQsIHZub2RlLmluc3RhbmNlLCBob29rcywgbnMsIG5leHRTaWJsaW5nKVxuXHRcdFx0ZWxzZSB1cGRhdGVOb2RlKHBhcmVudCwgb2xkLmluc3RhbmNlLCB2bm9kZS5pbnN0YW5jZSwgaG9va3MsIG5leHRTaWJsaW5nLCBucylcblx0XHRcdHZub2RlLmRvbSA9IHZub2RlLmluc3RhbmNlLmRvbVxuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IHZub2RlLmluc3RhbmNlLmRvbVNpemVcblx0XHR9XG5cdFx0ZWxzZSBpZiAob2xkLmluc3RhbmNlICE9IG51bGwpIHtcblx0XHRcdHJlbW92ZU5vZGUocGFyZW50LCBvbGQuaW5zdGFuY2UpXG5cdFx0XHR2bm9kZS5kb20gPSB1bmRlZmluZWRcblx0XHRcdHZub2RlLmRvbVNpemUgPSAwXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dm5vZGUuZG9tID0gb2xkLmRvbVxuXHRcdFx0dm5vZGUuZG9tU2l6ZSA9IG9sZC5kb21TaXplXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIGdldEtleU1hcCh2bm9kZXMsIHN0YXJ0LCBlbmQpIHtcblx0XHR2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdGZvciAoOyBzdGFydCA8IGVuZDsgc3RhcnQrKykge1xuXHRcdFx0dmFyIHZub2RlID0gdm5vZGVzW3N0YXJ0XVxuXHRcdFx0aWYgKHZub2RlICE9IG51bGwpIHtcblx0XHRcdFx0dmFyIGtleSA9IHZub2RlLmtleVxuXHRcdFx0XHRpZiAoa2V5ICE9IG51bGwpIG1hcFtrZXldID0gc3RhcnRcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG1hcFxuXHR9XG5cdC8vIExpZnRlZCBmcm9tIGl2aSBodHRwczovL2dpdGh1Yi5jb20vaXZpanMvaXZpL1xuXHQvLyB0YWtlcyBhIGxpc3Qgb2YgdW5pcXVlIG51bWJlcnMgKC0xIGlzIHNwZWNpYWwgYW5kIGNhblxuXHQvLyBvY2N1ciBtdWx0aXBsZSB0aW1lcykgYW5kIHJldHVybnMgYW4gYXJyYXkgd2l0aCB0aGUgaW5kaWNlc1xuXHQvLyBvZiB0aGUgaXRlbXMgdGhhdCBhcmUgcGFydCBvZiB0aGUgbG9uZ2VzdCBpbmNyZWFzaW5nXG5cdC8vIHN1YnNlcXVlY2Vcblx0dmFyIGxpc1RlbXAgPSBbXVxuXHRmdW5jdGlvbiBtYWtlTGlzSW5kaWNlcyhhKSB7XG5cdFx0dmFyIHJlc3VsdCA9IFswXVxuXHRcdHZhciB1ID0gMCwgdiA9IDAsIGkgPSAwXG5cdFx0dmFyIGlsID0gbGlzVGVtcC5sZW5ndGggPSBhLmxlbmd0aFxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaWw7IGkrKykgbGlzVGVtcFtpXSA9IGFbaV1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGlsOyArK2kpIHtcblx0XHRcdGlmIChhW2ldID09PSAtMSkgY29udGludWVcblx0XHRcdHZhciBqID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXVxuXHRcdFx0aWYgKGFbal0gPCBhW2ldKSB7XG5cdFx0XHRcdGxpc1RlbXBbaV0gPSBqXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGkpXG5cdFx0XHRcdGNvbnRpbnVlXG5cdFx0XHR9XG5cdFx0XHR1ID0gMFxuXHRcdFx0diA9IHJlc3VsdC5sZW5ndGggLSAxXG5cdFx0XHR3aGlsZSAodSA8IHYpIHtcblx0XHRcdFx0Ly8gRmFzdCBpbnRlZ2VyIGF2ZXJhZ2Ugd2l0aG91dCBvdmVyZmxvdy5cblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2Vcblx0XHRcdFx0dmFyIGMgPSAodSA+Pj4gMSkgKyAodiA+Pj4gMSkgKyAodSAmIHYgJiAxKVxuXHRcdFx0XHRpZiAoYVtyZXN1bHRbY11dIDwgYVtpXSkge1xuXHRcdFx0XHRcdHUgPSBjICsgMVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHYgPSBjXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChhW2ldIDwgYVtyZXN1bHRbdV1dKSB7XG5cdFx0XHRcdGlmICh1ID4gMCkgbGlzVGVtcFtpXSA9IHJlc3VsdFt1IC0gMV1cblx0XHRcdFx0cmVzdWx0W3VdID0gaVxuXHRcdFx0fVxuXHRcdH1cblx0XHR1ID0gcmVzdWx0Lmxlbmd0aFxuXHRcdHYgPSByZXN1bHRbdSAtIDFdXG5cdFx0d2hpbGUgKHUtLSA+IDApIHtcblx0XHRcdHJlc3VsdFt1XSA9IHZcblx0XHRcdHYgPSBsaXNUZW1wW3ZdXG5cdFx0fVxuXHRcdGxpc1RlbXAubGVuZ3RoID0gMFxuXHRcdHJldHVybiByZXN1bHRcblx0fVxuXG5cdGZ1bmN0aW9uIGdldE5leHRTaWJsaW5nKHZub2RlcywgaSwgbmV4dFNpYmxpbmcpIHtcblx0XHRmb3IgKDsgaSA8IHZub2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHZub2Rlc1tpXSAhPSBudWxsICYmIHZub2Rlc1tpXS5kb20gIT0gbnVsbCkgcmV0dXJuIHZub2Rlc1tpXS5kb21cblx0XHR9XG5cdFx0cmV0dXJuIG5leHRTaWJsaW5nXG5cdH1cblxuXHQvLyBUaGlzIGNvdmVycyBhIHJlYWxseSBzcGVjaWZpYyBlZGdlIGNhc2U6XG5cdC8vIC0gUGFyZW50IG5vZGUgaXMga2V5ZWQgYW5kIGNvbnRhaW5zIGNoaWxkXG5cdC8vIC0gQ2hpbGQgaXMgcmVtb3ZlZCwgcmV0dXJucyB1bnJlc29sdmVkIHByb21pc2UgaW4gYG9uYmVmb3JlcmVtb3ZlYFxuXHQvLyAtIFBhcmVudCBub2RlIGlzIG1vdmVkIGluIGtleWVkIGRpZmZcblx0Ly8gLSBSZW1haW5pbmcgY2hpbGRyZW4gc3RpbGwgbmVlZCBtb3ZlZCBhcHByb3ByaWF0ZWx5XG5cdC8vXG5cdC8vIElkZWFsbHksIEknZCB0cmFjayByZW1vdmVkIG5vZGVzIGFzIHdlbGwsIGJ1dCB0aGF0IGludHJvZHVjZXMgYSBsb3QgbW9yZVxuXHQvLyBjb21wbGV4aXR5IGFuZCBJJ20gbm90IGV4YWN0bHkgaW50ZXJlc3RlZCBpbiBkb2luZyB0aGF0LlxuXHRmdW5jdGlvbiBtb3ZlTm9kZXMocGFyZW50LCB2bm9kZSwgbmV4dFNpYmxpbmcpIHtcblx0XHR2YXIgZnJhZyA9ICRkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG5cdFx0bW92ZUNoaWxkVG9GcmFnKHBhcmVudCwgZnJhZywgdm5vZGUpXG5cdFx0aW5zZXJ0Tm9kZShwYXJlbnQsIGZyYWcsIG5leHRTaWJsaW5nKVxuXHR9XG5cdGZ1bmN0aW9uIG1vdmVDaGlsZFRvRnJhZyhwYXJlbnQsIGZyYWcsIHZub2RlKSB7XG5cdFx0Ly8gRG9kZ2UgdGhlIHJlY3Vyc2lvbiBvdmVyaGVhZCBpbiBhIGZldyBvZiB0aGUgbW9zdCBjb21tb24gY2FzZXMuXG5cdFx0d2hpbGUgKHZub2RlLmRvbSAhPSBudWxsICYmIHZub2RlLmRvbS5wYXJlbnROb2RlID09PSBwYXJlbnQpIHtcblx0XHRcdGlmICh0eXBlb2Ygdm5vZGUudGFnICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHZub2RlID0gdm5vZGUuaW5zdGFuY2Vcblx0XHRcdFx0aWYgKHZub2RlICE9IG51bGwpIGNvbnRpbnVlXG5cdFx0XHR9IGVsc2UgaWYgKHZub2RlLnRhZyA9PT0gXCI8XCIpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2bm9kZS5pbnN0YW5jZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGZyYWcuYXBwZW5kQ2hpbGQodm5vZGUuaW5zdGFuY2VbaV0pXG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodm5vZGUudGFnICE9PSBcIltcIikge1xuXHRcdFx0XHQvLyBEb24ndCByZWN1cnNlIGZvciB0ZXh0IG5vZGVzICpvciogZWxlbWVudHMsIGp1c3QgZnJhZ21lbnRzXG5cdFx0XHRcdGZyYWcuYXBwZW5kQ2hpbGQodm5vZGUuZG9tKVxuXHRcdFx0fSBlbHNlIGlmICh2bm9kZS5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0dm5vZGUgPSB2bm9kZS5jaGlsZHJlblswXVxuXHRcdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkgY29udGludWVcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YXIgY2hpbGQgPSB2bm9kZS5jaGlsZHJlbltpXVxuXHRcdFx0XHRcdGlmIChjaGlsZCAhPSBudWxsKSBtb3ZlQ2hpbGRUb0ZyYWcocGFyZW50LCBmcmFnLCBjaGlsZClcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YnJlYWtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBpbnNlcnROb2RlKHBhcmVudCwgZG9tLCBuZXh0U2libGluZykge1xuXHRcdGlmIChuZXh0U2libGluZyAhPSBudWxsKSBwYXJlbnQuaW5zZXJ0QmVmb3JlKGRvbSwgbmV4dFNpYmxpbmcpXG5cdFx0ZWxzZSBwYXJlbnQuYXBwZW5kQ2hpbGQoZG9tKVxuXHR9XG5cblx0ZnVuY3Rpb24gbWF5YmVTZXRDb250ZW50RWRpdGFibGUodm5vZGUpIHtcblx0XHRpZiAodm5vZGUuYXR0cnMgPT0gbnVsbCB8fCAoXG5cdFx0XHR2bm9kZS5hdHRycy5jb250ZW50ZWRpdGFibGUgPT0gbnVsbCAmJiAvLyBhdHRyaWJ1dGVcblx0XHRcdHZub2RlLmF0dHJzLmNvbnRlbnRFZGl0YWJsZSA9PSBudWxsIC8vIHByb3BlcnR5XG5cdFx0KSkgcmV0dXJuIGZhbHNlXG5cdFx0dmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHRpZiAoY2hpbGRyZW4gIT0gbnVsbCAmJiBjaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgY2hpbGRyZW5bMF0udGFnID09PSBcIjxcIikge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjaGlsZHJlblswXS5jaGlsZHJlblxuXHRcdFx0aWYgKHZub2RlLmRvbS5pbm5lckhUTUwgIT09IGNvbnRlbnQpIHZub2RlLmRvbS5pbm5lckhUTUwgPSBjb250ZW50XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHZub2RlLnRleHQgIT0gbnVsbCB8fCBjaGlsZHJlbiAhPSBudWxsICYmIGNoaWxkcmVuLmxlbmd0aCAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGQgbm9kZSBvZiBhIGNvbnRlbnRlZGl0YWJsZSBtdXN0IGJlIHRydXN0ZWRcIilcblx0XHRyZXR1cm4gdHJ1ZVxuXHR9XG5cblx0Ly9yZW1vdmVcblx0ZnVuY3Rpb24gcmVtb3ZlTm9kZXMocGFyZW50LCB2bm9kZXMsIHN0YXJ0LCBlbmQpIHtcblx0XHRmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuXHRcdFx0dmFyIHZub2RlID0gdm5vZGVzW2ldXG5cdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkgcmVtb3ZlTm9kZShwYXJlbnQsIHZub2RlKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiByZW1vdmVOb2RlKHBhcmVudCwgdm5vZGUpIHtcblx0XHR2YXIgbWFzayA9IDBcblx0XHR2YXIgb3JpZ2luYWwgPSB2bm9kZS5zdGF0ZVxuXHRcdHZhciBzdGF0ZVJlc3VsdCwgYXR0cnNSZXN1bHRcblx0XHRpZiAodHlwZW9mIHZub2RlLnRhZyAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2Ygdm5vZGUuc3RhdGUub25iZWZvcmVyZW1vdmUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dmFyIHJlc3VsdCA9IGNhbGxIb29rLmNhbGwodm5vZGUuc3RhdGUub25iZWZvcmVyZW1vdmUsIHZub2RlKVxuXHRcdFx0aWYgKHJlc3VsdCAhPSBudWxsICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdG1hc2sgPSAxXG5cdFx0XHRcdHN0YXRlUmVzdWx0ID0gcmVzdWx0XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh2bm9kZS5hdHRycyAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25iZWZvcmVyZW1vdmUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dmFyIHJlc3VsdCA9IGNhbGxIb29rLmNhbGwodm5vZGUuYXR0cnMub25iZWZvcmVyZW1vdmUsIHZub2RlKVxuXHRcdFx0aWYgKHJlc3VsdCAhPSBudWxsICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG5cdFx0XHRcdG1hc2sgfD0gMlxuXHRcdFx0XHRhdHRyc1Jlc3VsdCA9IHJlc3VsdFxuXHRcdFx0fVxuXHRcdH1cblx0XHRjaGVja1N0YXRlKHZub2RlLCBvcmlnaW5hbClcblxuXHRcdC8vIElmIHdlIGNhbiwgdHJ5IHRvIGZhc3QtcGF0aCBpdCBhbmQgYXZvaWQgYWxsIHRoZSBvdmVyaGVhZCBvZiBhd2FpdGluZ1xuXHRcdGlmICghbWFzaykge1xuXHRcdFx0b25yZW1vdmUodm5vZGUpXG5cdFx0XHRyZW1vdmVDaGlsZChwYXJlbnQsIHZub2RlKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoc3RhdGVSZXN1bHQgIT0gbnVsbCkge1xuXHRcdFx0XHR2YXIgbmV4dCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuXHRcdFx0XHRcdGlmIChtYXNrICYgMSkgeyBtYXNrICY9IDI7IGlmICghbWFzaykgcmVhbGx5UmVtb3ZlKCkgfVxuXHRcdFx0XHR9XG5cdFx0XHRcdHN0YXRlUmVzdWx0LnRoZW4obmV4dCwgbmV4dClcblx0XHRcdH1cblx0XHRcdGlmIChhdHRyc1Jlc3VsdCAhPSBudWxsKSB7XG5cdFx0XHRcdHZhciBuZXh0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG5cdFx0XHRcdFx0aWYgKG1hc2sgJiAyKSB7IG1hc2sgJj0gMTsgaWYgKCFtYXNrKSByZWFsbHlSZW1vdmUoKSB9XG5cdFx0XHRcdH1cblx0XHRcdFx0YXR0cnNSZXN1bHQudGhlbihuZXh0LCBuZXh0KVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlYWxseVJlbW92ZSgpIHtcblx0XHRcdGNoZWNrU3RhdGUodm5vZGUsIG9yaWdpbmFsKVxuXHRcdFx0b25yZW1vdmUodm5vZGUpXG5cdFx0XHRyZW1vdmVDaGlsZChwYXJlbnQsIHZub2RlKVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiByZW1vdmVIVE1MKHBhcmVudCwgdm5vZGUpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHZub2RlLmluc3RhbmNlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRwYXJlbnQucmVtb3ZlQ2hpbGQodm5vZGUuaW5zdGFuY2VbaV0pXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHJlbW92ZUNoaWxkKHBhcmVudCwgdm5vZGUpIHtcblx0XHQvLyBEb2RnZSB0aGUgcmVjdXJzaW9uIG92ZXJoZWFkIGluIGEgZmV3IG9mIHRoZSBtb3N0IGNvbW1vbiBjYXNlcy5cblx0XHR3aGlsZSAodm5vZGUuZG9tICE9IG51bGwgJiYgdm5vZGUuZG9tLnBhcmVudE5vZGUgPT09IHBhcmVudCkge1xuXHRcdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0dm5vZGUgPSB2bm9kZS5pbnN0YW5jZVxuXHRcdFx0XHRpZiAodm5vZGUgIT0gbnVsbCkgY29udGludWVcblx0XHRcdH0gZWxzZSBpZiAodm5vZGUudGFnID09PSBcIjxcIikge1xuXHRcdFx0XHRyZW1vdmVIVE1MKHBhcmVudCwgdm5vZGUpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAodm5vZGUudGFnICE9PSBcIltcIikge1xuXHRcdFx0XHRcdHBhcmVudC5yZW1vdmVDaGlsZCh2bm9kZS5kb20pXG5cdFx0XHRcdFx0aWYgKCFBcnJheS5pc0FycmF5KHZub2RlLmNoaWxkcmVuKSkgYnJlYWtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodm5vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdFx0dm5vZGUgPSB2bm9kZS5jaGlsZHJlblswXVxuXHRcdFx0XHRcdGlmICh2bm9kZSAhPSBudWxsKSBjb250aW51ZVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdm5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdHZhciBjaGlsZCA9IHZub2RlLmNoaWxkcmVuW2ldXG5cdFx0XHRcdFx0XHRpZiAoY2hpbGQgIT0gbnVsbCkgcmVtb3ZlQ2hpbGQocGFyZW50LCBjaGlsZClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGJyZWFrXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIG9ucmVtb3ZlKHZub2RlKSB7XG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHZub2RlLnN0YXRlLm9ucmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIGNhbGxIb29rLmNhbGwodm5vZGUuc3RhdGUub25yZW1vdmUsIHZub2RlKVxuXHRcdGlmICh2bm9kZS5hdHRycyAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25yZW1vdmUgPT09IFwiZnVuY3Rpb25cIikgY2FsbEhvb2suY2FsbCh2bm9kZS5hdHRycy5vbnJlbW92ZSwgdm5vZGUpXG5cdFx0aWYgKHR5cGVvZiB2bm9kZS50YWcgIT09IFwic3RyaW5nXCIpIHtcblx0XHRcdGlmICh2bm9kZS5pbnN0YW5jZSAhPSBudWxsKSBvbnJlbW92ZSh2bm9kZS5pbnN0YW5jZSlcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW5cblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0dmFyIGNoaWxkID0gY2hpbGRyZW5baV1cblx0XHRcdFx0XHRpZiAoY2hpbGQgIT0gbnVsbCkgb25yZW1vdmUoY2hpbGQpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvL2F0dHJzXG5cdGZ1bmN0aW9uIHNldEF0dHJzKHZub2RlLCBhdHRycywgbnMpIHtcblx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcblx0XHRcdHNldEF0dHIodm5vZGUsIGtleSwgbnVsbCwgYXR0cnNba2V5XSwgbnMpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHNldEF0dHIodm5vZGUsIGtleSwgb2xkLCB2YWx1ZSwgbnMpIHtcblx0XHRpZiAoa2V5ID09PSBcImtleVwiIHx8IGtleSA9PT0gXCJpc1wiIHx8IHZhbHVlID09IG51bGwgfHwgaXNMaWZlY3ljbGVNZXRob2Qoa2V5KSB8fCAob2xkID09PSB2YWx1ZSAmJiAhaXNGb3JtQXR0cmlidXRlKHZub2RlLCBrZXkpKSAmJiB0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIpIHJldHVyblxuXHRcdGlmIChrZXlbMF0gPT09IFwib1wiICYmIGtleVsxXSA9PT0gXCJuXCIpIHJldHVybiB1cGRhdGVFdmVudCh2bm9kZSwga2V5LCB2YWx1ZSlcblx0XHRpZiAoa2V5LnNsaWNlKDAsIDYpID09PSBcInhsaW5rOlwiKSB2bm9kZS5kb20uc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsIGtleS5zbGljZSg2KSwgdmFsdWUpXG5cdFx0ZWxzZSBpZiAoa2V5ID09PSBcInN0eWxlXCIpIHVwZGF0ZVN0eWxlKHZub2RlLmRvbSwgb2xkLCB2YWx1ZSlcblx0XHRlbHNlIGlmIChoYXNQcm9wZXJ0eUtleSh2bm9kZSwga2V5LCBucykpIHtcblx0XHRcdGlmIChrZXkgPT09IFwidmFsdWVcIikge1xuXHRcdFx0XHQvLyBPbmx5IGRvIHRoZSBjb2VyY2lvbiBpZiB3ZSdyZSBhY3R1YWxseSBnb2luZyB0byBjaGVjayB0aGUgdmFsdWUuXG5cdFx0XHRcdC8qIGVzbGludC1kaXNhYmxlIG5vLWltcGxpY2l0LWNvZXJjaW9uICovXG5cdFx0XHRcdC8vc2V0dGluZyBpbnB1dFt2YWx1ZV0gdG8gc2FtZSB2YWx1ZSBieSB0eXBpbmcgb24gZm9jdXNlZCBlbGVtZW50IG1vdmVzIGN1cnNvciB0byBlbmQgaW4gQ2hyb21lXG5cdFx0XHRcdGlmICgodm5vZGUudGFnID09PSBcImlucHV0XCIgfHwgdm5vZGUudGFnID09PSBcInRleHRhcmVhXCIpICYmIHZub2RlLmRvbS52YWx1ZSA9PT0gXCJcIiArIHZhbHVlICYmIHZub2RlLmRvbSA9PT0gYWN0aXZlRWxlbWVudCgpKSByZXR1cm5cblx0XHRcdFx0Ly9zZXR0aW5nIHNlbGVjdFt2YWx1ZV0gdG8gc2FtZSB2YWx1ZSB3aGlsZSBoYXZpbmcgc2VsZWN0IG9wZW4gYmxpbmtzIHNlbGVjdCBkcm9wZG93biBpbiBDaHJvbWVcblx0XHRcdFx0aWYgKHZub2RlLnRhZyA9PT0gXCJzZWxlY3RcIiAmJiBvbGQgIT09IG51bGwgJiYgdm5vZGUuZG9tLnZhbHVlID09PSBcIlwiICsgdmFsdWUpIHJldHVyblxuXHRcdFx0XHQvL3NldHRpbmcgb3B0aW9uW3ZhbHVlXSB0byBzYW1lIHZhbHVlIHdoaWxlIGhhdmluZyBzZWxlY3Qgb3BlbiBibGlua3Mgc2VsZWN0IGRyb3Bkb3duIGluIENocm9tZVxuXHRcdFx0XHRpZiAodm5vZGUudGFnID09PSBcIm9wdGlvblwiICYmIG9sZCAhPT0gbnVsbCAmJiB2bm9kZS5kb20udmFsdWUgPT09IFwiXCIgKyB2YWx1ZSkgcmV0dXJuXG5cdFx0XHRcdC8qIGVzbGludC1lbmFibGUgbm8taW1wbGljaXQtY29lcmNpb24gKi9cblx0XHRcdH1cblx0XHRcdC8vIElmIHlvdSBhc3NpZ24gYW4gaW5wdXQgdHlwZSB0aGF0IGlzIG5vdCBzdXBwb3J0ZWQgYnkgSUUgMTEgd2l0aCBhbiBhc3NpZ25tZW50IGV4cHJlc3Npb24sIGFuIGVycm9yIHdpbGwgb2NjdXIuXG5cdFx0XHRpZiAodm5vZGUudGFnID09PSBcImlucHV0XCIgJiYga2V5ID09PSBcInR5cGVcIikgdm5vZGUuZG9tLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKVxuXHRcdFx0ZWxzZSB2bm9kZS5kb21ba2V5XSA9IHZhbHVlXG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0XHRcdGlmICh2YWx1ZSkgdm5vZGUuZG9tLnNldEF0dHJpYnV0ZShrZXksIFwiXCIpXG5cdFx0XHRcdGVsc2Ugdm5vZGUuZG9tLnJlbW92ZUF0dHJpYnV0ZShrZXkpXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHZub2RlLmRvbS5zZXRBdHRyaWJ1dGUoa2V5ID09PSBcImNsYXNzTmFtZVwiID8gXCJjbGFzc1wiIDoga2V5LCB2YWx1ZSlcblx0XHR9XG5cdH1cblx0ZnVuY3Rpb24gcmVtb3ZlQXR0cih2bm9kZSwga2V5LCBvbGQsIG5zKSB7XG5cdFx0aWYgKGtleSA9PT0gXCJrZXlcIiB8fCBrZXkgPT09IFwiaXNcIiB8fCBvbGQgPT0gbnVsbCB8fCBpc0xpZmVjeWNsZU1ldGhvZChrZXkpKSByZXR1cm5cblx0XHRpZiAoa2V5WzBdID09PSBcIm9cIiAmJiBrZXlbMV0gPT09IFwiblwiICYmICFpc0xpZmVjeWNsZU1ldGhvZChrZXkpKSB1cGRhdGVFdmVudCh2bm9kZSwga2V5LCB1bmRlZmluZWQpXG5cdFx0ZWxzZSBpZiAoa2V5ID09PSBcInN0eWxlXCIpIHVwZGF0ZVN0eWxlKHZub2RlLmRvbSwgb2xkLCBudWxsKVxuXHRcdGVsc2UgaWYgKFxuXHRcdFx0aGFzUHJvcGVydHlLZXkodm5vZGUsIGtleSwgbnMpXG5cdFx0XHQmJiBrZXkgIT09IFwiY2xhc3NOYW1lXCJcblx0XHRcdCYmICEoa2V5ID09PSBcInZhbHVlXCIgJiYgKFxuXHRcdFx0XHR2bm9kZS50YWcgPT09IFwib3B0aW9uXCJcblx0XHRcdFx0fHwgdm5vZGUudGFnID09PSBcInNlbGVjdFwiICYmIHZub2RlLmRvbS5zZWxlY3RlZEluZGV4ID09PSAtMSAmJiB2bm9kZS5kb20gPT09IGFjdGl2ZUVsZW1lbnQoKVxuXHRcdFx0KSlcblx0XHRcdCYmICEodm5vZGUudGFnID09PSBcImlucHV0XCIgJiYga2V5ID09PSBcInR5cGVcIilcblx0XHQpIHtcblx0XHRcdHZub2RlLmRvbVtrZXldID0gbnVsbFxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgbnNMYXN0SW5kZXggPSBrZXkuaW5kZXhPZihcIjpcIilcblx0XHRcdGlmIChuc0xhc3RJbmRleCAhPT0gLTEpIGtleSA9IGtleS5zbGljZShuc0xhc3RJbmRleCArIDEpXG5cdFx0XHRpZiAob2xkICE9PSBmYWxzZSkgdm5vZGUuZG9tLnJlbW92ZUF0dHJpYnV0ZShrZXkgPT09IFwiY2xhc3NOYW1lXCIgPyBcImNsYXNzXCIgOiBrZXkpXG5cdFx0fVxuXHR9XG5cdGZ1bmN0aW9uIHNldExhdGVTZWxlY3RBdHRycyh2bm9kZSwgYXR0cnMpIHtcblx0XHRpZiAoXCJ2YWx1ZVwiIGluIGF0dHJzKSB7XG5cdFx0XHRpZihhdHRycy52YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRpZiAodm5vZGUuZG9tLnNlbGVjdGVkSW5kZXggIT09IC0xKSB2bm9kZS5kb20udmFsdWUgPSBudWxsXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgbm9ybWFsaXplZCA9IFwiXCIgKyBhdHRycy52YWx1ZSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWltcGxpY2l0LWNvZXJjaW9uXG5cdFx0XHRcdGlmICh2bm9kZS5kb20udmFsdWUgIT09IG5vcm1hbGl6ZWQgfHwgdm5vZGUuZG9tLnNlbGVjdGVkSW5kZXggPT09IC0xKSB7XG5cdFx0XHRcdFx0dm5vZGUuZG9tLnZhbHVlID0gbm9ybWFsaXplZFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChcInNlbGVjdGVkSW5kZXhcIiBpbiBhdHRycykgc2V0QXR0cih2bm9kZSwgXCJzZWxlY3RlZEluZGV4XCIsIG51bGwsIGF0dHJzLnNlbGVjdGVkSW5kZXgsIHVuZGVmaW5lZClcblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVBdHRycyh2bm9kZSwgb2xkLCBhdHRycywgbnMpIHtcblx0XHRpZiAoYXR0cnMgIT0gbnVsbCkge1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG5cdFx0XHRcdHNldEF0dHIodm5vZGUsIGtleSwgb2xkICYmIG9sZFtrZXldLCBhdHRyc1trZXldLCBucylcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIHZhbFxuXHRcdGlmIChvbGQgIT0gbnVsbCkge1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIG9sZCkge1xuXHRcdFx0XHRpZiAoKCh2YWwgPSBvbGRba2V5XSkgIT0gbnVsbCkgJiYgKGF0dHJzID09IG51bGwgfHwgYXR0cnNba2V5XSA9PSBudWxsKSkge1xuXHRcdFx0XHRcdHJlbW92ZUF0dHIodm5vZGUsIGtleSwgdmFsLCBucylcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRmdW5jdGlvbiBpc0Zvcm1BdHRyaWJ1dGUodm5vZGUsIGF0dHIpIHtcblx0XHRyZXR1cm4gYXR0ciA9PT0gXCJ2YWx1ZVwiIHx8IGF0dHIgPT09IFwiY2hlY2tlZFwiIHx8IGF0dHIgPT09IFwic2VsZWN0ZWRJbmRleFwiIHx8IGF0dHIgPT09IFwic2VsZWN0ZWRcIiAmJiB2bm9kZS5kb20gPT09IGFjdGl2ZUVsZW1lbnQoKSB8fCB2bm9kZS50YWcgPT09IFwib3B0aW9uXCIgJiYgdm5vZGUuZG9tLnBhcmVudE5vZGUgPT09ICRkb2MuYWN0aXZlRWxlbWVudFxuXHR9XG5cdGZ1bmN0aW9uIGlzTGlmZWN5Y2xlTWV0aG9kKGF0dHIpIHtcblx0XHRyZXR1cm4gYXR0ciA9PT0gXCJvbmluaXRcIiB8fCBhdHRyID09PSBcIm9uY3JlYXRlXCIgfHwgYXR0ciA9PT0gXCJvbnVwZGF0ZVwiIHx8IGF0dHIgPT09IFwib25yZW1vdmVcIiB8fCBhdHRyID09PSBcIm9uYmVmb3JlcmVtb3ZlXCIgfHwgYXR0ciA9PT0gXCJvbmJlZm9yZXVwZGF0ZVwiXG5cdH1cblx0ZnVuY3Rpb24gaGFzUHJvcGVydHlLZXkodm5vZGUsIGtleSwgbnMpIHtcblx0XHQvLyBGaWx0ZXIgb3V0IG5hbWVzcGFjZWQga2V5c1xuXHRcdHJldHVybiBucyA9PT0gdW5kZWZpbmVkICYmIChcblx0XHRcdC8vIElmIGl0J3MgYSBjdXN0b20gZWxlbWVudCwganVzdCBrZWVwIGl0LlxuXHRcdFx0dm5vZGUudGFnLmluZGV4T2YoXCItXCIpID4gLTEgfHwgdm5vZGUuYXR0cnMgIT0gbnVsbCAmJiB2bm9kZS5hdHRycy5pcyB8fFxuXHRcdFx0Ly8gSWYgaXQncyBhIG5vcm1hbCBlbGVtZW50LCBsZXQncyB0cnkgdG8gYXZvaWQgYSBmZXcgYnJvd3NlciBidWdzLlxuXHRcdFx0a2V5ICE9PSBcImhyZWZcIiAmJiBrZXkgIT09IFwibGlzdFwiICYmIGtleSAhPT0gXCJmb3JtXCIgJiYga2V5ICE9PSBcIndpZHRoXCIgJiYga2V5ICE9PSBcImhlaWdodFwiLy8gJiYga2V5ICE9PSBcInR5cGVcIlxuXHRcdFx0Ly8gRGVmZXIgdGhlIHByb3BlcnR5IGNoZWNrIHVudGlsICphZnRlciogd2UgY2hlY2sgZXZlcnl0aGluZy5cblx0XHQpICYmIGtleSBpbiB2bm9kZS5kb21cblx0fVxuXG5cdC8vc3R5bGVcblx0dmFyIHVwcGVyY2FzZVJlZ2V4ID0gL1tBLVpdL2dcblx0ZnVuY3Rpb24gdG9Mb3dlckNhc2UoY2FwaXRhbCkgeyByZXR1cm4gXCItXCIgKyBjYXBpdGFsLnRvTG93ZXJDYXNlKCkgfVxuXHRmdW5jdGlvbiBub3JtYWxpemVLZXkoa2V5KSB7XG5cdFx0cmV0dXJuIGtleVswXSA9PT0gXCItXCIgJiYga2V5WzFdID09PSBcIi1cIiA/IGtleSA6XG5cdFx0XHRrZXkgPT09IFwiY3NzRmxvYXRcIiA/IFwiZmxvYXRcIiA6XG5cdFx0XHRcdGtleS5yZXBsYWNlKHVwcGVyY2FzZVJlZ2V4LCB0b0xvd2VyQ2FzZSlcblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVTdHlsZShlbGVtZW50LCBvbGQsIHN0eWxlKSB7XG5cdFx0aWYgKG9sZCA9PT0gc3R5bGUpIHtcblx0XHRcdC8vIFN0eWxlcyBhcmUgZXF1aXZhbGVudCwgZG8gbm90aGluZy5cblx0XHR9IGVsc2UgaWYgKHN0eWxlID09IG51bGwpIHtcblx0XHRcdC8vIE5ldyBzdHlsZSBpcyBtaXNzaW5nLCBqdXN0IGNsZWFyIGl0LlxuXHRcdFx0ZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gXCJcIlxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHN0eWxlICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHQvLyBOZXcgc3R5bGUgaXMgYSBzdHJpbmcsIGxldCBlbmdpbmUgZGVhbCB3aXRoIHBhdGNoaW5nLlxuXHRcdFx0ZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gc3R5bGVcblx0XHR9IGVsc2UgaWYgKG9sZCA9PSBudWxsIHx8IHR5cGVvZiBvbGQgIT09IFwib2JqZWN0XCIpIHtcblx0XHRcdC8vIGBvbGRgIGlzIG1pc3Npbmcgb3IgYSBzdHJpbmcsIGBzdHlsZWAgaXMgYW4gb2JqZWN0LlxuXHRcdFx0ZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gXCJcIlxuXHRcdFx0Ly8gQWRkIG5ldyBzdHlsZSBwcm9wZXJ0aWVzXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gc3R5bGUpIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gc3R5bGVba2V5XVxuXHRcdFx0XHRpZiAodmFsdWUgIT0gbnVsbCkgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShub3JtYWxpemVLZXkoa2V5KSwgU3RyaW5nKHZhbHVlKSlcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gQm90aCBvbGQgJiBuZXcgYXJlIChkaWZmZXJlbnQpIG9iamVjdHMuXG5cdFx0XHQvLyBVcGRhdGUgc3R5bGUgcHJvcGVydGllcyB0aGF0IGhhdmUgY2hhbmdlZFxuXHRcdFx0Zm9yICh2YXIga2V5IGluIHN0eWxlKSB7XG5cdFx0XHRcdHZhciB2YWx1ZSA9IHN0eWxlW2tleV1cblx0XHRcdFx0aWYgKHZhbHVlICE9IG51bGwgJiYgKHZhbHVlID0gU3RyaW5nKHZhbHVlKSkgIT09IFN0cmluZyhvbGRba2V5XSkpIHtcblx0XHRcdFx0XHRlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KG5vcm1hbGl6ZUtleShrZXkpLCB2YWx1ZSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gUmVtb3ZlIHN0eWxlIHByb3BlcnRpZXMgdGhhdCBubyBsb25nZXIgZXhpc3Rcblx0XHRcdGZvciAodmFyIGtleSBpbiBvbGQpIHtcblx0XHRcdFx0aWYgKG9sZFtrZXldICE9IG51bGwgJiYgc3R5bGVba2V5XSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShub3JtYWxpemVLZXkoa2V5KSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIEhlcmUncyBhbiBleHBsYW5hdGlvbiBvZiBob3cgdGhpcyB3b3Jrczpcblx0Ly8gMS4gVGhlIGV2ZW50IG5hbWVzIGFyZSBhbHdheXMgKGJ5IGRlc2lnbikgcHJlZml4ZWQgYnkgYG9uYC5cblx0Ly8gMi4gVGhlIEV2ZW50TGlzdGVuZXIgaW50ZXJmYWNlIGFjY2VwdHMgZWl0aGVyIGEgZnVuY3Rpb24gb3IgYW4gb2JqZWN0XG5cdC8vICAgIHdpdGggYSBgaGFuZGxlRXZlbnRgIG1ldGhvZC5cblx0Ly8gMy4gVGhlIG9iamVjdCBkb2VzIG5vdCBpbmhlcml0IGZyb20gYE9iamVjdC5wcm90b3R5cGVgLCB0byBhdm9pZFxuXHQvLyAgICBhbnkgcG90ZW50aWFsIGludGVyZmVyZW5jZSB3aXRoIHRoYXQgKGUuZy4gc2V0dGVycykuXG5cdC8vIDQuIFRoZSBldmVudCBuYW1lIGlzIHJlbWFwcGVkIHRvIHRoZSBoYW5kbGVyIGJlZm9yZSBjYWxsaW5nIGl0LlxuXHQvLyA1LiBJbiBmdW5jdGlvbi1iYXNlZCBldmVudCBoYW5kbGVycywgYGV2LnRhcmdldCA9PT0gdGhpc2AuIFdlIHJlcGxpY2F0ZVxuXHQvLyAgICB0aGF0IGJlbG93LlxuXHQvLyA2LiBJbiBmdW5jdGlvbi1iYXNlZCBldmVudCBoYW5kbGVycywgYHJldHVybiBmYWxzZWAgcHJldmVudHMgdGhlIGRlZmF1bHRcblx0Ly8gICAgYWN0aW9uIGFuZCBzdG9wcyBldmVudCBwcm9wYWdhdGlvbi4gV2UgcmVwbGljYXRlIHRoYXQgYmVsb3cuXG5cdGZ1bmN0aW9uIEV2ZW50RGljdCgpIHtcblx0XHQvLyBTYXZlIHRoaXMsIHNvIHRoZSBjdXJyZW50IHJlZHJhdyBpcyBjb3JyZWN0bHkgdHJhY2tlZC5cblx0XHR0aGlzLl8gPSBjdXJyZW50UmVkcmF3XG5cdH1cblx0RXZlbnREaWN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0RXZlbnREaWN0LnByb3RvdHlwZS5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uIChldikge1xuXHRcdHZhciBoYW5kbGVyID0gdGhpc1tcIm9uXCIgKyBldi50eXBlXVxuXHRcdHZhciByZXN1bHRcblx0XHRpZiAodHlwZW9mIGhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikgcmVzdWx0ID0gaGFuZGxlci5jYWxsKGV2LmN1cnJlbnRUYXJnZXQsIGV2KVxuXHRcdGVsc2UgaWYgKHR5cGVvZiBoYW5kbGVyLmhhbmRsZUV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIGhhbmRsZXIuaGFuZGxlRXZlbnQoZXYpXG5cdFx0aWYgKHRoaXMuXyAmJiBldi5yZWRyYXcgIT09IGZhbHNlKSAoMCwgdGhpcy5fKSgpXG5cdFx0aWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdGV2LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0fVxuXHR9XG5cblx0Ly9ldmVudFxuXHRmdW5jdGlvbiB1cGRhdGVFdmVudCh2bm9kZSwga2V5LCB2YWx1ZSkge1xuXHRcdGlmICh2bm9kZS5ldmVudHMgIT0gbnVsbCkge1xuXHRcdFx0aWYgKHZub2RlLmV2ZW50c1trZXldID09PSB2YWx1ZSkgcmV0dXJuXG5cdFx0XHRpZiAodmFsdWUgIT0gbnVsbCAmJiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSkge1xuXHRcdFx0XHRpZiAodm5vZGUuZXZlbnRzW2tleV0gPT0gbnVsbCkgdm5vZGUuZG9tLmFkZEV2ZW50TGlzdGVuZXIoa2V5LnNsaWNlKDIpLCB2bm9kZS5ldmVudHMsIGZhbHNlKVxuXHRcdFx0XHR2bm9kZS5ldmVudHNba2V5XSA9IHZhbHVlXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAodm5vZGUuZXZlbnRzW2tleV0gIT0gbnVsbCkgdm5vZGUuZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoa2V5LnNsaWNlKDIpLCB2bm9kZS5ldmVudHMsIGZhbHNlKVxuXHRcdFx0XHR2bm9kZS5ldmVudHNba2V5XSA9IHVuZGVmaW5lZFxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCAmJiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSkge1xuXHRcdFx0dm5vZGUuZXZlbnRzID0gbmV3IEV2ZW50RGljdCgpXG5cdFx0XHR2bm9kZS5kb20uYWRkRXZlbnRMaXN0ZW5lcihrZXkuc2xpY2UoMiksIHZub2RlLmV2ZW50cywgZmFsc2UpXG5cdFx0XHR2bm9kZS5ldmVudHNba2V5XSA9IHZhbHVlXG5cdFx0fVxuXHR9XG5cblx0Ly9saWZlY3ljbGVcblx0ZnVuY3Rpb24gaW5pdExpZmVjeWNsZShzb3VyY2UsIHZub2RlLCBob29rcykge1xuXHRcdGlmICh0eXBlb2Ygc291cmNlLm9uaW5pdCA9PT0gXCJmdW5jdGlvblwiKSBjYWxsSG9vay5jYWxsKHNvdXJjZS5vbmluaXQsIHZub2RlKVxuXHRcdGlmICh0eXBlb2Ygc291cmNlLm9uY3JlYXRlID09PSBcImZ1bmN0aW9uXCIpIGhvb2tzLnB1c2goY2FsbEhvb2suYmluZChzb3VyY2Uub25jcmVhdGUsIHZub2RlKSlcblx0fVxuXHRmdW5jdGlvbiB1cGRhdGVMaWZlY3ljbGUoc291cmNlLCB2bm9kZSwgaG9va3MpIHtcblx0XHRpZiAodHlwZW9mIHNvdXJjZS5vbnVwZGF0ZSA9PT0gXCJmdW5jdGlvblwiKSBob29rcy5wdXNoKGNhbGxIb29rLmJpbmQoc291cmNlLm9udXBkYXRlLCB2bm9kZSkpXG5cdH1cblx0ZnVuY3Rpb24gc2hvdWxkTm90VXBkYXRlKHZub2RlLCBvbGQpIHtcblx0XHRkbyB7XG5cdFx0XHRpZiAodm5vZGUuYXR0cnMgIT0gbnVsbCAmJiB0eXBlb2Ygdm5vZGUuYXR0cnMub25iZWZvcmV1cGRhdGUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHR2YXIgZm9yY2UgPSBjYWxsSG9vay5jYWxsKHZub2RlLmF0dHJzLm9uYmVmb3JldXBkYXRlLCB2bm9kZSwgb2xkKVxuXHRcdFx0XHRpZiAoZm9yY2UgIT09IHVuZGVmaW5lZCAmJiAhZm9yY2UpIGJyZWFrXG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIHZub2RlLnRhZyAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2Ygdm5vZGUuc3RhdGUub25iZWZvcmV1cGRhdGUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHR2YXIgZm9yY2UgPSBjYWxsSG9vay5jYWxsKHZub2RlLnN0YXRlLm9uYmVmb3JldXBkYXRlLCB2bm9kZSwgb2xkKVxuXHRcdFx0XHRpZiAoZm9yY2UgIT09IHVuZGVmaW5lZCAmJiAhZm9yY2UpIGJyZWFrXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHR9IHdoaWxlIChmYWxzZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG5cdFx0dm5vZGUuZG9tID0gb2xkLmRvbVxuXHRcdHZub2RlLmRvbVNpemUgPSBvbGQuZG9tU2l6ZVxuXHRcdHZub2RlLmluc3RhbmNlID0gb2xkLmluc3RhbmNlXG5cdFx0Ly8gT25lIHdvdWxkIHRoaW5rIGhhdmluZyB0aGUgYWN0dWFsIGxhdGVzdCBhdHRyaWJ1dGVzIHdvdWxkIGJlIGlkZWFsLFxuXHRcdC8vIGJ1dCBpdCBkb2Vzbid0IGxldCB1cyBwcm9wZXJseSBkaWZmIGJhc2VkIG9uIG91ciBjdXJyZW50IGludGVybmFsXG5cdFx0Ly8gcmVwcmVzZW50YXRpb24uIFdlIGhhdmUgdG8gc2F2ZSBub3Qgb25seSB0aGUgb2xkIERPTSBpbmZvLCBidXQgYWxzb1xuXHRcdC8vIHRoZSBhdHRyaWJ1dGVzIHVzZWQgdG8gY3JlYXRlIGl0LCBhcyB3ZSBkaWZmICp0aGF0Kiwgbm90IGFnYWluc3QgdGhlXG5cdFx0Ly8gRE9NIGRpcmVjdGx5ICh3aXRoIGEgZmV3IGV4Y2VwdGlvbnMgaW4gYHNldEF0dHJgKS4gQW5kLCBvZiBjb3Vyc2UsIHdlXG5cdFx0Ly8gbmVlZCB0byBzYXZlIHRoZSBjaGlsZHJlbiBhbmQgdGV4dCBhcyB0aGV5IGFyZSBjb25jZXB0dWFsbHkgbm90XG5cdFx0Ly8gdW5saWtlIHNwZWNpYWwgXCJhdHRyaWJ1dGVzXCIgaW50ZXJuYWxseS5cblx0XHR2bm9kZS5hdHRycyA9IG9sZC5hdHRyc1xuXHRcdHZub2RlLmNoaWxkcmVuID0gb2xkLmNoaWxkcmVuXG5cdFx0dm5vZGUudGV4dCA9IG9sZC50ZXh0XG5cdFx0cmV0dXJuIHRydWVcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbihkb20sIHZub2RlcywgcmVkcmF3KSB7XG5cdFx0aWYgKCFkb20pIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFbnN1cmUgdGhlIERPTSBlbGVtZW50IGJlaW5nIHBhc3NlZCB0byBtLnJvdXRlL20ubW91bnQvbS5yZW5kZXIgaXMgbm90IHVuZGVmaW5lZC5cIilcblx0XHR2YXIgaG9va3MgPSBbXVxuXHRcdHZhciBhY3RpdmUgPSBhY3RpdmVFbGVtZW50KClcblx0XHR2YXIgbmFtZXNwYWNlID0gZG9tLm5hbWVzcGFjZVVSSVxuXG5cdFx0Ly8gRmlyc3QgdGltZSByZW5kZXJpbmcgaW50byBhIG5vZGUgY2xlYXJzIGl0IG91dFxuXHRcdGlmIChkb20udm5vZGVzID09IG51bGwpIGRvbS50ZXh0Q29udGVudCA9IFwiXCJcblxuXHRcdHZub2RlcyA9IFZub2RlLm5vcm1hbGl6ZUNoaWxkcmVuKEFycmF5LmlzQXJyYXkodm5vZGVzKSA/IHZub2RlcyA6IFt2bm9kZXNdKVxuXHRcdHZhciBwcmV2UmVkcmF3ID0gY3VycmVudFJlZHJhd1xuXHRcdHRyeSB7XG5cdFx0XHRjdXJyZW50UmVkcmF3ID0gdHlwZW9mIHJlZHJhdyA9PT0gXCJmdW5jdGlvblwiID8gcmVkcmF3IDogdW5kZWZpbmVkXG5cdFx0XHR1cGRhdGVOb2Rlcyhkb20sIGRvbS52bm9kZXMsIHZub2RlcywgaG9va3MsIG51bGwsIG5hbWVzcGFjZSA9PT0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIgPyB1bmRlZmluZWQgOiBuYW1lc3BhY2UpXG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdGN1cnJlbnRSZWRyYXcgPSBwcmV2UmVkcmF3XG5cdFx0fVxuXHRcdGRvbS52bm9kZXMgPSB2bm9kZXNcblx0XHQvLyBgZG9jdW1lbnQuYWN0aXZlRWxlbWVudGAgY2FuIHJldHVybiBudWxsOiBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbnRlcmFjdGlvbi5odG1sI2RvbS1kb2N1bWVudC1hY3RpdmVlbGVtZW50XG5cdFx0aWYgKGFjdGl2ZSAhPSBudWxsICYmIGFjdGl2ZUVsZW1lbnQoKSAhPT0gYWN0aXZlICYmIHR5cGVvZiBhY3RpdmUuZm9jdXMgPT09IFwiZnVuY3Rpb25cIikgYWN0aXZlLmZvY3VzKClcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvb2tzLmxlbmd0aDsgaSsrKSBob29rc1tpXSgpXG5cdH1cbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBWbm9kZSA9IHJlcXVpcmUoXCIuLi9yZW5kZXIvdm5vZGVcIilcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihodG1sKSB7XG5cdGlmIChodG1sID09IG51bGwpIGh0bWwgPSBcIlwiXG5cdHJldHVybiBWbm9kZShcIjxcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGh0bWwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxuZnVuY3Rpb24gVm5vZGUodGFnLCBrZXksIGF0dHJzLCBjaGlsZHJlbiwgdGV4dCwgZG9tKSB7XG5cdHJldHVybiB7dGFnOiB0YWcsIGtleToga2V5LCBhdHRyczogYXR0cnMsIGNoaWxkcmVuOiBjaGlsZHJlbiwgdGV4dDogdGV4dCwgZG9tOiBkb20sIGRvbVNpemU6IHVuZGVmaW5lZCwgc3RhdGU6IHVuZGVmaW5lZCwgZXZlbnRzOiB1bmRlZmluZWQsIGluc3RhbmNlOiB1bmRlZmluZWR9XG59XG5Wbm9kZS5ub3JtYWxpemUgPSBmdW5jdGlvbihub2RlKSB7XG5cdGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSByZXR1cm4gVm5vZGUoXCJbXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBWbm9kZS5ub3JtYWxpemVDaGlsZHJlbihub2RlKSwgdW5kZWZpbmVkLCB1bmRlZmluZWQpXG5cdGlmIChub2RlID09IG51bGwgfHwgdHlwZW9mIG5vZGUgPT09IFwiYm9vbGVhblwiKSByZXR1cm4gbnVsbFxuXHRpZiAodHlwZW9mIG5vZGUgPT09IFwib2JqZWN0XCIpIHJldHVybiBub2RlXG5cdHJldHVybiBWbm9kZShcIiNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFN0cmluZyhub2RlKSwgdW5kZWZpbmVkLCB1bmRlZmluZWQpXG59XG5Wbm9kZS5ub3JtYWxpemVDaGlsZHJlbiA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdHZhciBjaGlsZHJlbiA9IFtdXG5cdGlmIChpbnB1dC5sZW5ndGgpIHtcblx0XHR2YXIgaXNLZXllZCA9IGlucHV0WzBdICE9IG51bGwgJiYgaW5wdXRbMF0ua2V5ICE9IG51bGxcblx0XHQvLyBOb3RlOiB0aGlzIGlzIGEgKnZlcnkqIHBlcmYtc2Vuc2l0aXZlIGNoZWNrLlxuXHRcdC8vIEZ1biBmYWN0OiBtZXJnaW5nIHRoZSBsb29wIGxpa2UgdGhpcyBpcyBzb21laG93IGZhc3RlciB0aGFuIHNwbGl0dGluZ1xuXHRcdC8vIGl0LCBub3RpY2VhYmx5IHNvLlxuXHRcdGZvciAodmFyIGkgPSAxOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICgoaW5wdXRbaV0gIT0gbnVsbCAmJiBpbnB1dFtpXS5rZXkgIT0gbnVsbCkgIT09IGlzS2V5ZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcIlZub2RlcyBtdXN0IGVpdGhlciBhbHdheXMgaGF2ZSBrZXlzIG9yIG5ldmVyIGhhdmUga2V5cyFcIilcblx0XHRcdH1cblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y2hpbGRyZW5baV0gPSBWbm9kZS5ub3JtYWxpemUoaW5wdXRbaV0pXG5cdFx0fVxuXHR9XG5cdHJldHVybiBjaGlsZHJlblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZub2RlXG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgUHJvbWlzZVBvbHlmaWxsID0gcmVxdWlyZShcIi4vcHJvbWlzZS9wcm9taXNlXCIpXG52YXIgbW91bnRSZWRyYXcgPSByZXF1aXJlKFwiLi9tb3VudC1yZWRyYXdcIilcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9yZXF1ZXN0L3JlcXVlc3RcIikod2luZG93LCBQcm9taXNlUG9seWZpbGwsIG1vdW50UmVkcmF3LnJlZHJhdylcbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBidWlsZFBhdGhuYW1lID0gcmVxdWlyZShcIi4uL3BhdGhuYW1lL2J1aWxkXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHdpbmRvdywgUHJvbWlzZSwgb25jb21wbGV0aW9uKSB7XG5cdHZhciBjYWxsYmFja0NvdW50ID0gMFxuXG5cdGZ1bmN0aW9uIFByb21pc2VQcm94eShleGVjdXRvcikge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShleGVjdXRvcilcblx0fVxuXG5cdC8vIEluIGNhc2UgdGhlIGdsb2JhbCBQcm9taXNlIGlzIHNvbWUgdXNlcmxhbmQgbGlicmFyeSdzIHdoZXJlIHRoZXkgcmVseSBvblxuXHQvLyBgZm9vIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3RvcmAsIGB0aGlzLmNvbnN0cnVjdG9yLnJlc29sdmUodmFsdWUpYCwgb3Jcblx0Ly8gc2ltaWxhci4gTGV0J3MgKm5vdCogYnJlYWsgdGhlbS5cblx0UHJvbWlzZVByb3h5LnByb3RvdHlwZSA9IFByb21pc2UucHJvdG90eXBlXG5cdFByb21pc2VQcm94eS5fX3Byb3RvX18gPSBQcm9taXNlIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcHJvdG9cblxuXHRmdW5jdGlvbiBtYWtlUmVxdWVzdChmYWN0b3J5KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHVybCwgYXJncykge1xuXHRcdFx0aWYgKHR5cGVvZiB1cmwgIT09IFwic3RyaW5nXCIpIHsgYXJncyA9IHVybDsgdXJsID0gdXJsLnVybCB9XG5cdFx0XHRlbHNlIGlmIChhcmdzID09IG51bGwpIGFyZ3MgPSB7fVxuXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdFx0ZmFjdG9yeShidWlsZFBhdGhuYW1lKHVybCwgYXJncy5wYXJhbXMpLCBhcmdzLCBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgYXJncy50eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdGRhdGFbaV0gPSBuZXcgYXJncy50eXBlKGRhdGFbaV0pXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgZGF0YSA9IG5ldyBhcmdzLnR5cGUoZGF0YSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzb2x2ZShkYXRhKVxuXHRcdFx0XHR9LCByZWplY3QpXG5cdFx0XHR9KVxuXHRcdFx0aWYgKGFyZ3MuYmFja2dyb3VuZCA9PT0gdHJ1ZSkgcmV0dXJuIHByb21pc2Vcblx0XHRcdHZhciBjb3VudCA9IDBcblx0XHRcdGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuXHRcdFx0XHRpZiAoLS1jb3VudCA9PT0gMCAmJiB0eXBlb2Ygb25jb21wbGV0aW9uID09PSBcImZ1bmN0aW9uXCIpIG9uY29tcGxldGlvbigpXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB3cmFwKHByb21pc2UpXG5cblx0XHRcdGZ1bmN0aW9uIHdyYXAocHJvbWlzZSkge1xuXHRcdFx0XHR2YXIgdGhlbiA9IHByb21pc2UudGhlblxuXHRcdFx0XHQvLyBTZXQgdGhlIGNvbnN0cnVjdG9yLCBzbyBlbmdpbmVzIGtub3cgdG8gbm90IGF3YWl0IG9yIHJlc29sdmVcblx0XHRcdFx0Ly8gdGhpcyBhcyBhIG5hdGl2ZSBwcm9taXNlLiBBdCB0aGUgdGltZSBvZiB3cml0aW5nLCB0aGlzIGlzXG5cdFx0XHRcdC8vIG9ubHkgbmVjZXNzYXJ5IGZvciBWOCwgYnV0IHRoZWlyIGJlaGF2aW9yIGlzIHRoZSBjb3JyZWN0XG5cdFx0XHRcdC8vIGJlaGF2aW9yIHBlciBzcGVjLiBTZWUgdGhpcyBzcGVjIGlzc3VlIGZvciBtb3JlIGRldGFpbHM6XG5cdFx0XHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L2VjbWEyNjIvaXNzdWVzLzE1NzcuIEFsc28sIHNlZSB0aGVcblx0XHRcdFx0Ly8gY29ycmVzcG9uZGluZyBjb21tZW50IGluIGByZXF1ZXN0L3Rlc3RzL3Rlc3QtcmVxdWVzdC5qc2AgZm9yXG5cdFx0XHRcdC8vIGEgYml0IG1vcmUgYmFja2dyb3VuZCBvbiB0aGUgaXNzdWUgYXQgaGFuZC5cblx0XHRcdFx0cHJvbWlzZS5jb25zdHJ1Y3RvciA9IFByb21pc2VQcm94eVxuXHRcdFx0XHRwcm9taXNlLnRoZW4gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjb3VudCsrXG5cdFx0XHRcdFx0dmFyIG5leHQgPSB0aGVuLmFwcGx5KHByb21pc2UsIGFyZ3VtZW50cylcblx0XHRcdFx0XHRuZXh0LnRoZW4oY29tcGxldGUsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRcdGNvbXBsZXRlKClcblx0XHRcdFx0XHRcdGlmIChjb3VudCA9PT0gMCkgdGhyb3cgZVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0cmV0dXJuIHdyYXAobmV4dClcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcHJvbWlzZVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGhhc0hlYWRlcihhcmdzLCBuYW1lKSB7XG5cdFx0Zm9yICh2YXIga2V5IGluIGFyZ3MuaGVhZGVycykge1xuXHRcdFx0aWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoYXJncy5oZWFkZXJzLCBrZXkpICYmIG5hbWUudGVzdChrZXkpKSByZXR1cm4gdHJ1ZVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0cmVxdWVzdDogbWFrZVJlcXVlc3QoZnVuY3Rpb24odXJsLCBhcmdzLCByZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdHZhciBtZXRob2QgPSBhcmdzLm1ldGhvZCAhPSBudWxsID8gYXJncy5tZXRob2QudG9VcHBlckNhc2UoKSA6IFwiR0VUXCJcblx0XHRcdHZhciBib2R5ID0gYXJncy5ib2R5XG5cdFx0XHR2YXIgYXNzdW1lSlNPTiA9IChhcmdzLnNlcmlhbGl6ZSA9PSBudWxsIHx8IGFyZ3Muc2VyaWFsaXplID09PSBKU09OLnNlcmlhbGl6ZSkgJiYgIShib2R5IGluc3RhbmNlb2YgJHdpbmRvdy5Gb3JtRGF0YSlcblx0XHRcdHZhciByZXNwb25zZVR5cGUgPSBhcmdzLnJlc3BvbnNlVHlwZSB8fCAodHlwZW9mIGFyZ3MuZXh0cmFjdCA9PT0gXCJmdW5jdGlvblwiID8gXCJcIiA6IFwianNvblwiKVxuXG5cdFx0XHR2YXIgeGhyID0gbmV3ICR3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKSwgYWJvcnRlZCA9IGZhbHNlXG5cdFx0XHR2YXIgb3JpZ2luYWwgPSB4aHIsIHJlcGxhY2VkQWJvcnRcblx0XHRcdHZhciBhYm9ydCA9IHhoci5hYm9ydFxuXG5cdFx0XHR4aHIuYWJvcnQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0YWJvcnRlZCA9IHRydWVcblx0XHRcdFx0YWJvcnQuY2FsbCh0aGlzKVxuXHRcdFx0fVxuXG5cdFx0XHR4aHIub3BlbihtZXRob2QsIHVybCwgYXJncy5hc3luYyAhPT0gZmFsc2UsIHR5cGVvZiBhcmdzLnVzZXIgPT09IFwic3RyaW5nXCIgPyBhcmdzLnVzZXIgOiB1bmRlZmluZWQsIHR5cGVvZiBhcmdzLnBhc3N3b3JkID09PSBcInN0cmluZ1wiID8gYXJncy5wYXNzd29yZCA6IHVuZGVmaW5lZClcblxuXHRcdFx0aWYgKGFzc3VtZUpTT04gJiYgYm9keSAhPSBudWxsICYmICFoYXNIZWFkZXIoYXJncywgL15jb250ZW50LXR5cGUkL2kpKSB7XG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKVxuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiBhcmdzLmRlc2VyaWFsaXplICE9PSBcImZ1bmN0aW9uXCIgJiYgIWhhc0hlYWRlcihhcmdzLCAvXmFjY2VwdCQvaSkpIHtcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIilcblx0XHRcdH1cblx0XHRcdGlmIChhcmdzLndpdGhDcmVkZW50aWFscykgeGhyLndpdGhDcmVkZW50aWFscyA9IGFyZ3Mud2l0aENyZWRlbnRpYWxzXG5cdFx0XHRpZiAoYXJncy50aW1lb3V0KSB4aHIudGltZW91dCA9IGFyZ3MudGltZW91dFxuXHRcdFx0eGhyLnJlc3BvbnNlVHlwZSA9IHJlc3BvbnNlVHlwZVxuXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJncy5oZWFkZXJzKSB7XG5cdFx0XHRcdGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyZ3MuaGVhZGVycywga2V5KSkge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgYXJncy5oZWFkZXJzW2tleV0pXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKGV2KSB7XG5cdFx0XHRcdC8vIERvbid0IHRocm93IGVycm9ycyBvbiB4aHIuYWJvcnQoKS5cblx0XHRcdFx0aWYgKGFib3J0ZWQpIHJldHVyblxuXG5cdFx0XHRcdGlmIChldi50YXJnZXQucmVhZHlTdGF0ZSA9PT0gNCkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHR2YXIgc3VjY2VzcyA9IChldi50YXJnZXQuc3RhdHVzID49IDIwMCAmJiBldi50YXJnZXQuc3RhdHVzIDwgMzAwKSB8fCBldi50YXJnZXQuc3RhdHVzID09PSAzMDQgfHwgKC9eZmlsZTpcXC9cXC8vaSkudGVzdCh1cmwpXG5cdFx0XHRcdFx0XHQvLyBXaGVuIHRoZSByZXNwb25zZSB0eXBlIGlzbid0IFwiXCIgb3IgXCJ0ZXh0XCIsXG5cdFx0XHRcdFx0XHQvLyBgeGhyLnJlc3BvbnNlVGV4dGAgaXMgdGhlIHdyb25nIHRoaW5nIHRvIHVzZS5cblx0XHRcdFx0XHRcdC8vIEJyb3dzZXJzIGRvIHRoZSByaWdodCB0aGluZyBhbmQgdGhyb3cgaGVyZSwgYW5kIHdlXG5cdFx0XHRcdFx0XHQvLyBzaG91bGQgaG9ub3IgdGhhdCBhbmQgZG8gdGhlIHJpZ2h0IHRoaW5nIGJ5XG5cdFx0XHRcdFx0XHQvLyBwcmVmZXJyaW5nIGB4aHIucmVzcG9uc2VgIHdoZXJlIHBvc3NpYmxlL3ByYWN0aWNhbC5cblx0XHRcdFx0XHRcdHZhciByZXNwb25zZSA9IGV2LnRhcmdldC5yZXNwb25zZSwgbWVzc2FnZVxuXG5cdFx0XHRcdFx0XHRpZiAocmVzcG9uc2VUeXBlID09PSBcImpzb25cIikge1xuXHRcdFx0XHRcdFx0XHQvLyBGb3IgSUUgYW5kIEVkZ2UsIHdoaWNoIGRvbid0IGltcGxlbWVudFxuXHRcdFx0XHRcdFx0XHQvLyBgcmVzcG9uc2VUeXBlOiBcImpzb25cImAuXG5cdFx0XHRcdFx0XHRcdGlmICghZXYudGFyZ2V0LnJlc3BvbnNlVHlwZSAmJiB0eXBlb2YgYXJncy5leHRyYWN0ICE9PSBcImZ1bmN0aW9uXCIpIHJlc3BvbnNlID0gSlNPTi5wYXJzZShldi50YXJnZXQucmVzcG9uc2VUZXh0KVxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICghcmVzcG9uc2VUeXBlIHx8IHJlc3BvbnNlVHlwZSA9PT0gXCJ0ZXh0XCIpIHtcblx0XHRcdFx0XHRcdFx0Ly8gT25seSB1c2UgdGhpcyBkZWZhdWx0IGlmIGl0J3MgdGV4dC4gSWYgYSBwYXJzZWRcblx0XHRcdFx0XHRcdFx0Ly8gZG9jdW1lbnQgaXMgbmVlZGVkIG9uIG9sZCBJRSBhbmQgZnJpZW5kcyAoYWxsXG5cdFx0XHRcdFx0XHRcdC8vIHVuc3VwcG9ydGVkKSwgdGhlIHVzZXIgc2hvdWxkIHVzZSBhIGN1c3RvbVxuXHRcdFx0XHRcdFx0XHQvLyBgY29uZmlnYCBpbnN0ZWFkLiBUaGV5J3JlIGFscmVhZHkgdXNpbmcgdGhpcyBhdFxuXHRcdFx0XHRcdFx0XHQvLyB0aGVpciBvd24gcmlzay5cblx0XHRcdFx0XHRcdFx0aWYgKHJlc3BvbnNlID09IG51bGwpIHJlc3BvbnNlID0gZXYudGFyZ2V0LnJlc3BvbnNlVGV4dFxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGFyZ3MuZXh0cmFjdCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNlID0gYXJncy5leHRyYWN0KGV2LnRhcmdldCwgYXJncylcblx0XHRcdFx0XHRcdFx0c3VjY2VzcyA9IHRydWVcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGFyZ3MuZGVzZXJpYWxpemUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRcdFx0XHRyZXNwb25zZSA9IGFyZ3MuZGVzZXJpYWxpemUocmVzcG9uc2UpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoc3VjY2VzcykgcmVzb2x2ZShyZXNwb25zZSlcblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0cnkgeyBtZXNzYWdlID0gZXYudGFyZ2V0LnJlc3BvbnNlVGV4dCB9XG5cdFx0XHRcdFx0XHRcdGNhdGNoIChlKSB7IG1lc3NhZ2UgPSByZXNwb25zZSB9XG5cdFx0XHRcdFx0XHRcdHZhciBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKVxuXHRcdFx0XHRcdFx0XHRlcnJvci5jb2RlID0gZXYudGFyZ2V0LnN0YXR1c1xuXHRcdFx0XHRcdFx0XHRlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlXG5cdFx0XHRcdFx0XHRcdHJlamVjdChlcnJvcilcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdHJlamVjdChlKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZW9mIGFyZ3MuY29uZmlnID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0eGhyID0gYXJncy5jb25maWcoeGhyLCBhcmdzLCB1cmwpIHx8IHhoclxuXG5cdFx0XHRcdC8vIFByb3BhZ2F0ZSB0aGUgYGFib3J0YCB0byBhbnkgcmVwbGFjZW1lbnQgWEhSIGFzIHdlbGwuXG5cdFx0XHRcdGlmICh4aHIgIT09IG9yaWdpbmFsKSB7XG5cdFx0XHRcdFx0cmVwbGFjZWRBYm9ydCA9IHhoci5hYm9ydFxuXHRcdFx0XHRcdHhoci5hYm9ydCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0YWJvcnRlZCA9IHRydWVcblx0XHRcdFx0XHRcdHJlcGxhY2VkQWJvcnQuY2FsbCh0aGlzKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYm9keSA9PSBudWxsKSB4aHIuc2VuZCgpXG5cdFx0XHRlbHNlIGlmICh0eXBlb2YgYXJncy5zZXJpYWxpemUgPT09IFwiZnVuY3Rpb25cIikgeGhyLnNlbmQoYXJncy5zZXJpYWxpemUoYm9keSkpXG5cdFx0XHRlbHNlIGlmIChib2R5IGluc3RhbmNlb2YgJHdpbmRvdy5Gb3JtRGF0YSkgeGhyLnNlbmQoYm9keSlcblx0XHRcdGVsc2UgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoYm9keSkpXG5cdFx0fSksXG5cdFx0anNvbnA6IG1ha2VSZXF1ZXN0KGZ1bmN0aW9uKHVybCwgYXJncywgcmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHR2YXIgY2FsbGJhY2tOYW1lID0gYXJncy5jYWxsYmFja05hbWUgfHwgXCJfbWl0aHJpbF9cIiArIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlMTYpICsgXCJfXCIgKyBjYWxsYmFja0NvdW50Kytcblx0XHRcdHZhciBzY3JpcHQgPSAkd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIilcblx0XHRcdCR3aW5kb3dbY2FsbGJhY2tOYW1lXSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0ZGVsZXRlICR3aW5kb3dbY2FsbGJhY2tOYW1lXVxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpXG5cdFx0XHRcdHJlc29sdmUoZGF0YSlcblx0XHRcdH1cblx0XHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRlbGV0ZSAkd2luZG93W2NhbGxiYWNrTmFtZV1cblx0XHRcdFx0c2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuXHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiSlNPTlAgcmVxdWVzdCBmYWlsZWRcIikpXG5cdFx0XHR9XG5cdFx0XHRzY3JpcHQuc3JjID0gdXJsICsgKHVybC5pbmRleE9mKFwiP1wiKSA8IDAgPyBcIj9cIiA6IFwiJlwiKSArXG5cdFx0XHRcdGVuY29kZVVSSUNvbXBvbmVudChhcmdzLmNhbGxiYWNrS2V5IHx8IFwiY2FsbGJhY2tcIikgKyBcIj1cIiArXG5cdFx0XHRcdGVuY29kZVVSSUNvbXBvbmVudChjYWxsYmFja05hbWUpXG5cdFx0XHQkd2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChzY3JpcHQpXG5cdFx0fSksXG5cdH1cbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBtb3VudFJlZHJhdyA9IHJlcXVpcmUoXCIuL21vdW50LXJlZHJhd1wiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2FwaS9yb3V0ZXJcIikod2luZG93LCBtb3VudFJlZHJhdylcbiIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnXHJcblxyXG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tICcuL0hlYWRlci9IZWFkZXIuanN4J1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcCB7XHJcbiAgICB2aWV3KCl7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxIZWFkZXIvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcclxuXHJcbmltcG9ydCAnLi9faGVhZGVyLnNjc3MnXHJcblxyXG5leHBvcnQgY2xhc3MgSGVhZGVye1xyXG4gICAgdmlldygpe1xyXG4gICAgICAgIHJldHVybihcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J21haW5fYXJlYSc+XHJcblxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxufSIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiLypJTVBPUlRTKi9cXG4vKklNUE9SVFMqL1xcbi8qSEVBREVSKi9cXG4ubWFpbl9hcmVhIHtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGhlaWdodDogNDUuNDE3dnc7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDI1MCwgMjUxLCAyNTUsIDAuNyk7XFxuICBvcGFjaXR5OiAwLjk7XFxuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNDRweCk7XFxufVxcblxcbi8qSEVBREVSKi9cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvdmlldy9Db21wb25lbnRzL0hlYWRlci9faGVhZGVyLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsVUFBQTtBQUlBLFVBQUE7QUFFQSxTQUFBO0FBQ0E7RUFDSSxZQUFBO0VBQ0EsZ0JBQUE7RUFDQSxvQ0FBQTtFQUNBLFlBQUE7RUFDQSwyQkFBQTtBQUhKOztBQUtBLFNBQUFcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLypJTVBPUlRTKi9cXHJcXG5AaW1wb3J0ICcuLi9wYWRkaW5nJztcXHJcXG5AaW1wb3J0ICcuLi9wYWxldHRlJztcXHJcXG5AaW1wb3J0ICcuLi9zaXplJztcXHJcXG4vKklNUE9SVFMqL1xcclxcblxcclxcbi8qSEVBREVSKi9cXHJcXG4ubWFpbl9hcmVhe1xcclxcbiAgICB3aWR0aDogdG9WdygxOTIwKTtcXHJcXG4gICAgaGVpZ2h0OiB0b1Z3KDg3Mik7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMjUwLCAyNTEsIDI1NSwgMC43KTtcXHJcXG4gICAgb3BhY2l0eTogMC45O1xcclxcbiAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNDRweCk7XFxyXFxufVxcclxcbi8qSEVBREVSKi9cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMV0hLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsyXSEuL19oZWFkZXIuc2Nzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsxXSEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzJdIS4vX2hlYWRlci5zY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuXG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcblxuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cblxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG5cbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG5cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG5cbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG5cbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG5cbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpOyAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG5cbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG5cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuXG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cblxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG5cbiAgY3NzICs9IG9iai5jc3M7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cblxuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImxldCBtID0gcmVxdWlyZSgnbWl0aHJpbCcpO1xyXG52YXIgcm9vdCA9IGRvY3VtZW50LmJvZHk7XHJcblxyXG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuL3ZpZXcvQ29tcG9uZW50cy9BcHAuanN4JztcclxuXHJcbm0ucmVuZGVyKHJvb3QsIFtcclxuICAgIG0oQXBwKSxcclxuXSkiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsImNzc1dpdGhNYXBwaW5nVG9TdHJpbmciLCJsaXN0IiwidG9TdHJpbmciLCJtYXAiLCJpdGVtIiwiY29udGVudCIsIm5lZWRMYXllciIsImNvbmNhdCIsImxlbmd0aCIsImpvaW4iLCJpIiwibW9kdWxlcyIsIm1lZGlhIiwiZGVkdXBlIiwic3VwcG9ydHMiLCJsYXllciIsInVuZGVmaW5lZCIsImFscmVhZHlJbXBvcnRlZE1vZHVsZXMiLCJrIiwiaWQiLCJfayIsInB1c2giLCJjc3NNYXBwaW5nIiwiYnRvYSIsImJhc2U2NCIsInVuZXNjYXBlIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiSlNPTiIsInN0cmluZ2lmeSIsImRhdGEiLCJzb3VyY2VNYXBwaW5nIiwic291cmNlVVJMcyIsInNvdXJjZXMiLCJzb3VyY2UiLCJzb3VyY2VSb290IiwiVm5vZGUiLCJyZXF1aXJlIiwicmVuZGVyIiwic2NoZWR1bGUiLCJjb25zb2xlIiwic3Vic2NyaXB0aW9ucyIsInJlbmRlcmluZyIsInBlbmRpbmciLCJzeW5jIiwiRXJyb3IiLCJyZWRyYXciLCJlIiwiZXJyb3IiLCJtb3VudCIsInJvb3QiLCJjb21wb25lbnQiLCJ2aWV3IiwiVHlwZUVycm9yIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwibSIsIlByb21pc2UiLCJidWlsZFBhdGhuYW1lIiwicGFyc2VQYXRobmFtZSIsImNvbXBpbGVUZW1wbGF0ZSIsImFzc2lnbiIsInNlbnRpbmVsIiwiJHdpbmRvdyIsIm1vdW50UmVkcmF3IiwiZmlyZUFzeW5jIiwic2V0UGF0aCIsInBhdGgiLCJvcHRpb25zIiwic3RhdGUiLCJ0aXRsZSIsInJlcGxhY2UiLCJoaXN0b3J5IiwicmVwbGFjZVN0YXRlIiwicm91dGUiLCJwcmVmaXgiLCJwdXNoU3RhdGUiLCJsb2NhdGlvbiIsImhyZWYiLCJjdXJyZW50UmVzb2x2ZXIiLCJhdHRycyIsImN1cnJlbnRQYXRoIiwibGFzdFVwZGF0ZSIsIlNLSVAiLCJkZWZhdWx0Um91dGUiLCJyb3V0ZXMiLCJjb21waWxlZCIsIk9iamVjdCIsImtleXMiLCJTeW50YXhFcnJvciIsInRlc3QiLCJjaGVjayIsImNhbGxBc3luYyIsInNldEltbWVkaWF0ZSIsInNldFRpbWVvdXQiLCJwIiwicmVzb2x2ZSIsInNjaGVkdWxlZCIsIm9ucmVtb3ZlIiwiZGVmYXVsdERhdGEiLCJzb21lIiwiUmVmZXJlbmNlRXJyb3IiLCJyZXNvbHZlUm91dGUiLCJoYXNoIiwic2VhcmNoIiwicGF0aG5hbWUiLCJkZWNvZGVVUklDb21wb25lbnQiLCJzbGljZSIsInBhcmFtcyIsImZhaWwiLCJsb29wIiwicGF5bG9hZCIsIm1hdGNoZWRSb3V0ZSIsImxvY2FsQ29tcCIsInVwZGF0ZSIsImNvbXAiLCJvbm1hdGNoIiwidGhlbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhZGRFdmVudExpc3RlbmVyIiwib25iZWZvcmV1cGRhdGUiLCJvbmNyZWF0ZSIsInZub2RlIiwia2V5Iiwic2V0IiwiZ2V0IiwiTGluayIsIm9uY2xpY2siLCJzZWxlY3RvciIsIm9uaW5pdCIsIm9udXBkYXRlIiwib25iZWZvcmVyZW1vdmUiLCJjaGlsZCIsImNoaWxkcmVuIiwiZGlzYWJsZWQiLCJCb29sZWFuIiwicmVzdWx0IiwiY2FsbCIsImN1cnJlbnRUYXJnZXQiLCJoYW5kbGVFdmVudCIsImRlZmF1bHRQcmV2ZW50ZWQiLCJidXR0b24iLCJ3aGljaCIsInRhcmdldCIsImN0cmxLZXkiLCJtZXRhS2V5Iiwic2hpZnRLZXkiLCJhbHRLZXkiLCJwcmV2ZW50RGVmYXVsdCIsInBhcmFtIiwiaHlwZXJzY3JpcHQiLCJ0cnVzdCIsImZyYWdtZW50IiwicmVxdWVzdCIsImFwcGx5IiwiYXJndW1lbnRzIiwianNvbnAiLCJwYXJzZVF1ZXJ5U3RyaW5nIiwiYnVpbGRRdWVyeVN0cmluZyIsIlByb21pc2VQb2x5ZmlsbCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZvckVhY2giLCJ0ZW1wbGF0ZSIsInF1ZXJ5SW5kZXgiLCJoYXNoSW5kZXgiLCJxdWVyeUVuZCIsInBhdGhFbmQiLCJxdWVyeSIsInJlc29sdmVkIiwidmFyaWFkaWMiLCJTdHJpbmciLCJuZXdRdWVyeUluZGV4IiwibmV3SGFzaEluZGV4IiwibmV3UXVlcnlFbmQiLCJuZXdQYXRoRW5kIiwicXVlcnlzdHJpbmciLCJ0ZW1wbGF0ZURhdGEiLCJ0ZW1wbGF0ZUtleXMiLCJyZWdleHAiLCJSZWdFeHAiLCJleHRyYSIsInIiLCJ2YWx1ZXMiLCJleGVjIiwidXJsIiwiZXhlY3V0b3IiLCJzZWxmIiwicmVzb2x2ZXJzIiwicmVqZWN0b3JzIiwicmVzb2x2ZUN1cnJlbnQiLCJoYW5kbGVyIiwicmVqZWN0Q3VycmVudCIsImluc3RhbmNlIiwiX2luc3RhbmNlIiwic2hvdWxkQWJzb3JiIiwiZXhlY3V0ZSIsInZhbHVlIiwiZXhlY3V0ZU9uY2UiLCJiaW5kIiwicmV0cnkiLCJydW5zIiwicnVuIiwiZm4iLCJvbmVycm9yIiwicHJvdG90eXBlIiwib25GdWxmaWxsZWQiLCJvblJlamVjdGlvbiIsImhhbmRsZSIsImNhbGxiYWNrIiwibmV4dCIsInJlc29sdmVOZXh0IiwicmVqZWN0TmV4dCIsInByb21pc2UiLCJyZWplY3QiLCJjYXRjaCIsImZpbmFsbHkiLCJyZWFzb24iLCJhbGwiLCJ0b3RhbCIsImNvdW50IiwiY29uc3VtZSIsInJhY2UiLCJ3aW5kb3ciLCJnbG9iYWwiLCJvYmplY3QiLCJhcmdzIiwiZGVzdHJ1Y3R1cmUiLCJBcnJheSIsImlzQXJyYXkiLCJzdHJpbmciLCJjaGFyQXQiLCJlbnRyaWVzIiwic3BsaXQiLCJjb3VudGVycyIsImVudHJ5IiwibGV2ZWxzIiwiY3Vyc29yIiwicG9wIiwiaiIsImxldmVsIiwibmV4dExldmVsIiwiaXNOdW1iZXIiLCJpc05hTiIsInBhcnNlSW50IiwiZGVzYyIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImh5cGVyc2NyaXB0Vm5vZGUiLCJ0YWciLCJub3JtYWxpemVDaGlsZHJlbiIsInNlbGVjdG9yUGFyc2VyIiwic2VsZWN0b3JDYWNoZSIsImhhc093biIsImhhc093blByb3BlcnR5IiwiaXNFbXB0eSIsImNvbXBpbGVTZWxlY3RvciIsIm1hdGNoIiwiY2xhc3NlcyIsInR5cGUiLCJhdHRyVmFsdWUiLCJjbGFzc05hbWUiLCJleGVjU2VsZWN0b3IiLCJoYXNDbGFzcyIsImNsYXNzIiwibmV3QXR0cnMiLCJ0ZXh0Iiwic3RhcnQiLCIkZG9jIiwiZG9jdW1lbnQiLCJjdXJyZW50UmVkcmF3IiwibmFtZVNwYWNlIiwic3ZnIiwibWF0aCIsImdldE5hbWVTcGFjZSIsInhtbG5zIiwiY2hlY2tTdGF0ZSIsIm9yaWdpbmFsIiwiY2FsbEhvb2siLCJhY3RpdmVFbGVtZW50IiwiY3JlYXRlTm9kZXMiLCJwYXJlbnQiLCJ2bm9kZXMiLCJlbmQiLCJob29rcyIsIm5leHRTaWJsaW5nIiwibnMiLCJjcmVhdGVOb2RlIiwiaW5pdExpZmVjeWNsZSIsImNyZWF0ZVRleHQiLCJjcmVhdGVIVE1MIiwiY3JlYXRlRnJhZ21lbnQiLCJjcmVhdGVFbGVtZW50IiwiY3JlYXRlQ29tcG9uZW50IiwiZG9tIiwiY3JlYXRlVGV4dE5vZGUiLCJpbnNlcnROb2RlIiwicG9zc2libGVQYXJlbnRzIiwiY2FwdGlvbiIsInRoZWFkIiwidGJvZHkiLCJ0Zm9vdCIsInRyIiwidGgiLCJ0ZCIsImNvbGdyb3VwIiwiY29sIiwidGVtcCIsImlubmVySFRNTCIsImZpcnN0Q2hpbGQiLCJkb21TaXplIiwiY2hpbGROb2RlcyIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJhcHBlbmRDaGlsZCIsImlzIiwiZWxlbWVudCIsImNyZWF0ZUVsZW1lbnROUyIsInNldEF0dHJzIiwibWF5YmVTZXRDb250ZW50RWRpdGFibGUiLCJ0ZXh0Q29udGVudCIsInNldExhdGVTZWxlY3RBdHRycyIsImluaXRDb21wb25lbnQiLCJjcmVhdGUiLCIkJHJlZW50cmFudExvY2skJCIsIm5vcm1hbGl6ZSIsInVwZGF0ZU5vZGVzIiwib2xkIiwicmVtb3ZlTm9kZXMiLCJpc09sZEtleWVkIiwiaXNLZXllZCIsIm9sZFN0YXJ0IiwiY29tbW9uTGVuZ3RoIiwibyIsInYiLCJnZXROZXh0U2libGluZyIsInJlbW92ZU5vZGUiLCJ1cGRhdGVOb2RlIiwib2xkRW5kIiwib2UiLCJ2ZSIsInRvcFNpYmxpbmciLCJtb3ZlTm9kZXMiLCJvcmlnaW5hbE5leHRTaWJsaW5nIiwidm5vZGVzTGVuZ3RoIiwib2xkSW5kaWNlcyIsImxpIiwicG9zIiwibWF0Y2hlZCIsImxpc0luZGljZXMiLCJnZXRLZXlNYXAiLCJvbGRJbmRleCIsIm1ha2VMaXNJbmRpY2VzIiwib2xkVGFnIiwiZXZlbnRzIiwic2hvdWxkTm90VXBkYXRlIiwidXBkYXRlTGlmZWN5Y2xlIiwidXBkYXRlVGV4dCIsInVwZGF0ZUhUTUwiLCJ1cGRhdGVGcmFnbWVudCIsInVwZGF0ZUVsZW1lbnQiLCJ1cGRhdGVDb21wb25lbnQiLCJub2RlVmFsdWUiLCJyZW1vdmVIVE1MIiwidXBkYXRlQXR0cnMiLCJsaXNUZW1wIiwiYSIsInUiLCJpbCIsImMiLCJmcmFnIiwibW92ZUNoaWxkVG9GcmFnIiwicGFyZW50Tm9kZSIsImluc2VydEJlZm9yZSIsImNvbnRlbnRlZGl0YWJsZSIsImNvbnRlbnRFZGl0YWJsZSIsIm1hc2siLCJzdGF0ZVJlc3VsdCIsImF0dHJzUmVzdWx0IiwicmVtb3ZlQ2hpbGQiLCJyZWFsbHlSZW1vdmUiLCJzZXRBdHRyIiwiaXNMaWZlY3ljbGVNZXRob2QiLCJpc0Zvcm1BdHRyaWJ1dGUiLCJ1cGRhdGVFdmVudCIsInNldEF0dHJpYnV0ZU5TIiwidXBkYXRlU3R5bGUiLCJoYXNQcm9wZXJ0eUtleSIsInNldEF0dHJpYnV0ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInJlbW92ZUF0dHIiLCJzZWxlY3RlZEluZGV4IiwibnNMYXN0SW5kZXgiLCJub3JtYWxpemVkIiwidmFsIiwiYXR0ciIsInVwcGVyY2FzZVJlZ2V4IiwidG9Mb3dlckNhc2UiLCJjYXBpdGFsIiwibm9ybWFsaXplS2V5Iiwic3R5bGUiLCJjc3NUZXh0Iiwic2V0UHJvcGVydHkiLCJyZW1vdmVQcm9wZXJ0eSIsIkV2ZW50RGljdCIsIl8iLCJldiIsInN0b3BQcm9wYWdhdGlvbiIsImZvcmNlIiwiYWN0aXZlIiwibmFtZXNwYWNlIiwibmFtZXNwYWNlVVJJIiwicHJldlJlZHJhdyIsImZvY3VzIiwiaHRtbCIsIm5vZGUiLCJpbnB1dCIsIm9uY29tcGxldGlvbiIsImNhbGxiYWNrQ291bnQiLCJQcm9taXNlUHJveHkiLCJfX3Byb3RvX18iLCJtYWtlUmVxdWVzdCIsImZhY3RvcnkiLCJiYWNrZ3JvdW5kIiwiY29tcGxldGUiLCJ3cmFwIiwiY29uc3RydWN0b3IiLCJoYXNIZWFkZXIiLCJuYW1lIiwiaGVhZGVycyIsIm1ldGhvZCIsInRvVXBwZXJDYXNlIiwiYm9keSIsImFzc3VtZUpTT04iLCJzZXJpYWxpemUiLCJGb3JtRGF0YSIsInJlc3BvbnNlVHlwZSIsImV4dHJhY3QiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsImFib3J0ZWQiLCJyZXBsYWNlZEFib3J0IiwiYWJvcnQiLCJvcGVuIiwiYXN5bmMiLCJ1c2VyIiwicGFzc3dvcmQiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiZGVzZXJpYWxpemUiLCJ3aXRoQ3JlZGVudGlhbHMiLCJ0aW1lb3V0Iiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsInN1Y2Nlc3MiLCJzdGF0dXMiLCJyZXNwb25zZSIsIm1lc3NhZ2UiLCJwYXJzZSIsInJlc3BvbnNlVGV4dCIsImNvZGUiLCJjb25maWciLCJzZW5kIiwiY2FsbGJhY2tOYW1lIiwiTWF0aCIsInJvdW5kIiwicmFuZG9tIiwic2NyaXB0Iiwic3JjIiwiY2FsbGJhY2tLZXkiLCJkb2N1bWVudEVsZW1lbnQiLCJIZWFkZXIiLCJBcHAiXSwic291cmNlUm9vdCI6IiJ9