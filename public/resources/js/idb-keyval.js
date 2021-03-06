'use strict';
var _createClass = (function() {
  function e(e, n) {
    for (var t = 0; t < n.length; t++) {
      var r = n[t];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        'value' in r && (r.writable = !0),
        Object.defineProperty(e, r.key, r);
    }
  }
  return function(n, t, r) {
    return t && e(n.prototype, t), r && e(n, r), n;
  };
})();
function _classCallCheck(e, n) {
  if (!(e instanceof n))
    throw new TypeError('Cannot call a class as a function');
}
var idbKeyval = (function(e) {
  var n = (function() {
      function e() {
        var n =
            arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : 'keyval-store',
          t =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : 'keyval';
        _classCallCheck(this, e),
          (this.storeName = t),
          (this._dbp = new Promise(function(e, r) {
            var o = indexedDB.open(n, 1);
            (o.onerror = function() {
              return r(o.error);
            }),
              (o.onsuccess = function() {
                return e(o.result);
              }),
              (o.onupgradeneeded = function() {
                o.result.createObjectStore(t);
              });
          }));
      }
      return (
        _createClass(e, [
          {
            key: '_withIDBStore',
            value: function(e, n) {
              var t = this;
              return this._dbp.then(function(r) {
                return new Promise(function(o, i) {
                  var u = r.transaction(t.storeName, e);
                  (u.oncomplete = function() {
                    return o();
                  }),
                    (u.onabort = u.onerror = function() {
                      return i(u.error);
                    }),
                    n(u.objectStore(t.storeName));
                });
              });
            }
          }
        ]),
        e
      );
    })(),
    t = void 0;
  function r() {
    return t || (t = new n()), t;
  }
  return (
    (e.Store = n),
    (e.get = function(e) {
      var n = void 0;
      return (arguments.length > 1 && void 0 !== arguments[1]
        ? arguments[1]
        : r()
      )
        ._withIDBStore('readonly', function(t) {
          n = t.get(e);
        })
        .then(function() {
          return n.result;
        });
    }),
    (e.set = function(e, n) {
      return (arguments.length > 2 && void 0 !== arguments[2]
        ? arguments[2]
        : r()
      )._withIDBStore('readwrite', function(t) {
        t.put(n, e);
      });
    }),
    (e.del = function(e) {
      return (arguments.length > 1 && void 0 !== arguments[1]
        ? arguments[1]
        : r()
      )._withIDBStore('readwrite', function(n) {
        n.delete(e);
      });
    }),
    (e.clear = function() {
      return (arguments.length > 0 && void 0 !== arguments[0]
        ? arguments[0]
        : r()
      )._withIDBStore('readwrite', function(e) {
        e.clear();
      });
    }),
    (e.keys = function() {
      var e = [];
      return (arguments.length > 0 && void 0 !== arguments[0]
        ? arguments[0]
        : r()
      )
        ._withIDBStore('readonly', function(n) {
          (n.openKeyCursor || n.openCursor).call(n).onsuccess = function() {
            this.result && (e.push(this.result.key), this.result.continue());
          };
        })
        .then(function() {
          return e;
        });
    }),
    e
  );
})({});
