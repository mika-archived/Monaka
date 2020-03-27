import React from "react";

import { FileIcon } from "@/types";

type Props = {
  icons: FileIcon[];
};

const IconContext = React.createContext([] as FileIcon[]);

const IconProvider: React.FC<Props> = ({ children, icons }) => {
  return <IconContext.Provider value={icons}>{children}</IconContext.Provider>;
};

export default IconProvider;
export { IconContext };
