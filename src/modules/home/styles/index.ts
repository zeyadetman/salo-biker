import { Box, styled } from "@mui/material";

export const HomeContainerStyled = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
  min-height: 95vh;
`;

export const HomeHeaderTextContainerStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
`;

export const HomeActionButtonsContainerStyled = styled(Box)`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  & button {
    font-size: 1rem;
  }

  & .MuiButton-text {
    text-transform: none;
  }
`;
