import React, { useEffect, useState } from 'react';
import { 
  TextField, Button, Box, Typography, Divider, Card, CardContent 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Clear as ClearIcon } from '@mui/icons-material';

interface SurveyFiltersProps {
  onFilter: (filters: any) => void;
  resultCount?: number;
}

interface Filters {
  outletName: string;
  fromDate: Date | null;
  toDate: Date | null;
  brand: string;
  location: string;
  state: string;
  defectType: string;
  batchNumber: string;
}

const SurveyFilters: React.FC<SurveyFiltersProps> = ({ onFilter, resultCount }) => {
  const [filters, setFilters] = useState<Filters>({
    outletName: '',
    fromDate: null,
    toDate: null,
    brand: '',
    location: '',
    state: '',
    defectType: '',
    batchNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, value: Date | null) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if( e ){
      e.preventDefault() 
    }
    onFilter({
      OutletNameInput: filters.outletName,
      FromDate: filters.fromDate?.toISOString().split('T')[0] || '',
      ToDate: filters.toDate?.toISOString().split('T')[0] || '',   
      Brand: filters.brand,
      Location: filters.location,
      State: filters.state,
      defect_type: filters.defectType,
      BatchNumber: filters.batchNumber
    });
  };

  useEffect(()=>{
    handleSubmit()
  },[])

  const handleReset = () => {
    setFilters({
      outletName: '',
      fromDate: null,
      toDate: null,
      brand: '',
      location: '',
      state: '',
      defectType: '',
      batchNumber: ''
    });
    onFilter({}); // Send empty filters to reset
  };

  const formatDateToMMDDYYYY = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}${dd}${yyyy}`;
  };
  

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filter Surveys
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 2
            }}
          >
            <TextField
              fullWidth
              label="Outlet Name"
              name="outletName"
              value={filters.outletName}
              onChange={handleChange}
              size="small"
            />

            <DatePicker
              label="From Date"
              value={filters.fromDate}
              onChange={(date) => handleDateChange('fromDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                },
              }}
            />
            <DatePicker
              label="To Date"
              value={filters.toDate}
              onChange={(date) => handleDateChange('toDate', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                },
              }}
            />
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={filters.brand}
              onChange={handleChange}
              size="small"
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              size="small"
            />
            <TextField
              fullWidth
              label="State"
              name="state"
              value={filters.state}
              onChange={handleChange}
              size="small"
            />
            <TextField
              fullWidth
              label="Defect Type"
              name="defectType"
              value={filters.defectType}
              onChange={handleChange}
              size="small"
            />
            <TextField
              fullWidth
              label="Batch Number"
              name="batchNumber"
              value={filters.batchNumber}
              onChange={handleChange}
              size="small"
            />
            
            <Box sx={{ 
               gridColumn: { xs: '1 / -1', md: 'span 4' },
               display: 'flex',
               gap: 2,
               alignItems: 'center'
            }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                sx={{ flex: 2 }}
              >
                Apply Filters
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleReset}
                startIcon={<ClearIcon />}
                fullWidth
                sx={{ flex: 1 }}
              >
                Clear
              </Button>
            </Box>
          </Box>
          
          
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default SurveyFilters;