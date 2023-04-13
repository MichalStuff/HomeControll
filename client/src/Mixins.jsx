import { css } from "styled-components";

const responsive = {
  laptop: (...args) => css`
    @media (max-width: 1024px) {
      ${css(...args)};
    }
  `,
  tablet: (...args) => css`
    @media (max-width: 768px) {
      ${css(...args)};
    }
  `,
  mobile: (...args) => css`
    @media (max-width: 425px) {
      ${css(...args)};
    }
  `,
};

export const { laptop, tablet, mobile } = responsive;
