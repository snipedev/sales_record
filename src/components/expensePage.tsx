import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';
import ExpenseList from './expenseList';
import { getExpenses } from '../Services/client';
import type { ExpenseRecord } from '../interfaces/models';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getExpenses()
      .then(setExpenses)
      .catch((err) => setError(err.message ?? 'Failed to load expenses'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  return <ExpenseList expenses={expenses} />;
};

export default ExpensePage;