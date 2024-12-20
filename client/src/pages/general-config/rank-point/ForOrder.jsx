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
  apiCreateOrderPoint,
  apiDeleteOrderPoint,
  apiGetOrderPoints,
  apiUpdateOrderPoint,
} from "../../../apis/config";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import OrderActionDialog from "./OrderActionDialog";

const ForOrder = () => {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [id, setId] = useState("");
  const [price, setPrice] = useState("");
  const [point, setPoint] = useState("");
  const [originalRow, setOriginalRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchOrderPoints = async () => {
      try {
        const response = await apiGetOrderPoints();

        if (Array.isArray(response.data)) {
          setRows(response.data);
        } else {
          setRows([]);
        }
      } catch (error) {
        console.error("Error fetching oderPoints:", error);
      }
    };

    fetchOrderPoints();
  }, []);

  const handleEditBtn = (row) => {
    setIsEdit(true);
    setIsCreate(false);
    setId(row._id);
    setPrice(row.price);
    setPoint(row.minPoints);
    setOriginalRow(row); // Save original row
    setOpen(true);
  };

  const handleCreateBtn = () => {
    setIsCreate(true);
    setIsEdit(false);
    setId(null);
    setPrice("");
    setPoint(0);
    setOriginalRow(null);
    setOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
    setOpen(false);
  };

  const handleCancelCreate = () => {
    setIsCreate(false);
    setOpen(false);
  };

  const handleClose = () => {
    setIsEdit(false);
    setIsCreate(false);
    setOpen(false);
  }

  const handleUpdate = async () => {
    try {
      const orderPointData = {
        price: price,
        minPoints: point,
      };

      const response = await apiUpdateOrderPoint(id, orderPointData);

      if (
        originalRow &&
        orderPointData.price === originalRow.price &&
        orderPointData.minPoints === originalRow.minPoints
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
      console.error("Error updating oderPoints:", error);
      Swal.fire({
        title: `${t("error")}!`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleCreate = async () => {
    try {
      const orderPointData = {
        price: price,
        minPoints: point,
      };

      const response = await apiCreateOrderPoint(orderPointData);

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
      console.error("Error create oderPoints:", error);
      Swal.fire({
        title: `${t("error")}!`,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleDelete = async (orderPointId) => {
    const confirmDelete = await Swal.fire({
      title: `${t("confirm")}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `${t("yes")}`,
      cancelButtonText: `${t("no")}`,
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await apiDeleteOrderPoint(orderPointId);

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
        console.error("Error deleting oderPoints:", error);
        Swal.fire({
          title: `${t("error")}!`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  };

  return (
    <Box className="w-full flex flex-col gap-4">
      <Button
        variant="contained"
        color="secondary"
        className="w-fit flex items-center gap-2"
        onClick={handleCreateBtn}
      >
        <FaPlus />
        {t("create")}
      </Button>
      <Grid2 container spacing={4}>
        <Grid2 size={12}>
          <TableContainer component={Paper} className="border shadow-2xl">
            <Table aria-label="simple table">
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
                    {t("price")} (VNĐ)
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
                    <TableCell align="center" sx={{ width: "20%" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell
                      align="right"
                      component="th"
                      scope="row"
                      sx={{ width: "30%" }}
                    >
                      {row.price.toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell align="right" sx={{ width: "30%" }}>
                      {row.minPoints}
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex justify-center gap-2"
                        sx={{ width: "30%" }}
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
        <OrderActionDialog
          open={open}
          onClose={handleClose}
          isEdit={isEdit}
          isCreate={isCreate}
          handleUpdate={handleUpdate}
          handleCreate={handleCreate}
          handleCancelEdit={handleCancelEdit}
          handleCancelCreate={handleCancelCreate}
          id={id}
          price={price}
          point={point}
          setPrice={setPrice}
          setPoint={setPoint}
        />
      </Grid2>
    </Box>
  );
};

export default ForOrder;
