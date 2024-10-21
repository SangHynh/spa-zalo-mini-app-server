import { Box, Card, CardContent, Grid2, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import OverviewCard from "./dashboards/overviews/OverviewCard";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts";
import { apiGetRevenue, apiGetTopProductsAndServices } from "../apis/statistics";

const Dashboard = () => {
  const { t } = useTranslation();

  const [revenueData, setRevenueData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [period, setPeriod] = useState("year");

  useEffect(() => {
    const fetchRevenueData = async () => {
      const response = await apiGetRevenue(period);
      if (response.status === 200) {
        if (period === "year") {
          setLabels([
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ]);
        } else if (period === "month") {
          const daysInMonth = new Date(to).getDate();
          setLabels(Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`));
        } else if (period === "week") {
          setLabels(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
        }

        setRevenueData(response.data.revenueData);
      }
    };

    fetchRevenueData();
  }, [period]);

  const [limit, setLimit] = useState(10);
  const [topProducts, setTopProducts] = useState([])
  const [topServices, setTopServices] = useState([])

  useEffect(() => {
    const fetchTopProductsAndServices = async () => {
      const response = await apiGetTopProductsAndServices(limit);
      if (response.status === 200) {
        const formattedProducts = response.data.topProducts.map(product => ({
          id: product.name,
          value: product.salesQuantity,
          label: product.name
        }));

        const formattedServices = response.data.topServices.map(service => ({
          id: service.name,
          value: service.timesUsed,
          label: service.name
        }));

        setTopProducts(formattedProducts);
        setTopServices(formattedServices);
      }
    };

    fetchTopProductsAndServices();
  }, [limit])

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

        <Grid2 size={12}>
          <Typography variant="h6" align="center" gutterBottom>
            Biểu đồ doanh thu theo năm 2025
          </Typography>

          <LineChart
            xAxis={[{ data: labels, scaleType: "point" }]}
            series={[{ data: revenueData, area: true, valueFormatter: (amount) => amount?.toLocaleString("vi-VN") + " VNĐ" }]}
            height={400}
          />
        </Grid2>

        <Grid2 container size={12} spacing={3}>
          <Grid2 size={12}>
            <Typography variant="h6" align="center" gutterBottom>
              Biểu đồ các sản phẩm được quan tâm nhất
            </Typography>
            <PieChart
              series={[
                {
                  data: topProducts,
                },
              ]}
              height={200}
            />
          </Grid2>
          
          <Grid2 size={12}>
            <Typography variant="h6" align="center" gutterBottom>
              Biểu đồ các dịch vụ được quan tâm nhất
            </Typography>
            <PieChart
              series={[
                {
                  data: topServices,
                },
              ]}
              height={200}
            />
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Dashboard;
