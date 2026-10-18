import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import { useState } from 'react';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import type { ExpenseRecord } from '../interfaces/models';

interface ExpenseListProps {
  expenses: ExpenseRecord[];
}

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const profitColor = (profit: number) =>
  profit > 0 ? 'success.main' : profit < 0 ? 'error.main' : 'text.primary';

const formatMonth = (month: string) => {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(year, monthNumber - 1, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
};

const ExpenseList = ({ expenses }: ExpenseListProps) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const months = [...new Set(expenses.map((expense) => expense.spentOn.slice(0, 7)))]
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a));
  const categories = [...new Set(expenses.map((expense) => expense.category))].sort((a, b) =>
    a.localeCompare(b),
  );
  const filteredExpenses = expenses.filter(
    (expense) =>
      (!selectedMonth || expense.spentOn.startsWith(selectedMonth)) &&
      (!selectedCategory || expense.category === selectedCategory),
  );
  const hasActiveFilters = Boolean(selectedMonth || selectedCategory);
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSelling = filteredExpenses.reduce((sum, e) => sum + e.sellingPrice, 0);
  const totalProfit = totalSelling - totalAmount;

  return (
    <Box className="records-page">
      <Box className="records-heading">
        <Box>
          <Typography component="h1">Records overview</Typography>
          <Typography>Review your sales, costs, and profit in one place.</Typography>
        </Box>
        <Box className="records-count">
          {filteredExpenses.length}
          {hasActiveFilters ? ` of ${expenses.length}` : ''}{' '}
          {filteredExpenses.length === 1 ? 'record' : 'records'}
        </Box>
      </Box>

      <Box className="summary-grid">
        <Paper className="summary-card" elevation={0}>
          <Box className="summary-icon amber">
            <AccountBalanceWalletRoundedIcon />
          </Box>
          <Box>
            <Typography className="summary-label">Total cost</Typography>
            <Typography className="summary-value">{formatAmount(totalAmount)}</Typography>
          </Box>
        </Paper>
        <Paper className="summary-card" elevation={0}>
          <Box className="summary-icon">
            <Inventory2RoundedIcon />
          </Box>
          <Box>
            <Typography className="summary-label">Total sales</Typography>
            <Typography className="summary-value">{formatAmount(totalSelling)}</Typography>
          </Box>
        </Paper>
        <Paper className="summary-card" elevation={0}>
          <Box className="summary-icon green">
            <TrendingUpRoundedIcon />
          </Box>
          <Box>
            <Typography className="summary-label">Net profit</Typography>
            <Typography
              className="summary-value"
              sx={{ color: totalProfit < 0 ? 'error.main' : 'success.main' }}
            >
              {formatAmount(totalProfit)}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Paper className="records-table-card" elevation={0}>
        {expenses.length === 0 ? (
          <Box className="empty-state">
            <Box className="empty-state-icon">
              <ReceiptLongRoundedIcon />
            </Box>
            <Typography className="empty-state-title">No records just yet</Typography>
            <Typography color="text.secondary">
              Your saved sales will appear here when you add one.
            </Typography>
          </Box>
        ) : (
          <>
            <Box className="records-filters">
              <TextField
                select
                size="small"
                label="Month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                <MenuItem value="">All months</MenuItem>
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {formatMonth(month)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                size="small"
                label="Category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <MenuItem value="">All categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
              {hasActiveFilters && (
                <Button
                  className="clear-record-filters"
                  onClick={() => {
                    setSelectedMonth('');
                    setSelectedCategory('');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </Box>
            {filteredExpenses.length === 0 ? (
              <Box className="empty-state">
                <Box className="empty-state-icon">
                  <ReceiptLongRoundedIcon />
                </Box>
                <Typography className="empty-state-title">No matching records</Typography>
                <Typography color="text.secondary">
                  Try changing or clearing your filters.
                </Typography>
              </Box>
            ) : (
              <TableContainer className="records-table-scroll">
                <Table className="records-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Selling price</TableCell>
                      <TableCell align="right">Profit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredExpenses.map((expense) => {
                      const profit = expense.sellingPrice - expense.amount;
                      return (
                        <TableRow key={expense.id} hover>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {formatDate(expense.spentOn)}
                          </TableCell>
                          <TableCell sx={{ color: '#25324a !important', fontWeight: 650 }}>
                            {expense.title}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={expense.category}
                              size="small"
                              sx={{
                                borderRadius: 2,
                                color: '#5366ce',
                                bgcolor: '#eff1ff',
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            />
                          </TableCell>
                          <TableCell>{expense.description || '—'}</TableCell>
                          <TableCell align="right">{formatAmount(expense.amount)}</TableCell>
                          <TableCell align="right">{formatAmount(expense.sellingPrice)}</TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: profitColor(profit),
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatAmount(profit)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="total-row">
                      <TableCell colSpan={4} sx={{ color: '#25324a !important', fontWeight: 750 }}>
                        Total
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#25324a !important', fontWeight: 750 }}>
                        {formatAmount(totalAmount)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#25324a !important', fontWeight: 750 }}>
                        {formatAmount(totalSelling)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 750,
                          color: profitColor(totalProfit),
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatAmount(totalProfit)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ExpenseList;