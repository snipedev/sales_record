import './App.css';
import { useState } from 'react';
import { AppBar, Box, Button, CircularProgress, Tab, Tabs, Toolbar } from '@mui/material';
import Login from './components/login';
import Sales from './components/sales';
import ExpensePage from './components/expensePage';
import { useSession } from './hooks/useSession';
import { supabase } from './Services/client';

function App() {
  const { session, loading } = useSession();
  const [tab, setTab] = useState<'sales' | 'expenses'>('sales');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session) return <Login />;

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab label="New Sale" value="sales" />
            <Tab label="Records" value="expenses" />
          </Tabs>
          <Button onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </Toolbar>
      </AppBar>

      {tab === 'sales' ? <Sales /> : <ExpensePage />}
    </>
  );
}

export default App;