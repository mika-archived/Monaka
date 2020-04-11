import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { ThemeContext, Theme } from "../ThemeProvider";

type Props = {
  value: string;
  mode: "Submit" | "PropertyChanged";
  onMounted?: (ref: HTMLInputElement) => void;
  onSubmit?: (value: string) => void;
  onIsValid?: (value: string) => string | null;
} & React.InputHTMLAttributes<HTMLInputElement>;

type ThemedProps = {
  theme: Theme;
};

const Container = styled.div`
  position: relative;
`;

const ErrorMessage = styled.div<ThemedProps>`
  position: absolute;
  top: 20px;
  left: 0;
  padding: 2px 8px;
  color: ${(props) => props.theme.errorFontColor};
  background: ${(props) => props.theme.errorBackground};
  border: solid 1px ${(props) => props.theme.errorBorderColor};
`;

const StyledInput = styled.input<ThemedProps>`
  padding: 2px 8px;
  font-size: 14px;
  color: ${(props) => props.theme.fontColor};
  background: ${(props) => (props.theme as Theme).editorBackground};
  border: solid 1px ${(props) => (props.theme as Theme).activeBackground};

  &:focus {
    border: solid 1px ${(props) => props.theme.activeBorderColor};
    outline: none;
  }
`;

const Input: React.FC<Props> = ({ value, mode, onMounted, onSubmit, onIsValid, ...props }) => {
  const [state, setState] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const stateRef = useRef<string>(value);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = input.current;

    const onSubmitEvent = (e: KeyboardEvent) => {
      if (e.key === "Enter" && onSubmit) {
        if (onIsValid && !!onIsValid(stateRef.current)) {
          return;
        }

        if (onSubmit) onSubmit(stateRef.current);
      }
    };

    if (el) {
      if (onMounted) onMounted(el);
      el.addEventListener("keypress", onSubmitEvent);
    }

    return () => el?.removeEventListener("keypress", onSubmitEvent);
  }, [onSubmit]);

  useEffect(() => {
    setState(value);
    stateRef.current = value;
  }, [value]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (onIsValid) {
      setError(onIsValid(newValue));
    }

    setState(newValue);
    stateRef.current = newValue;

    if (mode === "PropertyChanged" && onSubmit) onSubmit(newValue);
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Container>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <StyledInput ref={input} value={state} theme={theme} onChange={onChange} {...props} />
          {error ? <ErrorMessage theme={theme}>{error}</ErrorMessage> : null}
        </Container>
      )}
    </ThemeContext.Consumer>
  );
};

export default Input;
