import { Box, Card, CardContent, Divider, FormControl, Grid2, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material";
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
  const [year, setYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    const fetchRevenueData = async () => {
      const response = await apiGetRevenue(year);
      if (response.status === 200) {
        setLabels([
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]);

        setRevenueData(response.data.revenueData);
      }
    };

    fetchRevenueData();
  }, [year]);

  const [productLimit, setProductLimit] = useState(10);
  const [serviceLimit, setServiceLimit] = useState(10);
  const [topProducts, setTopProducts] = useState([])
  const [topServices, setTopServices] = useState([])

  useEffect(() => {
    const fetchTopProductsAndServices = async () => {
      const response = await apiGetTopProductsAndServices(productLimit, serviceLimit);
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
  }, [productLimit, serviceLimit])

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
      {/* Overview */}
      <Grid2 container spacing={3} className='mb-5'>
        {cards.map((card, index) => (
          <Grid2 size={3} key={index}>
            <OverviewCard card={card} />
          </Grid2>
        ))}

        <Grid2 size={12}>
          <Typography variant="h6" align="center" gutterBottom>
            <Divider>
              1. Biểu đồ doanh thu theo năm
              <FormControl variant="standard" sx={{ marginLeft: 1 }}>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  label="Age"
                >
                  <MenuItem value={"2021"}>2021</MenuItem>
                  <MenuItem value={"2022"}>2022</MenuItem>
                  <MenuItem value={"2023"}>2023</MenuItem>
                  <MenuItem value={"2024"}>2024</MenuItem>
                  <MenuItem value={"2025"}>2025</MenuItem>
                  <MenuItem value={"2026"}>2026</MenuItem>
                  <MenuItem value={"2027"}>2027</MenuItem>
                  <MenuItem value={"2028"}>2028</MenuItem>
                  <MenuItem value={"2029"}>2029</MenuItem>
                  <MenuItem value={"2030"}>2030</MenuItem>
                </Select>
              </FormControl>
            </Divider>
          </Typography>

          <LineChart
            xAxis={[{ data: labels, scaleType: "point" }]}
            series={[{ data: revenueData, area: true, valueFormatter: (amount) => amount?.toLocaleString("vi-VN") + " VNĐ" }]}
            height={400}
            margin={{ left: 75 }}
          />
        </Grid2>

        <Grid2 container size={12} spacing={3}>
          <Grid2 size={12}>
            <Typography variant="h6" align="center" gutterBottom>
              <Divider>
                2. Biểu đồ các sản phẩm được quan tâm nhất
              </Divider>
            </Typography>
          </Grid2>

          <Grid2 size={9}>
            <PieChart
              series={[
                {
                  data: topProducts,
                  innerRadius: 30,
                  outerRadius: 120,
                  paddingAngle: 1,
                  cornerRadius: 8,
                  startAngle: 0,
                  endAngle: 360,
                  cx: 200
                },
              ]}
              height={250}
            />
          </Grid2>

          <Grid2 size={3}>
            <Slider value={productLimit} onChange={(e) => setProductLimit(e.target.value)} valueLabelDisplay="auto" max={50} min={3} />
          </Grid2>

          <Grid2 size={12}>
            <Typography variant="h6" align="center" gutterBottom>
              <Divider>
                3. Biểu đồ các dịch vụ được quan tâm nhất
              </Divider>
            </Typography>
          </Grid2>

          <Grid2 size={9}>
            <PieChart
              series={[
                {
                  data: topServices,
                  innerRadius: 30,
                  outerRadius: 120,
                  paddingAngle: 1,
                  cornerRadius: 8,
                  startAngle: 0,
                  endAngle: 360,
                  cx: 200
                },
              ]}
              height={250}
            />
          </Grid2>

          <Grid2 size={3}>
            <Slider value={serviceLimit} onChange={(e) => setServiceLimit(e.target.value)} valueLabelDisplay="auto" max={50} min={3} />
          </Grid2>

        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Dashboard;
