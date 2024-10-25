import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import { apiSearchAffiate } from "../../apis/users";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import './AffiliateMarketing.css';

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
    <div key={nodeId || user.referralCode} className="tree-node">
      <div className="tree-content">
        <IconButton
          onClick={() =>
            handleToggleNode(user.referralCode, nodeId || user.referralCode)
          }
        >
          {expandedNodes[nodeId || user.referralCode] ? (
            <RemoveCircleIcon />
          ) : (
            <AddCircleIcon />
          )}
        </IconButton>
        <Typography variant="body1" className="w-fit">
          {user.name} ({user.referralCode}) - - - - - - - <Chip label={user.membershipTier} variant="outlined" sx={{ color: (user.rankColor), borderColor: (user.rankColor) }} /> - - - - - - - {t("level")} {level}
        </Typography>
      </div>

      {expandedNodes[nodeId || user.referralCode] && (
        <div className="tree-children">
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
        <div className="tree-container">
          {renderNode(foundCustomer.user, foundCustomer.descendants, null, 1)}
        </div>
      )}
    </Box>
  );
};

export default AffiliateMarketing;
