import './App.css';
import { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
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
      <Box className="loading-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!session) return <Login />;

  const activeTitle = tab === 'sales' ? 'New sale' : 'Records';
  const today = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <Box className="app-shell">
      <Box component="aside" className="sidebar">
        <Box className="brand-lockup">
          <Box className="brand-mark">
            <StorefrontRoundedIcon fontSize="small" />
          </Box>
          <Box>
            <Box className="brand-name">Sales Desk</Box>
            <Box className="brand-caption">Sales workspace</Box>
          </Box>
        </Box>

        <Box className="sidebar-section-label">Workspace</Box>
        <Box component="nav" className="sidebar-nav" aria-label="Main navigation">
          <Button
            className={`sidebar-link${tab === 'sales' ? ' active' : ''}`}
            aria-current={tab === 'sales' ? 'page' : undefined}
            onClick={() => setTab('sales')}
            startIcon={<PointOfSaleRoundedIcon />}
          >
            New sale
          </Button>
          <Button
            className={`sidebar-link${tab === 'expenses' ? ' active' : ''}`}
            aria-current={tab === 'expenses' ? 'page' : undefined}
            onClick={() => setTab('expenses')}
            startIcon={<ReceiptLongRoundedIcon />}
          >
            Records
          </Button>
        </Box>

        <Box className="sidebar-bottom">
          <Box className="sidebar-divider" />
          <Button
            className="sidebar-link"
            onClick={() => supabase.auth.signOut()}
            startIcon={<LogoutRoundedIcon />}
          >
            Sign out
          </Button>
        </Box>
      </Box>

      <Box component="main" className="workspace">
        <Box component="header" className="topbar">
          <Box>
            <Box className="topbar-kicker">Sales workspace</Box>
            <Typography component="h1" className="topbar-title">
              {activeTitle}
            </Typography>
          </Box>
          <Box className="topbar-date">
            <CalendarTodayRoundedIcon sx={{ fontSize: 14 }} />
            {today}
          </Box>
        </Box>
        <Box className="page-content">
          {tab === 'sales' ? <Sales /> : <ExpensePage />}
        </Box>
      </Box>
    </Box>
  );
}

export default App;