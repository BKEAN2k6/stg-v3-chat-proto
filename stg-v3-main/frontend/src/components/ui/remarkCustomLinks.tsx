import {visit} from 'unist-util-visit';
import type {Node} from 'unist';

type TextNode = {type: 'text'; value: string} & Node;
type LinkNode = {
  type: 'link';
  url: string;
  title?: string;
  children: TextNode[];
} & Node;
type ParentNode = {children: Array<TextNode | LinkNode>};

export function remarkCustomLinks(prefixes: string[]) {
  if (!Array.isArray(prefixes) || prefixes.length === 0) {
    // Return a no-op plugin
    return function () {
      return () => undefined;
    };
  }

  const prefixAlt = prefixes
    .map((s: string) => s.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`))
    .join('|');
  const expression = new RegExp(
    `(?:${prefixAlt}):\\/\\/[^\\s<>()\\[\\]]+`,
    'g',
  );

  return function () {
    return function (tree: Node) {
      visit(
        tree,
        'text',
        (
          node: TextNode,
          index: number | undefined,
          parent: ParentNode | undefined,
        ) => {
          if (
            !parent ||
            typeof index !== 'number' ||
            typeof node.value !== 'string'
          )
            return;

          const {value} = node;
          let match;
          let lastIndex = 0;
          const newNodes: Array<TextNode | LinkNode> = [];

          while ((match = expression.exec(value))) {
            const url = match[0];
            const start = match.index;

            if (start > lastIndex) {
              newNodes.push({
                type: 'text',
                value: value.slice(lastIndex, start),
              });
            }

            newNodes.push({
              type: 'link',
              url,
              title: undefined,
              children: [{type: 'text', value: url}],
            });

            lastIndex = start + url.length;
          }

          if (newNodes.length > 0) {
            if (lastIndex < value.length) {
              newNodes.push({type: 'text', value: value.slice(lastIndex)});
            }

            parent.children.splice(index, 1, ...newNodes);
          }
        },
      );
    };
  };
}
