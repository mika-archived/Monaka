import { Item } from "@/types";

export function getDepth(items: Item[], item: Item): number {
  let depth = 0;
  let cur = item;

  while (cur?.parentId !== null) {
    // eslint-disable-next-line no-loop-func
    cur = items.find((w) => w.id === cur.parentId)!;
    depth += 1;
  }

  return depth;
}

// https://codesandbox.io/s/84jkx
export function sortPredicate(a: Item, b: Item): number {
  let first = a;

  if (a.type === b.type) {
    if (a.title > b.title) first = b;
  } else if (b.type === "directory") {
    first = b;
  }

  return first === a ? -1 : 1;
}
