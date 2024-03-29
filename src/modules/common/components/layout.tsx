import { LayoutStyled } from "@/modules/common/styles";
import { logout, setParcels, userType } from "@/redux/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { AccountCircle } from "@mui/icons-material";
import { io } from "socket.io-client";
import { useSnackbar } from "notistack";
import { EVENTS_TYPES } from "@/pages/dashboard";
import { getAllParcels } from "@/redux/services/parcel.service";

interface Props {
  children: React.ReactNode;
}

export const Layout = (props: Props) => {
  const { children } = props;
  const [value, setValue] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [getAllParcelsQuery] = getAllParcels.useLazyQuery();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (!accessToken || user?.type !== userType.BIKER) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, user?.type]);

  useEffect(() => {
    const updateParcels = async () => {
      try {
        const { data: parcelsData, error } = await getAllParcelsQuery();
        if (error) throw error;
        dispatch(setParcels({ parcels: parcelsData || [] }));
      } catch (error: any) {
        enqueueSnackbar(
          error.message || error?.data?.message || "Something went wrong!",
          {
            variant: "error",
          }
        );
      }
    };
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "", {
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    socket.connect();
    socket.on(EVENTS_TYPES.PARCEL_CREATED, async (data: any) => {
      enqueueSnackbar(`New Parcel Created! ${data.name}`, {
        variant: "info",
      });

      updateParcels();
    });

    socket.on(EVENTS_TYPES.ORDER_CREATED, async (data: any) => {
      enqueueSnackbar(
        `Order with parcel: ${data?.parcelId} has been picked up!`,
        {
          variant: "info",
        }
      );

      updateParcels();
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderAuthAppLayout = (children: React.ReactNode) => {
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    if (!accessToken || user?.type !== userType.BIKER) {
      return children;
    }

    return (
      <>
        <AppBar
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            maxWidth: "sm",
            margin: "0 auto",
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {router.asPath === "/dashboard" ? "Parcels" : "My Orders"}
            </Typography>

            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ pt: 10, pb: 4 }}>
          {children}
        </Box>
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
            <BottomNavigationAction
              label="Parcels"
              icon={<InventoryIcon />}
              onClick={() => {
                router.push("/dashboard");
              }}
            />
            <BottomNavigationAction
              label="My Orders"
              onClick={() => {
                router.push("/orders");
              }}
              icon={<FavoriteIcon />}
            />
          </BottomNavigation>
        </Paper>
      </>
    );
  };

  return (
    <LayoutStyled maxWidth="sm">{renderAuthAppLayout(children)}</LayoutStyled>
  );
};
