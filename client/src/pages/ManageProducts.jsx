import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import path from "../utils/path";
import { apiGetProducts } from "../apis/products";
import ProductTable from "./products/ProductTable";
// import { productColumns, productRows } from "../utils/constants";

const ManageProducts = () => {
  // useState(() => {
  //   const fetchProducts = async () => {
  //     const response = await apiGetProducts();
  //     if (response) {
  //       console.log("Successfully fetch products!");
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  return (
    <Box className="p-8 bg-white min-h-screen w-full flex flex-col gap-6">
      <Typography variant="h5">Product Management</Typography>
      <Button variant="outlined" href={path.CREATE_PRODUCT} className="w-fit">
        New Product
      </Button>
      <ProductTable />
    </Box>
  );
};

export default ManageProducts;
