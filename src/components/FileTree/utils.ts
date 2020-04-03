import { Item } from "@/types";

export function getDepth(items: Item[], item: Item): number {
  let depth = 0;
  let cur = item;

  while (cur && cur.parentId !== null) {
    // eslint-disable-next-line no-loop-func
    cur = items.find((w) => w.id === cur.parentId)!;
    depth += 1;
  }

  return depth;
}

export function getChildren(items: Item[], item: Item): Item[] {
  const children: Item[] = [];
  const directChildren = items.filter((w) => w.parentId === item.id);
  children.push(...directChildren);

  const directories = directChildren.filter((w) => w.type === "directory");
  for (let i = 0; i < directories.length; i += 1) {
    children.push(...getChildren(items, directories[i]));
  }

  return [item, ...children].filter((w, i, array) => {
    return i === array.findIndex((v) => v.id === w.id);
  });
}

export function getIsSelected(item: Item, selected: Item | null): boolean {
  return item.id === selected?.id;
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
