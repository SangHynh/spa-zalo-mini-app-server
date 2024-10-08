import { Box, Grid2, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const rows = [
  createData("Đồng", 159, "abc"),
  createData("Bạc", 237, "abc"),
  createData("Vàng", 262, "abc"),
];

const RanknPoint = () => {
  const { t } = useTranslation();

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5">{t("rank-point")}</Typography>
      <Grid2 container spacing={2}>
        <Grid2 item xs={6}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">{t("no.")}</TableCell>
                  <TableCell align="center">{t("rank")}</TableCell>
                  <TableCell align="center">{t("point")}</TableCell>
                  <TableCell align="center">{t("benefits")}</TableCell>
                  <TableCell align="center">{t("operations")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center" sx={{ width: "10%" }}>
                      {index}
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ width: "30%" }}>
                      {row.name}
                    </TableCell>
                    <TableCell align="center" sx={{ width: "10%" }}>
                      {row.calories}
                    </TableCell>
                    <TableCell align="left" sx={{ width: "30%" }}>
                      {row.fat}
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex justify-center gap-2"
                        sx={{ width: "20%" }}
                      >
                        <Tooltip title={t("edit")}>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("delete")}>
                          <IconButton>
                            <DeleteIcon className="text-red-500" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>
        <Grid2 item xs={6}>
          {/* Nội dung khác ở đây */}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default RanknPoint;
