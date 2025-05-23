import React, { useState } from 'react';
import SurveyFilters from '../components/SurveyFilters';
import SurveyResultsTable from '../components/SurveyResultsTable';
import { getSurveyData } from '../services/api';
import { Box, Typography, CircularProgress, Button, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const SurveyDashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const handleFilter = async (filters: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSurveyData(filters);
      setData(result);
    } catch (err) {
      setError('Failed to fetch survey data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4">
          Survey Dashboard
        </Typography>
        <Button variant="outlined" color="error" onClick={logout}>
          Logout
        </Button>
      </Box>
      
      <SurveyFilters 
        onFilter={handleFilter} 
        resultCount={data.length} 
      />
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}
      
      {error && (
        <Box sx={{ 
          backgroundColor: 'error.light', 
          p: 2, 
          borderRadius: 1,
          mb: 2
        }}>
          <Typography color="error">
            {error}
          </Typography>
        </Box>
      )}
      
      <SurveyResultsTable data={data} />
    </Container>
  );
};

export default SurveyDashboard;