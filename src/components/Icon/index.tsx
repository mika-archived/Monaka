/* eslint-disable react/jsx-props-no-spreading */
import React from "react";

type SVGComponent = React.FC<React.SVGProps<SVGSVGElement>>;

// icon components that required by this repository.

// #region vscode-icons/vscode-icons

// default_file.svg
const DefaultFile: SVGComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
    <path d="M20.414,2H5V30H27V8.586ZM7,28V4H19v6h6V28Z" fill="#c5c5c5" />
  </svg>
);

// default_folder_opened.svg
const FolderOpened: SVGComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
    <path d="M27.4,5.5H18.2L16.1,9.7H4.3V26.5H29.5V5.5Zm0,18.7H6.6V11.8H27.4Zm0-14.5H19.2l1-2.1h7.1V9.7Z" fill="#dcb67a" />
    <polygon points="25.7 13.7 0.5 13.7 4.3 26.5 29.5 26.5 25.7 13.7" fill="#dcb67a" />
  </svg>
);

// default_folder.svg
const FolderClosed: SVGComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
    <path d="M27.5,5.5H18.2L16.1,9.7H4.4V26.5H29.6V5.5Zm0,4.2H19.3l1.1-2.1h7.1Z" fill="#c09553" />
  </svg>
);

// default_root_folder_opened.svg
const RootFolderOpened: SVGComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
    <path d="M27.4,5.5H18.2L16.1,9.7H4.3V26.5H29.5V5.5Zm0,18.7H6.6V11.8H27.4Zm0-14.5H19.2l1-2.1h7.1V9.7Z" fill="#dcb67a" />
    <polygon points="25.7 13.7 0.5 13.7 4.3 26.5 29.5 26.5 25.7 13.7" fill="#dcb67a" />
    <polygon points="19.635 31.25 13.711 31.25 23.505 9.75 29.49 9.75 19.635 31.25" fill="#dcb67a" />
    <path d="M23.666,10H29.1L19.475,31H14.1Z" fill="#ffeebe" />
  </svg>
);

// default_root_folder.svg
const RootFolderClosed: SVGComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
    <path d="M27.5,5.5H18.2L16.1,9.7H4.4V26.5H29.6V5.5Zm0,4.2H19.3l1.1-2.1h7.1Z" fill="#c09553" />
    <polygon points="19.735 31.25 13.811 31.25 23.605 9.75 29.59 9.75 19.735 31.25" fill="#c09553" />
    <path d="M23.766,10H29.2L19.575,31H14.2Z" fill="#ffeebe" />
  </svg>
);

export { DefaultFile, FolderOpened, FolderClosed, RootFolderOpened, RootFolderClosed };

// #endregion

// #region Microsoft/vscode-icons

const ChevronDown: SVGComponent = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M7.97602 10.0719L12.3333 5.7146L12.952 6.33332L8.28538 11L7.66666 11L3 6.33332L3.61872 5.7146L7.97602 10.0719Z" fill="#C5C5C5" />
  </svg>
);

const ChevronRight: SVGComponent = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.7 13.7L5 13L9.6 8.4L5 3.7L5.7 3L10.7 8V8.7L5.7 13.7Z" fill="#C5C5C5" />
  </svg>
);

const Close: SVGComponent = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.00001 8.70708L11.6465 12.3535L12.3536 11.6464L8.70711 7.99998L12.3536 4.35353L11.6465 3.64642L8.00001 7.29287L4.35356 3.64642L3.64645 4.35353L7.2929 7.99998L3.64645 11.6464L4.35356 12.3535L8.00001 8.70708Z"
      fill="#C5C5C5"
    />
  </svg>
);

const NewFile: SVGComponent = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 7H3V4H0V3H3V0H4V3H7V4H4V7ZM10.5 1.09998L13.9 4.59998L14 5V13.5L13.5 14H3.5L3 13.5V8H4V13H13V6H9V2H5V1H10.2L10.5 1.09998ZM10 2V5H12.9L10 2Z"
      fill="#C5C5C5"
    />
  </svg>
);

const NewFolder: SVGComponent = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 3H4V0H3V3H0V4H3V7H4V4H7V3ZM5.5 7H5V6H5.3L6.1 5.1L6.5 5H14V4H8V3H14.5L15 3.5V13.5L14.5 14H1.5L1 13.5V6.5V6V5H2V6V6.5V13H14V7V6H6.7L5.9 6.9L5.5 7Z"
      fill="#C5C5C5"
    />
  </svg>
);

export { ChevronDown, ChevronRight, Close, NewFile, NewFolder };

// #endregion
