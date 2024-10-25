import { Box, Button, Grid2, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { apiGetCommission, apiUpdateCommission } from "../../apis/config";
import Swal from "sweetalert2";
import { useLoading } from "../../context/LoadingProvider";

const Commission = () => {
  const { t } = useTranslation();
  const { showLoading, hideLoading } = useLoading();

  const [baseCommission, setBaseCommission] = useState(0);
  const [reductionPerLevel, setReductionPerLevel] = useState(0);

  // GET COMMISSION
  useEffect(() => {
    const fetchCommission = async () => {
      const response = await apiGetCommission();
      if (response.status === 200) {
        setBaseCommission(response.data.baseCommissionPercent);
        setReductionPerLevel(response.data.reductionPerLevelPercent);
      }
    };

    fetchCommission();
  }, []);

  // UPDATE COMMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();

    const data = {
      baseCommissionPercent: Number(baseCommission),
      reductionPerLevelPercent: Number(reductionPerLevel),
    };

    try {
      const response = await apiUpdateCommission(data);

      console.log(response.status);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: t("config-success"),
          showConfirmButton: true,
          confirmButtonText: "Ok",
        }).then(({ isConfirmed }) => {
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "danger",
        title: t("config-fail"),
        showCancelButton: true,
        cancelButtonText: "Ok",
      });

      console.error("Error config:", error);
    } finally {
      hideLoading();
    }
  };

  return (
    <Box className="w-full gap-6">
      <Typography variant="h5">{t("commission")}</Typography>

      <MathJaxContext>
        <div className="text-gray-500 dark:text-gray-300 border border-gray-300 rounded-md p-4 my-6 italic">
          <Typography variant="h6">
            *Dưới đây là công thức tính phần trăm hoa hồng:
          </Typography>
          <MathJax>
            {`\\[ \\text{Commission} = \\frac{N \\times (1 - \\frac{S}{100})^{n-1}}{100} \\times \\left(1 + \\frac{P}{100}\\right) \\times \\text{Amount} \\]`}
          </MathJax>

          <Typography variant="h6">
            Trong công thức này, các ký hiệu có nghĩa như sau:
          </Typography>
          <ul>
            <li className="my-2 ml-4">
              <MathJax inline>{`\\( N \\)`}</MathJax>: Phần trăm hoa hồng mặc
              định.
            </li>
            <li className="my-2 ml-4">
              <MathJax inline>{`\\( S \\)`}</MathJax>: Phần trăm giảm hoa hồng
              giữa các cấp.
            </li>
            <li className="my-2 ml-4">
              <MathJax inline>{`\\( n \\)`}</MathJax>: Cấp bậc hiện tại của
              người đăng ký, xác định vị trí của họ trong cây đa cấp (n càng lớn
              càng về đỉnh, n càng nhỏ càng cận khách hàng hiện tại) .
            </li>
            <li className="my-2 ml-4">
              <MathJax inline>{`\\( P \\)`}</MathJax>: Phần trăm hoa hồng bổ
              sung dựa trên hạng của khách hàng.
            </li>
          </ul>
        </div>
      </MathJaxContext>

      <Grid2 container fullWidth spacing={1} sx={{ mt: 2 }}>
        <Grid2 size={12}>
          <Typography variant="h6">
            {t("Các thông tin có thể cấu hình")}
          </Typography>
        </Grid2>
        <Grid2 size={6}>
          <TextField
            label={t("N")}
            variant="standard"
            fullWidth
            margin="dense"
            value={baseCommission}
            onChange={(e) => setBaseCommission(e.target.value)}
          />
        </Grid2>
        <Grid2 size={6}>
          <TextField
            label={t("S")}
            variant="standard"
            fullWidth
            margin="dense"
            value={reductionPerLevel}
            onChange={(e) => setReductionPerLevel(e.target.value)}
          />
        </Grid2>
      </Grid2>

      <Grid2
        container
        fullWidth
        spacing={2}
        sx={{ mt: 2, justifyContent: "flex-end" }}
      >
        <Grid2>
          <Button onClick={handleSubmit} variant="contained" color="success">
            {t("update")}
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Commission;
