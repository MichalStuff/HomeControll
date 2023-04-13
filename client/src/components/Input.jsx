import React from "react";
import styled from "styled-components";
import { mobile } from "../Mixins";

const StyledContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 50px;
  ${mobile`
  padding: 10px 10px;
  
`}
`;

const StyledLabel = styled.p`
  dispaly: block;
  font-family: var(--font-famliy);
  font-weight var(--txt-700);
  font-size : 28px;
  color: var(--secondary);
`;

const StyledInput = styled.input`
  margin: 10px 20px;
  padding: 15px 20px;
  border-radius: 10px;
  border: 0px;
  font-weight: var(--txt-600);
  font-size: 20px;
  &::placeholder {
    color: var(--white-darker);
  }
  ${mobile`
  width : 100%;
`}
`;

export const Input = ({ label, type = "text", handler, value }) => {
  return (
    <StyledContent>
      <StyledInput
        placeholder={label}
        type={type}
        onChange={(e) => {
          handler(e);
        }}
        value={value}
      />
    </StyledContent>
  );
};
