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
import {
  apiCreateRank,
  apiDeleteRank,
  apiGetRanks,
  apiUpdateRank,
} from "../../../apis/rank";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ForUser = () => {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [id, setId] = useState("");
  const [rank, setRank] = useState("");
  const [point, setPoint] = useState("");
  const [benefits, setBenefits] = useState("");
  const [originalRow, setOriginalRow] = useState(null);

  const handleEditBtn = (row) => {
    setIsEdit(true);
    setIsCreate(false);
    setId(row._id);
    setRank(row.tier);
    setPoint(row.minPoints);
    setBenefits(row.benefits);
    setOriginalRow(row); // Save original row
  };

  const handleCreateBtn = () => {
    setIsCreate(true);
    setIsEdit(false);
    setId(null);
    setRank("");
    setPoint(0);
    setBenefits([]);
    setOriginalRow(null);
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
  };

  const handleCancelCreate = () => {
    setIsCreate(false);
  };

  const handleUpdate = async () => {
    try {
      const formData = {
        tier: rank,
        minPoints: point,
        benefits: benefits,
      };

      const response = await apiUpdateRank(id, formData);

      if (
        originalRow &&
        formData.tier === originalRow.tier &&
        formData.minPoints === originalRow.minPoints &&
        formData.benefits === originalRow.benefits
      ) {
        toast.info(t("no-change"));
        return;
      }

      if (response.status === 200) {
        Swal.fire({
          title: `${t("success")}!`,
          text: `${t("update-success")}!`,
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error updating rank:", error);
      Swal.fire({
        title: `${t("error")}!`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleCreate = async () => {
    try {
      const formData = {
        tier: rank,
        minPoints: point,
        benefits: benefits,
      };

      const response = await apiCreateRank(formData);

      if (response.status === 201) {
        Swal.fire({
          title: `${t("success")}!`,
          text: `${t("create-success")}!`,
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error create rank:", error);
      Swal.fire({
        title: `${t("error")}!`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleDelete = async (rankId) => {
    const confirmDelete = await Swal.fire({
      title: `${t("confirm")}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `${t("yes")}`,
      cancelButtonText: `${t("no")}`,
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await apiDeleteRank(rankId);

        if (response.status === 200) {
          Swal.fire({
            title: `${t("success")}!`,
            text: `${t("delete-success")}!`,
            icon: "success",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          Swal.fire({
            title: `${t("error")}!`,
            text: `${t("delete-failed")}!`,
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      } catch (error) {
        console.error("Error deleting rank:", error);
        Swal.fire({
          title: `${t("error")}!`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  };

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const response = await apiGetRanks();

        if (Array.isArray(response.data)) {
          setRows(response.data);
        } else {
          setRows([]);
        }
      } catch (error) {
        console.error("Error fetching ranks:", error);
      }
    };

    fetchRanks();
  }, []);

  return (
    <Box className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Typography variant="h6">{t("user")}</Typography>
        <Button
          variant="contained"
          color="secondary"
          className="w-fit flex items-center gap-2"
          onClick={handleCreateBtn}
        >
          <FaPlus />
          {t("create")}
        </Button>
        <div></div>
      </div>
      <Grid2 container spacing={4}>
        <Grid2 size={7}>
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
                    <TableCell align="right" sx={{ width: "20%" }}>
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
                          <IconButton
                            color="primary"
                            onClick={() => handleEditBtn(row)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={t("delete")}
                          onClick={() => handleDelete(row._id)}
                        >
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
          <Grid2 size={5}>
            <Typography variant="h6" color="primary">
              {t("edit")}
            </Typography>
            <Box className="mt-4">
              <Grid2 container spacing={4}>
                <TextField
                  id="id"
                  label="Id"
                  variant="standard"
                  fullWidth
                  margin="dense"
                  value={id}
                  style={{ display: "none" }}
                />
                <Grid2 size={6}>
                  <TextField
                    id="rank"
                    label={t("rank")}
                    variant="standard"
                    fullWidth
                    margin="dense"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    id="point"
                    label={t("point")}
                    variant="standard"
                    fullWidth
                    margin="dense"
                    value={point}
                    onChange={(e) => setPoint(e.target.value)}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <FormControl fullWidth margin="dense" variant="standard">
                    <InputLabel>{t("benefits")}</InputLabel>
                    <Input
                      id="ingredientUsageInstructions"
                      multiline
                      rows={3}
                      value={benefits}
                      onChange={(e) => setBenefits(e.target.value)}
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                  >
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
            </Box>
          </Grid2>
        )}
        {isCreate && (
          <Grid2 size={5}>
            <Typography variant="h6" color="secondary">
              {t("create")}
            </Typography>
            <Box className="mt-4">
              <Grid2 container spacing={4}>
                <Grid2 size={6}>
                  <TextField
                    id="rank"
                    label={t("rank")}
                    variant="standard"
                    fullWidth
                    margin="dense"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    id="point"
                    label={t("point")}
                    variant="standard"
                    fullWidth
                    margin="dense"
                    value={point}
                    onChange={(e) => setPoint(e.target.value)}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <FormControl fullWidth margin="dense" variant="standard">
                    <InputLabel>{t("benefits")}</InputLabel>
                    <Input
                      id="ingredientUsageInstructions"
                      multiline
                      rows={3}
                      value={benefits}
                      onChange={(e) => setBenefits(e.target.value)}
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
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCreate}
                  >
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
            </Box>
          </Grid2>
        )}
      </Grid2>
    </Box>
  );
};

export default ForUser;
