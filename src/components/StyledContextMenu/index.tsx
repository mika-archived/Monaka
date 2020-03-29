import React from "react";
import { ContextMenuTrigger } from "react-contextmenu";

import "./index.css";

type Props = {
  id: string;
};

const StyledContextMenu: React.FC<Props> = ({ children, id }) => {
  return <ContextMenuTrigger id={id}>{children}</ContextMenuTrigger>;
};

export default StyledContextMenu;
