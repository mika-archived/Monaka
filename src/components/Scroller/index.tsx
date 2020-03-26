import React from "react";
import SimpleBar from "simplebar-react";

import "simplebar/src/simplebar.css";
import "./index.css";

const Scroller: React.FC = ({ children }) => {
  return <SimpleBar>{children}</SimpleBar>;
};

export default Scroller;
