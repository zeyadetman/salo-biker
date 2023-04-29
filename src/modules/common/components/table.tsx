import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export const DataTable = ({
  rows,
  headers,
}: {
  rows: any[];
  headers: { id: string; label: string }[];
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="medium" aria-label="Parcels">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell
                key={header.id}
                align={index === 0 ? "left" : "center"}
              >
                {header.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any, rowIndex: number) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {headers.map((header, index) => {
                const record = row?.[header?.id as any];

                if (index === 0) {
                  return (
                    <TableCell component="th" scope="row" key={record}>
                      {record || ""}
                    </TableCell>
                  );
                }

                if (header.id === "action") {
                  return (
                    <TableCell align="center" key={row.id}>
                      {row.action}
                    </TableCell>
                  );
                }

                return (
                  <TableCell align="center" key={record}>
                    {record || ""}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
