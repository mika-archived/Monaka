import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { ThemeContext, Theme } from "../ThemeProvider";

type Props = {
  value: string;
  onMounted?: (ref: HTMLInputElement) => void;
  onSubmit?: (value: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

type ThemedProps = {
  theme: Theme;
};

const StyledInput = styled.input<ThemedProps>`
  padding: 4px 8px;
  font-size: 12px;
  color: ${(props) => props.theme.fontColor};
  background: ${(props) => (props.theme as Theme).editorBackground};
  border: solid 1px ${(props) => (props.theme as Theme).activeBackground};

  &:focus {
    border: solid 1px ${(props) => props.theme.activeBorderColor};
    outline: none;
  }
`;

const Input: React.FC<Props> = ({ value, onMounted, onSubmit, ...props }) => {
  const [state, setState] = useState(value);
  const stateRef = useRef<string>(value);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = input.current;

    const onSubmitEvent = (e: KeyboardEvent) => {
      if (e.key === "Enter" && onSubmit) onSubmit(stateRef.current);
    };

    if (el) {
      if (onMounted) onMounted(el);
      el.addEventListener("keypress", onSubmitEvent);
    }

    return () => el?.removeEventListener("keypress", onSubmitEvent);
  }, []);

  useEffect(() => {
    setState(value);
    stateRef.current = value;
  }, [value]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
    stateRef.current = event.target.value;
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ThemeContext.Consumer>{(theme) => <StyledInput ref={input} value={state} theme={theme} onChange={onChange} {...props} />}</ThemeContext.Consumer>;
};

export default Input;
