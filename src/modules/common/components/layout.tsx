import { LayoutStyled } from "@/modules/common/styles";
import { userType } from "@/redux/slices/auth.slice";
import { useAppSelector } from "@/redux/store";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface Props {
  children: React.ReactNode;
}

export const Layout = (props: Props) => {
  const { children } = props;
  const [value, setValue] = React.useState(0);
  const router = useRouter();
  const { accessToken, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken || user?.type !== userType.BIKER) {
      router.push("/");
    }
  }, [accessToken, user?.type]);

  const renderAuthAppLayout = (children: React.ReactNode) => {
    if (!accessToken || user?.type !== userType.BIKER) {
      return children;
    }

    return (
      <>
        {children}

        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: "sm",
            margin: "0 auto",
          }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
          </BottomNavigation>
        </Paper>
      </>
    );
  };

  return (
    <LayoutStyled maxWidth="sm">{renderAuthAppLayout(children)}</LayoutStyled>
  );
};
