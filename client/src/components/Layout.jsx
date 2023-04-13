import React, { Children } from "react";
import styled from "styled-components";
import { mobile } from "../Mixins";

const StyledLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background-color: var(--backgournd);
  color: black;
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  ${mobile`
    &
    min-height : 100vh;
    flex-direction : column;
    
  `}
`;

export const Layout = (props) => {
  return <StyledLayout>{props.children}</StyledLayout>;
};
