import React from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const Form = (props) => {
  return (
    <StyledForm
      onSubmit={(e) => {
        props.handler(e);
      }}
    >
      {props.children}
    </StyledForm>
  );
};
