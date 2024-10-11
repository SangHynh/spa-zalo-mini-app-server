import { Box, Card, CardContent, Grid2, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import OverviewCard from "./dashboards/overviews/OverviewCard";
import { LineChart } from "@mui/x-charts/LineChart";
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
      icon: <ArrowUpwardIcon style={{ color: "green" }} />,
    },
    {
      title: "TOTAL CUSTOMERS",
      value: "1.6k",
      change: "-16%",
      description: "Since last month",
      changeColor: "red",
      icon: <ArrowDownwardIcon style={{ color: "red" }} />,
    },
    {
      title: "TASK PROGRESS",
      value: "75.5%",
      description: "",
      progress: true,
    },
    {
      title: "TOTAL PROFIT",
      value: "$15k",
      description: "Since last month",
      changeColor: "blue",
    },
  ];

  const revenueData = [
    20000000, // Doanh thu tháng 1
    15000000, // Doanh thu tháng 2
    30000000, // Doanh thu tháng 3
    40000000, // Doanh thu tháng 4
    25000000, // Doanh thu tháng 5
    35000000, // Doanh thu tháng 6
    45000000, // Doanh thu tháng 7
    50000000, // Doanh thu tháng 8
    48000000, // Doanh thu tháng 9
    null, // Doanh thu tháng 10
    null, // Doanh thu tháng 11
    null, // Doanh thu tháng 12
  ];

  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  return (
    <Box className="w-full flex flex-col gap-6">
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
            xAxis={[{ data: months, scaleType: "point" }]}
            series={[{ data: revenueData }]}
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
                  { id: 0, value: 10, label: "series A" },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" },
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
