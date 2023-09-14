# bundler-double-exports

Double exports seems to arise when one entrypoint is re-exporting from another entrypoint.

`dist/entry-a.js` ends up looking something like this:

```js
function b() {}
export { b };
export { b };
```

## Reproduction steps

```
bun i
```

```
bun start
```

Check [`dist/entry-b.js`](dist/entry-b.js) for the issue.
