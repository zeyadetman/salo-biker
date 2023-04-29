import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { IUserParcel } from "@/redux/slices/auth.slice";

export const DataTable = ({
  rows,
  onRowActionClicked,
}: {
  rows: IUserParcel[];
  onRowActionClicked: (row: IUserParcel) => void;
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="medium" aria-label="Parcels">
        <TableHead>
          <TableRow>
            <TableCell>Parcel Name</TableCell>
            <TableCell align="center">Pick-up Address</TableCell>
            <TableCell align="center">Drop-off Adress</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="center">{row.pickup?.address}</TableCell>
              <TableCell align="center">{row.dropoff?.address}</TableCell>
              <TableCell align="center">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRowActionClicked(row);
                  }}
                >
                  Pick it up
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
