import { visit } from "unist-util-visit";

/**
 * Rehype plugin to wrap images in links to their full-size versions.
 * Skips images that are already wrapped in links.
 */
export default function rehypeImageLinks() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      // Only process img elements
      if (node.tagName !== "img") return;

      // Skip if already wrapped in a link
      if (parent?.tagName === "a") return;

      // Skip if no src
      const src = node.properties?.src;
      if (!src) return;

      // Create the wrapper anchor element
      const wrapper = {
        type: "element",
        tagName: "a",
        properties: {
          href: src,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "image-link",
        },
        children: [node],
      };

      // Replace the img with the wrapped version
      parent.children[index] = wrapper;
    });
  };
}
