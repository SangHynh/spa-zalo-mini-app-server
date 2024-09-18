import React, { useState } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import path from "../utils/path";
import { apiGetProducts } from "../apis/products";

const ManageProducts = () => {
  useState(() => {
    const fetchProducts = async () => {
      const response = await apiGetProducts();
      if (response) {
        console.log("Successfully fetch products!")
      }
    }

    fetchProducts()
  }, [])

  return (
    <Box className="m-3">
      <Typography variant="h5" gutterBottom>
        Product Management
      </Typography>
      <Button variant="outlined" href={path.CREATE_PRODUCT}>
        New Product
      </Button>
    </Box>
  );
};

export default ManageProducts;
