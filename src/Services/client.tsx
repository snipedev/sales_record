import { createClient } from '@supabase/supabase-js';
import type { ExpenseRecord } from '../interfaces/models';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Shape of a row as it comes back from the database (snake_case)
interface ExpenseRow {
  id: number;
  title: string;
  category: string;
  amount: number | string;
  selling_price: number | string;
  description: string | null;
  spent_on: string;
}

// DB row -> camelCase interface
const toExpenseRecord = (row: ExpenseRow): ExpenseRecord => ({
  id: row.id,
  title: row.title,
  category: row.category,
  amount: Number(row.amount),
  sellingPrice: Number(row.selling_price),
  description: row.description ?? '',
  spentOn: row.spent_on,
});

export async function addExpense(expense: Omit<ExpenseRecord, 'id'>) {
  const { data, error } = await supabase
    .from('expense_records')
    .insert({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      selling_price: expense.sellingPrice,
      description: expense.description,
      spent_on: expense.spentOn,
    })
    .select() // returns the inserted row (including generated id)
    .single();

  if (error) {
    console.error('Insert failed:', error.message);
    throw error;
  }

  return toExpenseRecord(data as ExpenseRow);
}

export async function getExpenses(): Promise<ExpenseRecord[]> {
  const { data, error } = await supabase
    .from('expense_records')
    .select('*')
    .order('spent_on', { ascending: false });

  if (error) {
    console.error('Fetch failed:', error.message);
    throw error;
  }

  return (data as ExpenseRow[]).map(toExpenseRecord);
}