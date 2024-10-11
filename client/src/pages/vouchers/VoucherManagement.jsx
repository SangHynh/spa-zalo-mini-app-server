import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import path from "../../utils/path";
import { useTranslation } from "react-i18next";
import { FaPlus, FaSearch } from "react-icons/fa";
import VoucherTable from "../vouchers/VoucherTable";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import GiveVoucher from "./GiveVoucher";

const VoucherManagement = () => {
    const { t } = useTranslation();

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const [openModal, setOpenModal] = useState(false);

    return (
        <Box className="p-8 w-full flex flex-col gap-6">
            <Typography variant="h5">{t("voucher-mgmt")}</Typography>
            <div className="flex justify-between items-center space-x-3">
                <div className="flex-1 w-64 relative">
                    <input
                        type="text"
                        placeholder={t("search...")}
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <FaSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
                </div>
                <Button
                    variant="text"
                    color="success"
                    onClick={handleOpenModal}
                    className="flex-none gap-2"
                >
                    <ForwardToInboxIcon color="success" />
                    {t("give-voucher")}
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    href={path.CREATE_VOUCHER}
                    className="flex-none gap-2"
                >
                    <FaPlus />
                    {t("create")}
                </Button>
            </div>
            <VoucherTable searchTerm={searchTerm} />
            <GiveVoucher open={openModal} onClose={handleCloseModal} />
        </Box>
    );
};

export default VoucherManagement;
