export type FileItem = {
  type: "file";
  id: string;
  title: string;
  content: string;
  parentId: string | null;
};

export type DirectoryItem = {
  type: "directory";
  id: string;
  title: string;
  parentId: string | null;
  state: "closed" | "opened";
};

export type Item = FileItem | DirectoryItem;

export type TabContent = {
  item: FileItem;
};
