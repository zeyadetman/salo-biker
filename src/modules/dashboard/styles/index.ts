import { Box, styled } from "@mui/material";

export const EmptyParcelsContainerStyled = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  margin-top: 3rem;

  & .emptyStateText {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;

    & .MuiTypography-body1 {
      color: ${(props) => props.theme.palette.grey[500]};
    }
  }
`;

export const DashboardContainerStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
`;

export const ParcelsListContainerStyled = styled(Box)`
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 1rem;
`;

export const ParcelFormStyled = styled(Box)`
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  gap: 2rem;
`;
