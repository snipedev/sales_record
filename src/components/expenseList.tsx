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
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
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

const ExpenseList = ({ expenses }: ExpenseListProps) => {
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSelling = expenses.reduce((sum, e) => sum + e.sellingPrice, 0);
  const totalProfit = totalSelling - totalAmount;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 1100, mx: 'auto' }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'black' }}
        >
          <ReceiptLongIcon />
          Expense Records
        </Typography>

        {expenses.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No expense records yet.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Selling Price</TableCell>
                  <TableCell align="right">Profit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => {
                  const profit = expense.sellingPrice - expense.amount;
                  return (
                    <TableRow key={expense.id} hover>
                      <TableCell>{formatDate(expense.spentOn)}</TableCell>
                      <TableCell>{expense.title}</TableCell>
                      <TableCell>
                        <Chip label={expense.category} size="small" />
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell align="right">{formatAmount(expense.amount)}</TableCell>
                      <TableCell align="right">{formatAmount(expense.sellingPrice)}</TableCell>
                      <TableCell align="right" sx={{ color: profitColor(profit) }}>
                        {formatAmount(profit)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                    Total
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatAmount(totalAmount)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatAmount(totalSelling)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 'bold', color: profitColor(totalProfit) }}
                  >
                    {formatAmount(totalProfit)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ExpenseList;