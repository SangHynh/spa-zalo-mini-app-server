import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { TableHead, TextField } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Close';

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function PaginationTable({ rows, columns, onDelete, onEditRow }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [editRow, setEditRow] = React.useState(null); // Thêm trạng thái để theo dõi dòng đang chỉnh sửa
    const [editData, setEditData] = React.useState({}); // Thêm trạng thái để lưu dữ liệu chỉnh sửa

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditClick = (row) => {
        setEditRow(row._id); // Lưu ID của dòng đang chỉnh sửa
        setEditData(row); // Lưu dữ liệu dòng đó vào trạng thái chỉnh sửa
    };

    const handleSave = () => {
        onEditRow(editData);
        setEditRow(null);
        setEditData({});
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                {/* Dynamic Table Headers */}
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column}>
                                {column.charAt(0).toUpperCase() + column.slice(1)}
                            </TableCell>
                        ))}
                        <TableCell key="actions">Actions</TableCell>
                    </TableRow>
                </TableHead>
                {/* Dynamic Table Rows */}
                <TableBody>
                    {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                    ).map((row) => (
                        <TableRow key={row._id}>
                            {columns.map((column) => (
                                <TableCell key={column} align={typeof row[column] === 'number' ? 'right' : 'left'}>
                                    {editRow === row._id ? (
                                        <TextField
                                            value={editData[column] || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Kiểm tra kiểu dữ liệu để chuyển đổi
                                                const updatedValue = typeof row[column] === 'number' ? Number(value) : value;
                                                setEditData({ ...editData, [column]: updatedValue });
                                            }}
                                            type={typeof row[column] === 'number' ? 'number' : 'text'}
                                        />
                                    ) : (
                                        row[column]
                                    )}
                                </TableCell>
                            ))}
                            <TableCell>
                                {editRow === row._id ? (
                                    <>
                                        <IconButton onClick={handleSave} color="primary">
                                            <SaveIcon /> {/* Icon lưu */}
                                        </IconButton>
                                        <IconButton onClick={() => setEditRow(null)} color="secondary">
                                            <CancelIcon /> {/* Icon hủy */}
                                        </IconButton>
                                    </>
                                ) : (
                                    <IconButton onClick={() => handleEditClick(row)} color="primary">
                                        <EditIcon /> {/* Icon chỉnh sửa */}
                                    </IconButton>
                                )}
                                <IconButton onClick={() => onDelete(row._id)} color="error">
                                    <RemoveCircleIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}

                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={columns.length + 1} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={columns.length + 1}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}