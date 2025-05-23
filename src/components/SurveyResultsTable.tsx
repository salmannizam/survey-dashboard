import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, 
  Chip, Box, Tooltip 
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

interface SurveyResult {
  ResultID: string;
  'Outlet Name': string;
  Zone: string;
  StartDate: string;
  Address: string;
  State: string;
  Location: string;
  Brand: string;
  Unit: string;
  SKU: string;
  'Sample Checked': string;
  'Batch No.': string;
  'Batch No1.': string;
  'MFG Date': string;
  'Exp. Date': string;
  VisualDefects: string;
  Defect_image: string;
  no_of_defect: string;
  defect_type: string;
}

interface SurveyResultsTableProps {
  data: SurveyResult[];
}

const SurveyResultsTable: React.FC<SurveyResultsTableProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          No data available. Apply filters to see results.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          Survey Results
        </Typography>
        <Chip 
          label={`Total Records: ${data.length}`} 
          color="primary" 
          variant="outlined"
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
      
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Outlet Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Zone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                <Box display="flex" alignItems="center">
                  Start Date
                  <Tooltip title="Date when survey was conducted">
                    <InfoIcon fontSize="small" sx={{ ml: 0.5, color: 'action.active' }} />
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>SKU</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Batch No.</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>MFG Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Exp. Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Visual Defects</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Defect Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow 
                key={row.ResultID}
                hover
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>{row['Outlet Name']}</TableCell>
                <TableCell>{row.Zone}</TableCell>
                <TableCell>{new Date(row.StartDate).toLocaleDateString()}</TableCell>
                <TableCell>{row.Brand}</TableCell>
                <TableCell>{row.SKU}</TableCell>
                <TableCell>{row['Batch No.']}</TableCell>
                <TableCell>{row['MFG Date']}</TableCell>
                <TableCell>{row['Exp. Date']}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.VisualDefects} 
                    color={row.VisualDefects === 'Yes' ? 'error' : 'success'} 
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.defect_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SurveyResultsTable;