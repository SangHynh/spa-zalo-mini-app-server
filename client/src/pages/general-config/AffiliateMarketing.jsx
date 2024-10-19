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
import RemoveIcon from "@mui/icons-material/Remove";

const AffiliateMarketing = () => {
  const { t } = useTranslation();
  const [referralCode, setReferralCode] = useState("");
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});

  useEffect(() => {
    const fetchCustomer = async () => {
      if (referralCode) {
        const response = await apiSearchAffiate(referralCode);
        if (response.status === 200) {
          setFoundCustomer(response.data);
        } else {
          setFoundCustomer(null);
        }
      } else {
        setFoundCustomer(null);
      }
    };

    fetchCustomer();
  }, [referralCode]);

  const handleToggleNode = async (referralCode, nodeId) => {
    const isExpanded = expandedNodes[nodeId || referralCode];

    if (isExpanded) {
      // Collapse the node
      setExpandedNodes((prev) => ({
        ...prev,
        [nodeId || referralCode]: null,
      }));
    } else {
      // Expand the node and fetch descendants
      const response = await apiSearchAffiate(referralCode);
      if (response.status === 200) {
        setExpandedNodes((prev) => ({
          ...prev,
          [nodeId || referralCode]: response.data.descendants,
        }));
      }
    }
  };

  const renderNode = (user, descendants, nodeId, level = 1) => (
    <div key={nodeId || user.referralCode} className="flex flex-col gap-4 ml-4">
      <div className="flex items-center gap-4">
        <Typography variant="body1" className="w-fit">
          {user.name} ({user.referralCode}) - {t("level")} {level}
        </Typography>
        <IconButton
          onClick={() =>
            handleToggleNode(user.referralCode, nodeId || user.referralCode)
          }
        >
          {expandedNodes[nodeId || user.referralCode] ? (
            <RemoveIcon />
          ) : (
            <AddIcon />
          )}
        </IconButton>
      </div>

      {expandedNodes[nodeId || user.referralCode] && (
        <div className="ml-8 gap-4 flex flex-col">
          {expandedNodes[nodeId || user.referralCode].map((descendant) =>
            renderNode(
              descendant,
              descendant.descendants,
              descendant.referralCode,
              level + 1
            )
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

      {foundCustomer && (
        <div className="flex flex-col gap-4">
          {renderNode(foundCustomer.user, foundCustomer.descendants, null, 1)}
        </div>
      )}
    </Box>
  );
};

export default AffiliateMarketing;
