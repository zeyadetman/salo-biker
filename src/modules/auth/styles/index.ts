import { Box, css, styled } from "@mui/material";

export const FormContainerStyled = styled(Box)(
  ({ theme }) => css`
    display: flex;
    gap: 2rem;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;

    @media (max-width: ${theme.breakpoints.values.md}px) {
      flex-direction: column;
    }
  `
);

export const FormOverviewContainerStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
`;

export const FormStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 1rem;
`;

export const SuccessfulRegisterationMessageStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
