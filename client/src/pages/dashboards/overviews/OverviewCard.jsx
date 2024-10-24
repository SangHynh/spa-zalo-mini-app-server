import { Box, Card, CardContent, Grid2, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const OverviewCard = ({
    card,
}) => {
    const { t } = useTranslation();

    return (
        <Card sx={{ width: '100%', height: '100%' }} elevation={5}>
            <CardContent sx={{ width: '100%' }}>
                <Grid2 container>
                    <Grid2 size={8}>

                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            {card.title}
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h4">{card.value}</Typography>
                        </Box>
                        {card.progress && (
                            <Box mt={2} width="100%">
                                <Box height={10} bgcolor="#f5f5f5" borderRadius={5}>
                                    <Box
                                        height={10}
                                        width={`${card.value}`}
                                        bgcolor="#ff9800"
                                        borderRadius={5}
                                    />
                                </Box>
                            </Box>
                        )}
                        <Typography color="textSecondary" variant="body2">
                            {card.description}
                        </Typography>
                        {card.change && (
                            <Typography
                                variant="body2"
                                style={{ color: card.changeColor }}
                            >
                                {card.change}
                            </Typography>
                        )}
                    </Grid2>
                    <Grid2 size={4}>
                        {card.icon}

                    </Grid2>
                </Grid2>

            </CardContent>
        </Card>
    );
};

export default OverviewCard;
