import { Alert, Box, Button, MenuItem, Paper, Snackbar, TextField, Typography } from '@mui/material';
import type { SnackbarCloseReason } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import { useState } from 'react';
import type React from 'react';
import { addExpense } from '../Services/client';
import { ExpenseCategory } from '../interfaces/models';

interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

const Sales = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const [description, setDescription] = useState('');
  const [savedOn, setSavedOn] = useState('');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const resetForm = () => {
    setName('');
    setCategory('');
    setDescription('');
    setSavedOn('');
    setSellingPrice(0);
    setAmount(0);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!category) return;

    setSaving(true);
    try {
      await addExpense({
        title: name,
        category,
        amount,
        sellingPrice,
        description,
        spentOn: savedOn,
      });
      setToast({ open: true, message: 'Record saved successfully', severity: 'success' });
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save record';
      setToast({ open: true, message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  const handleSnackbarClose = (_event: unknown, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    closeToast();
  };

  return (
    <Box className="sales-layout">
      <Box className="sales-intro">
        <Box className="sales-intro-icon">
          <PointOfSaleRoundedIcon />
        </Box>
        <Typography component="h2">Make your next sale count.</Typography>
        <Typography>
          Capture the details once. Your records and totals stay together, ready whenever you need
          them.
        </Typography>
      </Box>

      <Paper component="section" className="form-card" elevation={0}>
        <Typography component="h2" className="form-heading">
          Sale details
        </Typography>
        <Typography className="form-subheading">
          Add the customer and transaction information below.
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit} className="form-fields">
          <TextField
            label="Customer name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            select
            label="Category"
            variant="outlined"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          >
            {Object.values(ExpenseCategory).map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Selling Amount (₹)"
            type="number"
            variant="outlined"
            fullWidth
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
          />
          <TextField
            label="Amount (₹)"
            type="number"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            className="field-wide"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            value={savedOn}
            onChange={(e) => setSavedOn(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button
            type="submit"
            startIcon={<SaveIcon />}
            variant="contained"
            fullWidth
            size="large"
            className="primary-action field-wide"
            disabled={!category || saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sales;