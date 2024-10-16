import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import { apiSearchAffiate } from "../../apis/users";
import AddIcon from "@mui/icons-material/Add";

const AffiliateMarketing = () => {
  const { t } = useTranslation();
  const [referralCode, setReferralCode] = useState("");
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({}); // Lưu các node con đã mở rộng

  useEffect(() => {
    const fetchCustomer = async () => {
      if (referralCode) {
        const response = await apiSearchAffiate(referralCode);
        if (response.status === 200) {
          setFoundCustomer(response.data);
        } else {
          setFoundCustomer(null); // Xóa customer nếu không tìm thấy
        }
      } else {
        setFoundCustomer(null); // Xóa customer khi không có referral code
      }
    };

    fetchCustomer();
  }, [referralCode]);

  // Hàm mở rộng để load descendants cho một node con
  const handleExpandNode = async (referralCode, nodeId) => {
    const response = await apiSearchAffiate(referralCode);
    if (response.status === 200) {
      setExpandedNodes((prev) => ({
        ...prev,
        [nodeId]: response.data.descendants, // Lưu descendants của node con
      }));
    }
  };

  // Hàm render cây liên kết
  const renderNode = (user, descendants, nodeId) => (
    <div key={nodeId || user.zaloId} className="flex flex-col gap-6 ml-4">
      <div className="flex items-center gap-4">
        <Typography variant="body1" className="w-fit">
          {user.name} ({user.referralCode})
        </Typography>
        {/* Button để load descendants */}
        <IconButton
          onClick={() =>
            handleExpandNode(user.referralCode, nodeId || user.zaloId)
          }
        >
          <AddIcon />
        </IconButton>
      </div>

      {/* Nếu node đã mở rộng thì hiển thị descendants */}
      {expandedNodes[nodeId || user.zaloId] && (
        <div className="ml-8">
          {expandedNodes[nodeId || user.zaloId].map((descendant) =>
            renderNode(descendant, descendant.descendants, descendant.zaloId)
          )}
        </div>
      )}
    </div>
  );

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("affiliate-marketing")}</Typography>
      <div className="flex gap-8 items-center">
        <Typography variant="h6">{t("enter-referral-code")} :</Typography>
        <TextField
          size="small"
          id="referralCode"
          placeholder={t("search...")}
          variant="outlined"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {/* Hiển thị user đầu tiên và descendants của họ */}
      {foundCustomer && (
        <div className="flex flex-col gap-4">
          {/* Hiển thị node cha (user) và các node con */}
          {renderNode(foundCustomer.user, foundCustomer.descendants)}
        </div>
      )}
    </Box>
  );
};

export default AffiliateMarketing;
