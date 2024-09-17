import React from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import path from "../utils/path";

const ManageProducts = () => {
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
