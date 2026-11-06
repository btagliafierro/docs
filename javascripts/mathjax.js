// MathJax 3 configuration for DualSPHysics docs
// pymdownx.arithmatex (generic: true) + Material for MkDocs instant navigation.
//
// Follows the official Material for MkDocs integration
// (clearCache -> typesetClear -> texReset -> typeset on every page), with two
// additions that make the first view of a page render correctly:
//   * adaptiveCSS: false  -> MathJax emits its complete stylesheet once,
//     instead of adding CSS per character as new symbols appear. With instant
//     navigation that incremental CSS could get out of sync with the page,
//     so math only looked right after a hard refresh.
//   * every typeset run is queued on MathJax.startup.promise, so two runs can
//     never overlap (overlapping runs duplicate \label/\tag numbering).

let mathjaxReady = false;

window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
    tags: "ams"                 // numbered equations + \eqref
  },
  chtml: {
    adaptiveCSS: false,         // full stylesheet up front (see above)
    scale: 1,
    matchFontHeight: true
  },
  options: {
    ignoreHtmlClass: ".*|",     // only touch what arithmatex marked
    processHtmlClass: "arithmatex"
  },
  startup: {
    typeset: false,             // typesetPage() below does all typesetting
    ready: () => {
      MathJax.startup.defaultReady();
      mathjaxReady = true;
      typesetPage();            // first page load
    }
  }
};

function typesetPage() {
  // Called before MathJax has finished loading: ready() will call us.
  if (!mathjaxReady) return;

  MathJax.startup.promise = MathJax.startup.promise
    .then(() => {
      MathJax.startup.output.clearCache();  // official instant-loading step
      MathJax.typesetClear();               // forget the previous page's math
      MathJax.texReset();                   // restart equation numbers/labels
      return MathJax.typesetPromise();
    })
    .catch((err) => console.error("MathJax typeset failed:", err));
}

// Material emits document$ on every page, including the first one.
if (typeof document$ !== "undefined") {
  document$.subscribe(typesetPage);
}