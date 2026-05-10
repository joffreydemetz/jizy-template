# jizy-template

Page-template helper. Fits a content area between header/footer offsets, exposes content/response callbacks, and detects per-body theme classes.

## Install

```bash
npm install jizy-template
```

## Usage

```js
import jTemplate from 'jizy-template';

const template = new jTemplate({
    theme: 'main',                                  // overridden by body class `theme-*` if present
    contentSelector: 'body > main .page-contents',  // element whose min-height is set
    offsetSelectors: ['body > header', 'body > footer'], // summed to compute the offset
    fitToViewport: true,                            // when false, no min-height is applied
});

template.addOnContentDisplayCallback(($content) => {
    // ran on first render and intended for callers to re-call after content swaps
});

template.addResponseCallbacks((data) => { /* every response */ });
template.addHtmlResponseCallbacks((html) => { /* HTML responses */ });
template.addJsonResponseCallbacks((js)   => { /* JSON-`js` payloads */ });

document.addEventListener('DOMContentLoaded', () => template.ready());
```

## Constructor

`new jTemplate(options = {})`

| Option | Default | Description |
|---|---|---|
| `theme` | `'main'` | Default theme. Overridden by the first `theme-<name>` class on `<body>`. |
| `contentSelector` | `'body > main .page-contents'` | Element whose `min-height` is set to `calc(100vh - <offset>px)` when `fitToViewport` is `true`. |
| `offsetSelectors` | `['body > header', 'body > footer']` | Elements summed (height + vertical paddings) to compute the offset. |
| `fitToViewport` | `true` | When `false`, no min-height is applied and offsets are ignored. |
| `detectBodyTheme` | `true` | When `false`, `ready()` skips the `theme-*` body-class lookup and `theme` keeps its constructor value. |

## Methods

| Method | Description |
|---|---|
| `ready()` | Resolve the content + offset elements, run the first display, fit, and bind `resize`. |
| `addOnContentDisplayCallback(fn)` | Register a callback fired by `onContentDisplay()`. |
| `addResponseCallbacks(fn)` | Register a callback fired for **both** HTML and JSON responses. |
| `addHtmlResponseCallbacks(fn)` | Register a callback fired only for HTML responses. |
| `addJsonResponseCallbacks(fn)` | Register a callback fired only for JSON `data.js` payloads. |
| `onContentDisplay()` | Run all display callbacks against `$content`. |
| `applyViewportFit()` | Recompute the content min-height from the current offsets. |
| `onHtmlResponse(html)` | Dispatch HTML to response + html callbacks. |
| `onJsonResponse(data)` | Dispatch `data.js` to response + json callbacks (when present). |

`heightOffsetAdjust` is exposed as a public property (`(offset) => offset` by default) so callers can tweak the computed offset before it's applied.

## Side effects on `ready()`

- Adds/removes the `touchable` class on `<body>` based on `'ontouchstart' in document.documentElement`.
- If `detectBodyTheme` is `true` and `<body>` carries a `theme-<name>` class, replaces `this.theme` with the matched name.
- If `fitToViewport === false`, clears `offsetSelectors` so no resize work is done.

## Browser global

The packaged build attaches `window.jTemplate`.
