import { Box, Card, CardContent, Grid2, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import OverviewCard from "./dashboards/overviews/OverviewCard";
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from "@mui/x-charts";

const Dashboard = () => {
  const { t } = useTranslation();

  const cards = [
    {
      title: "BUDGET",
      value: "$24k",
      change: "+12%",
      description: "Since last month",
      changeColor: "green",
      icon: <ArrowUpwardIcon style={{ color: 'green' }} />
    },
    {
      title: "TOTAL CUSTOMERS",
      value: "1.6k",
      change: "-16%",
      description: "Since last month",
      changeColor: "red",
      icon: <ArrowDownwardIcon style={{ color: 'red' }} />
    },
    {
      title: "TASK PROGRESS",
      value: "75.5%",
      description: "",
      progress: true
    },
    {
      title: "TOTAL PROFIT",
      value: "$15k",
      description: "Since last month",
      changeColor: "blue",
    },
  ];

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      {/* <Typography variant="h5" gutterBottom>
        {t("overview")}
      </Typography> */}

      {/* Overview */}
      <Grid2 container spacing={3}>
        {cards.map((card, index) => (
          <Grid2 size={3} key={index}>
            <OverviewCard card={card} />
          </Grid2>
        ))}

        <Grid2 size={8}>
          <Typography variant="h6" align="center" gutterBottom>
            Biểu đồ doanh thu theo năm 2025
          </Typography>

          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            height={400}
          />

        </Grid2>

        <Grid2 size={4}>
          <Typography variant="h6" align="center" gutterBottom>
            Biểu đồ các sản phẩm được quan tâm nhất
          </Typography>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: 'series A' },
                  { id: 1, value: 15, label: 'series B' },
                  { id: 2, value: 20, label: 'series C' },
                ],
              },
            ]}
            height={200}
          />

        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Dashboard;
