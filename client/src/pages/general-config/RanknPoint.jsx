import {
  Box,
  Button,
  FormControl,
  Grid2,
  IconButton,
  Input,
  InputLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
import { FaPlus } from "react-icons/fa";
import { apiGetRanks } from "../../apis/rank";

const RanknPoint = () => {
  const { t } = useTranslation();

  const [isEdit, setIsEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(false);

  const handleEdit = () => {
    setIsEdit(true);
    setIsCreate(false);
  };

  const handleCreate = () => {
    setIsCreate(true);
    setIsEdit(false);
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
  };

  const handleCancelCreate = () => {
    setIsCreate(false);
  };

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const response = await apiGetRanks(); // Gọi API
        console.log(response.data); // Kiểm tra dữ liệu trả về

        // Kiểm tra xem response.data có phải là một mảng không
        if (Array.isArray(response.data)) {
          setRows(response.data); // Cập nhật state nếu là mảng
        } else {
          console.error("Dữ liệu không phải là mảng");
          setRows([]); // Hoặc xử lý theo cách khác
        }
      } catch (error) {
        console.error("Error fetching ranks:", error);
      }
    };

    fetchRanks(); // Gọi hàm fetchRanks
  }, []);

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5">{t("rank-point")}</Typography>
      <Button
        variant="contained"
        color="secondary"
        className="w-fit flex items-center gap-2"
        onClick={handleCreate}
      >
        <FaPlus />
        {t("create")}
      </Button>
      <Grid2 container spacing={4}>
        <Grid2 size={6}>
          <TableContainer component={Paper} className="border">
            <Table sx={{ minWidth: 700 }} aria-label="simple table">
              <TableHead className="bg-gray-400 dark:bg-gray-100">
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    {t("no.")}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    {t("rank")}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    {t("point")}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    {t("benefits")}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", color: "black" }}
                  >
                    {t("operations")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={row._id}
                    className="bg-[#FFFFFF] dark:bg-[#2F2F2F]"
                  >
                    <TableCell align="center" sx={{ width: "10%" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ width: "20%" }}>
                      {row.tier}
                    </TableCell>
                    <TableCell align="center" sx={{ width: "20%" }}>
                      {row.minPoints}
                    </TableCell>
                    <TableCell align="left" sx={{ width: "30%" }}>
                      {row.benefits}
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex justify-center gap-2"
                        sx={{ width: "20%" }}
                      >
                        <Tooltip title={t("edit")}>
                          <IconButton color="primary" onClick={handleEdit}>
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
        {isEdit && (
          <Grid2 size={6}>
            <Typography variant="h6" color="primary">
              {t("edit")}
            </Typography>
            <form action="">
              <Grid2 container spacing={4}>
                <Grid2 size={6}>
                  <TextField
                    id="rank"
                    label={t("rank")}
                    variant="standard"
                    fullWidth
                    margin="dense"
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    id="point"
                    label={t("point")}
                    variant="standard"
                    fullWidth
                    margin="dense"
                  />
                </Grid2>
                <Grid2 size={12}>
                  <FormControl fullWidth margin="dense" variant="standard">
                    <InputLabel>{t("benefits")}</InputLabel>
                    <Input
                      id="ingredientUsageInstructions"
                      multiline
                      rows={3}
                    />
                  </FormControl>
                </Grid2>
              </Grid2>
              <Grid2
                container
                fullWidth
                spacing={2}
                sx={{ mt: 2, justifyContent: "flex-end" }}
              >
                <Grid2>
                  <Button type="submit" variant="contained" color="primary">
                    {t("update")}
                  </Button>
                </Grid2>
                <Grid2>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleCancelEdit}
                  >
                    {t("cancel")}
                  </Button>
                </Grid2>
              </Grid2>
            </form>
          </Grid2>
        )}
        {isCreate && (
          <Grid2 size={6}>
            <Typography variant="h6" color="secondary">
              {t("create")}
            </Typography>
            <form action="">
              <Grid2 container spacing={4}>
                <Grid2 size={6}>
                  <TextField
                    id="rank"
                    label={t("rank")}
                    variant="standard"
                    fullWidth
                    margin="dense"
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    id="point"
                    label={t("point")}
                    variant="standard"
                    fullWidth
                    margin="dense"
                  />
                </Grid2>
                <Grid2 size={12}>
                  <FormControl fullWidth margin="dense" variant="standard">
                    <InputLabel>{t("benefits")}</InputLabel>
                    <Input
                      id="ingredientUsageInstructions"
                      multiline
                      rows={3}
                    />
                  </FormControl>
                </Grid2>
              </Grid2>
              <Grid2
                container
                fullWidth
                spacing={2}
                sx={{ mt: 2, justifyContent: "flex-end" }}
              >
                <Grid2>
                  <Button type="submit" variant="contained" color="secondary">
                    {t("create")}
                  </Button>
                </Grid2>
                <Grid2>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleCancelCreate}
                  >
                    {t("cancel")}
                  </Button>
                </Grid2>
              </Grid2>
            </form>
          </Grid2>
        )}
      </Grid2>
    </Box>
  );
};

export default RanknPoint;
