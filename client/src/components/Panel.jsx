import React from "react";
import styled from "styled-components";
import { mobile } from "../Mixins";

const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background-color: var(--white-dark);
  box-shadow: 11px 11px 13px -6px rgba(103, 103, 103, 1);
  border-radius: 20px;
  // max-width: 400px;
  width: 400px;
  height: 600px;
  margin: 20px;
  ${mobile`
    height : 70vh;
    margin : 5vh 0 15vh 0;
    min-height : 600px;
    max-width : 90vw;
  `}
`;

export const Panel = (props) => {
  return (
    <StyledPanel className={props.className}>{props.children}</StyledPanel>
  );
};
