import React from 'react';
import { Modal, Box, Typography, ImageList, ImageListItem, List, ListItem, ListItemText, Button, Grid2 } from '@mui/material';
import dayjs from 'dayjs';

const PreviewService = ({
    open,
    handleClose,
    serviceName,
    serviceAmount,
    serviceCategory,
    serviceSubCategory,
    serviceDescription,
    images,
}) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '75%', height: '80vh', bgcolor: 'background.paper', boxShadow: 24, p: 4, overflow: 'auto' }}>
                <Typography variant="h6" component="h2">
                    Service Preview
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>Name:</strong> {serviceName}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>Amount:</strong> {serviceAmount} VND
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>Category:</strong> {serviceCategory?.name} - {serviceSubCategory?.name}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>Description:</strong> {serviceDescription}
                </Typography>
                <Typography sx={{ mt: 2 }}><strong>Images:</strong></Typography>
                {images.length > 0 && (
                    <ImageList sx={{ height: 250, mt: 2 }} cols={5} rowHeight={150}>
                        {images.map((imgSrc, index) => (
                            <ImageListItem key={index}>
                                <img src={imgSrc} alt={`Uploaded ${index}`} loading="lazy" />
                            </ImageListItem>
                        ))}
                    </ImageList>
                )}

                <Grid2 container fullWidth spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                    <Grid2>
                        <Button onClick={handleClose} sx={{ mt: 2 }} variant="outlined">
                            Close
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>
        </Modal>
    );
};

export default PreviewService;
