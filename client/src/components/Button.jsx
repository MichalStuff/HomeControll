import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: var(--primary);
  color: var(--secondary);
  font-weight: var(--txt-600);
  font-size: 20px;
  margin: 10px;
  border: 3px solid #09a56c;
`;

export const Button = (props) => {
  return (
    <StyledButton
      onClick={(e) => {
        props.handler(e);
      }}
    >
      {props.children}
    </StyledButton>
  );
};
