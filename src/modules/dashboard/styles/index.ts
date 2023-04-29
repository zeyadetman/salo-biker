import { Box, styled } from "@mui/material";

export const EmptyOrdersContainerStyled = styled(Box)`
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
  gap: 1rem;
  padding-bottom: 3rem;

  & .MuiTypography-h2 {
    font-size: 1.5rem;
  }
`;

export const OrdersListContainerStyled = styled(Box)`
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 1rem;
`;

export const OrderFormStyled = styled(Box)`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  & .header {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
