import React from "react";
import styled from "styled-components";

import * as Icons from ".";

const IconX16 = styled.div`
  height: 16px;
  width: 16px;
`;

export default {
  title: "components/Icons",
};

// #region vscode-icons/vscode-icons

export const DefaultFile = () => (
  <IconX16>
    <Icons.DefaultFile />
  </IconX16>
);

export const FolderClosed = () => (
  <IconX16>
    <Icons.FolderClosed />
  </IconX16>
);

export const FolderOpened = () => (
  <IconX16>
    <Icons.FolderOpened />
  </IconX16>
);

export const RootFolderClosed = () => (
  <IconX16>
    <Icons.RootFolderClosed />
  </IconX16>
);

export const RootFolderOpened = () => (
  <IconX16>
    <Icons.RootFolderOpened />
  </IconX16>
);

// #endregion

// #region Microsoft/vscode-icons

export const CircleFilled = () => <Icons.CircleFilled />;

export const ChevronDown = () => <Icons.ChevronDown />;

export const ChevronRight = () => <Icons.ChevronRight />;

export const Close = () => <Icons.Close />;

export const NewFile = () => <Icons.NewFile />;

export const NewFolder = () => <Icons.NewFolder />;

// #endregion
