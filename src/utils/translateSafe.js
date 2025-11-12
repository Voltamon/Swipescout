// Small defensive utilities to perform text-only translations while
// avoiding accidental changes to SVG elements or SVG attributes like `d`.
// Use translateTextNodes to walk and translate only Text nodes and skip any
// node inside an <svg>. Use safeSetInnerHTML when you need to set HTML but
// want to protect SVGs.

export function translateTextNodes(root = document.body, translateFn) {
  if (typeof translateFn !== "function") {
    throw new Error("translateFn must be a function");
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim())
        return NodeFilter.FILTER_REJECT;
      // skip nodes that live inside an <svg>
      let parent = node.parentElement;
      while (parent) {
        if (parent.tagName && parent.tagName.toLowerCase() === "svg")
          return NodeFilter.FILTER_REJECT;
        parent = parent.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let node;
  while ((node = walker.nextNode())) {
    try {
      const newText = translateFn(node.nodeValue);
      if (typeof newText === "string" && newText !== node.nodeValue) {
        node.nodeValue = newText;
      }
    } catch (err) {
      // Don't let one translation failure break the whole pass
      // eslint-disable-next-line no-console
      console.error("translateTextNodes: translateFn error", err);
    }
  }
}

// Safely set innerHTML on an element. Prevents writing HTML into SVG elements
// or elements inside SVG. If the provided html looks like plain text (no tags)
// and the target is inside an SVG, it will set textContent instead.
export function safeSetInnerHTML(el, html) {
  if (!el) return;
  const isInsideSvg = node => {
    if (!node) return false;
    if (node instanceof SVGElement) return true;
    if (node.closest) return Boolean(node.closest("svg"));
    // fallback: walk up
    let p = node.parentElement;
    while (p) {
      if (p.tagName && p.tagName.toLowerCase() === "svg") return true;
      p = p.parentElement;
    }
    return false;
  };

  if (isInsideSvg(el)) {
    // If html is plain text (no tags), set it as textContent; otherwise protect SVG
    if (typeof html === "string" && !/<[a-z][\s\S]*>/i.test(html)) {
      el.textContent = html;
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        "safeSetInnerHTML prevented setting HTML inside an SVG or its descendants"
      );
    }
    return;
  }

  el.innerHTML = html;
}

export default {
  translateTextNodes,
  safeSetInnerHTML
};
