import React, { useState } from "react";
import styled from "styled-components";

import Input from ".";

const LimitedWidth = styled.div`
  width: 250px;
`;

export default {
  title: "components/Input",
};

export const Default = () => {
  const [value, setValue] = useState("");

  const onValueChanged = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <LimitedWidth>
      <Input value={value} onContentChanged={onValueChanged} />
    </LimitedWidth>
  );
};
