var idb = (function(e) {
  'use strict';
  const t = (e, t) => t.some(t => e instanceof t);
  let n, r;
  const o = new WeakMap(),
    s = new WeakMap(),
    a = new WeakMap(),
    i = new WeakMap(),
    c = new WeakMap();
  let u = {
    get(e, t, n) {
      if (e instanceof IDBTransaction) {
        if ('done' === t) return s.get(e);
        if ('objectStoreNames' === t) return e.objectStoreNames || a.get(e);
        if ('store' === t)
          return n.objectStoreNames[1]
            ? void 0
            : n.objectStore(n.objectStoreNames[0]);
      }
      return p(e[t]);
    },
    has: (e, t) =>
      (e instanceof IDBTransaction && ('done' === t || 'store' === t)) || t in e
  };
  function d(e) {
    return e !== IDBDatabase.prototype.transaction ||
      'objectStoreNames' in IDBTransaction.prototype
      ? (
          r ||
          (r = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey
          ])
        ).includes(e)
        ? function(...t) {
            return e.apply(l(this), t), p(o.get(this));
          }
        : function(...t) {
            return p(e.apply(l(this), t));
          }
      : function(t, ...n) {
          const r = e.call(l(this), t, ...n);
          return a.set(r, t.sort ? t.sort() : [t]), p(r);
        };
  }
  function f(e) {
    return 'function' == typeof e
      ? d(e)
      : (e instanceof IDBTransaction &&
          (function(e) {
            if (s.has(e)) return;
            const t = new Promise((t, n) => {
              const r = () => {
                  e.removeEventListener('complete', o),
                    e.removeEventListener('error', s),
                    e.removeEventListener('abort', s);
                },
                o = () => {
                  t(), r();
                },
                s = () => {
                  n(e.error), r();
                };
              e.addEventListener('complete', o),
                e.addEventListener('error', s),
                e.addEventListener('abort', s);
            });
            s.set(e, t);
          })(e),
        t(
          e,
          n ||
            (n = [
              IDBDatabase,
              IDBObjectStore,
              IDBIndex,
              IDBCursor,
              IDBTransaction
            ])
        )
          ? new Proxy(e, u)
          : e);
  }
  function p(e) {
    if (e instanceof IDBRequest)
      return (function(e) {
        const t = new Promise((t, n) => {
          const r = () => {
              e.removeEventListener('success', o),
                e.removeEventListener('error', s);
            },
            o = () => {
              t(p(e.result)), r();
            },
            s = () => {
              n(e.error), r();
            };
          e.addEventListener('success', o), e.addEventListener('error', s);
        });
        return (
          t
            .then(t => {
              t instanceof IDBCursor && o.set(t, e);
            })
            .catch(() => {}),
          c.set(t, e),
          t
        );
      })(e);
    if (i.has(e)) return i.get(e);
    const t = f(e);
    return t !== e && (i.set(e, t), c.set(t, e)), t;
  }
  const l = e => c.get(e);
  const D = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
    v = ['put', 'add', 'delete', 'clear'],
    B = new Map();
  function I(e, t) {
    if (!(e instanceof IDBDatabase) || t in e || 'string' != typeof t) return;
    if (B.get(t)) return B.get(t);
    const n = t.replace(/FromIndex$/, ''),
      r = t !== n,
      o = v.includes(n);
    if (
      !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
      (!o && !D.includes(n))
    )
      return;
    const s = async function(e, ...t) {
      const s = this.transaction(e, o ? 'readwrite' : 'readonly');
      let a = s.store;
      r && (a = a.index(t.shift()));
      const i = a[n](...t);
      return o && (await s.done), i;
    };
    return B.set(t, s), s;
  }
  return (
    (u = (e => ({
      get: (t, n, r) => I(t, n) || e.get(t, n, r),
      has: (t, n) => !!I(t, n) || e.has(t, n)
    }))(u)),
    (e.openDB = function(e, t, { blocked: n, upgrade: r, blocking: o } = {}) {
      const s = indexedDB.open(e, t),
        a = p(s);
      return (
        r &&
          s.addEventListener('upgradeneeded', e => {
            r(p(s.result), e.oldVersion, e.newVersion, p(s.transaction));
          }),
        n && s.addEventListener('blocked', () => n()),
        o && a.then(e => e.addEventListener('versionchange', o)),
        a
      );
    }),
    (e.deleteDB = function(e, { blocked: t } = {}) {
      const n = indexedDB.deleteDatabase(e);
      return (
        t && n.addEventListener('blocked', () => t()), p(n).then(() => void 0)
      );
    }),
    (e.unwrap = l),
    (e.wrap = p),
    e
  );
})({});
