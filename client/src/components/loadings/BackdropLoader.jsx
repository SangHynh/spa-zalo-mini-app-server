import React from 'react';
import { useLoading } from "../../context/LoadingProvider";
import CircularProgress from '@mui/material/CircularProgress';
import { Backdrop } from '@mui/material';

const BackdropLoader = () => {
    const { loading } = useLoading();
  
    return (
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };
  
  export default BackdropLoader;