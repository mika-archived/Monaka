import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { ThemeContext, Theme } from "../ThemeProvider";

type Props = {
  value: string;
  onContentChanged?: (value: string) => void;
};

type ThemedProps = {
  theme: Theme;
};

const StyledInput = styled.input<ThemedProps>`
  padding: 4px 8px;
  font-size: 14px;
  color: ${(props) => props.theme.fontColor};
  background: ${(props) => (props.theme as Theme).editorBackground};
  border: solid 1px ${(props) => (props.theme as Theme).activeBackground};

  &:focus {
    border: solid 1px ${(props) => props.theme.activeBorderColor};
    outline: none;
  }
`;

const Input: React.FC<Props> = ({ value, onContentChanged }) => {
  const [state, setState] = useState(value);

  useEffect(() => {
    setState(value);
  }, [value]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);

    if (onContentChanged) onContentChanged(event.target.value);
  };

  return <ThemeContext.Consumer>{(theme) => <StyledInput value={state} theme={theme} onChange={onChange} />}</ThemeContext.Consumer>;
};

export default Input;
