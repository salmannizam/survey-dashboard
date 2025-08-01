import React, { useState } from 'react';
import SurveyFilters from '../components/SurveyFilters';
import SurveyResultsTable from '../components/SurveyResultsTable';
import { getSurveyData } from '../services/api';
import {
  Box, Typography, CircularProgress, Container,
  CssBaseline, Toolbar, AppBar, IconButton, Tooltip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';
import { exportSurveyExcel } from '../services/api';



const SurveyDashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState<any>({
    fromDate: null,
    toDate: null,
    // plus any others if you want
  });


  const { logout } = useAuth();

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
          // Light mode specific overrides
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: '#212121',  // Dark gray for primary text
            secondary: '#757575', // Medium gray for secondary text
          },
        }
        : {
          // Dark mode specific overrides
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',  // White for primary text
            secondary: '#b0b0b0', // Light gray for secondary text
          },
        }),
    },
    typography: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
            },
          },
        },
      },
      // Add this to ensure TableCell text is visible
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: 'inherit', // This ensures text color inherits from theme
          },
        },
      },
    },
  });
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleFilter = async (convertedFilters: any, rawFilters: any) => {
    setFilters(rawFilters); // Now will contain real Date objects
    setLoading(true);
    setError(null);
    try {
      const result = await getSurveyData(convertedFilters); // Use the stringified ones for backend API
      setData(result);
    } catch (err) {
      setError('Failed to fetch survey data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleExportExcel = async () => {
    // Assume you store filters in a state variable, e.g. surveyFilters
    const { fromDate, toDate, ...otherFilters } = filters; // or get from props/state

    if (!fromDate || !toDate) {
      alert('Please select From and To Date to export!');
      return;
    }
    setExporting(true);
    try {
      const res = await exportSurveyExcel(
        fromDate?.toISOString().split('T')[0],
        toDate?.toISOString().split('T')[0],
        otherFilters // pass extra filters if needed
      );
      const blob = res.data;
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `survey-data-${fromDate.toISOString().split('T')[0]}-to-${toDate.toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed!');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" elevation={0} color="default">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Survey Analytics Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

              <Typography variant="subtitle2" color="text.secondary">
                Welcome, Admin
              </Typography>

              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton onClick={toggleColorMode} color="inherit">
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Logout">
                <IconButton
                  onClick={logout}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <ExitToAppIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
          <SurveyFilters
            onFilter={handleFilter}
            resultCount={data.length}
          />

          {loading && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px'
            }}>
              <CircularProgress size={60} />
            </Box>
          )}

          {error && (
            <Box sx={{
              backgroundColor: 'error.light',
              p: 2,
              borderRadius: 2,
              mb: 3,
              display: 'flex',
              alignItems: 'center'
            }}>
              <Typography color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>⚠️</span>
                {error}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              onClick={handleExportExcel}
              disabled={!filters.fromDate || !filters.toDate || exporting}
            >
              {exporting ? 'Exporting...' : 'Export to Excel'}
            </Button>
          </Box>

          <SurveyResultsTable data={data} />
        </Container>

        <Box component="footer" sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(0, 0, 0, 0.02)'
            : 'rgba(255, 255, 255, 0.04)'
        }}>
          <Container maxWidth="xl">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Survey Analytics Platform. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SurveyDashboard;