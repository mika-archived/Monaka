import React from "react";
import { ContextMenuTrigger } from "react-contextmenu";

import "./index.css";

type Props = {
  id: string;
  disable?: boolean;
};

const StyledContextMenu: React.FC<Props> = ({ children, disable, id }) => {
  return (
    <ContextMenuTrigger id={id} disable={disable || false}>
      {children}
    </ContextMenuTrigger>
  );
};

export default StyledContextMenu;
