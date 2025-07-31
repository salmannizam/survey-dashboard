import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  Tooltip,
  IconButton,
  TablePagination,
  useTheme,
  CircularProgress
} from '@mui/material';
import { Info as InfoIcon, Download as DownloadIcon } from '@mui/icons-material';
import { downloadImagesZip, downloadSingleImage } from '../services/api';

interface SurveyResult {
  ResultID: string;
  subresultid: string;
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
  Remarks:string;
}

interface SurveyResultsTableProps {
  data: SurveyResult[];
}

const SurveyResultsTable: React.FC<SurveyResultsTableProps> = ({ data }) => {
  const theme = useTheme();
  const [imageloadingId, setImageloadingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (data.length === 0) {
    return (
      <Paper elevation={3} sx={{
        p: 4,
        mt: 2,
        textAlign: 'center',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper
      }}>
        <Typography variant="body1" color="textSecondary">
          No survey data available. Apply filters to see results.
        </Typography>
      </Paper>
    );
  }

  const handleDownloadImages = async (projectId: string, subresultid: string, images: string[]) => {
    try {
      setImageloadingId(subresultid);
      let response;

      if (images.length === 1) {
        response = await downloadSingleImage(projectId, images[0]);
      } else {
        response = await downloadImagesZip(projectId, images);
      }

      const blob = response.data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = images.length === 1
        ? images[0].split('/').pop() || `${subresultid}.jpg`
        : `${subresultid}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setImageloadingId(null);
    }
  };

const convertDayOfYearToDate = (dateStr: string) => {
  if (!dateStr || dateStr.length < 7) return 'Invalid Date';

  const year = parseInt(dateStr.substring(0, 4), 10);
  const dayOfYear = parseInt(dateStr.substring(4), 10);
  if (isNaN(year) || isNaN(dayOfYear)) return 'Invalid Date';

  const date = new Date(Date.UTC(year, 0, 1));
  date.setUTCDate(dayOfYear);

  // ✅ Add 5.5 hours offset for IST
  const istOffsetDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));

  // ✅ Format to YYYY-MM-DD in IST
  return istOffsetDate.toISOString().split('T')[0];
};


const getFreshnessDays = (mfgDateStr: string) => {
  const mfgDateParsed = convertDayOfYearToDate(mfgDateStr);
  if (mfgDateParsed === 'Invalid Date') return 'Invalid';

  const mfgDate = new Date(mfgDateParsed);
  const today = new Date();

  mfgDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - mfgDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Use round

  return diffDays < 0 ? 0 : diffDays;
};

    

  // Avoid a layout jump when reaching the last page with empty rows
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Survey Results
        </Typography>
        <Chip
          label={`${data.length} records`}
          color="primary"
          variant="outlined"
          sx={{
            fontWeight: 'bold',
            borderRadius: '8px',
            borderWidth: '2px',
            borderColor: theme.palette.primary.main
          }}
        />
      </Box>

      <Paper elevation={0} sx={{
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden'
      }}>
        <TableContainer>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead sx={{
              backgroundColor: theme.palette.mode === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[800]
            }}>
              <TableRow>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Outlet Name
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Zone
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  <Box display="flex" alignItems="center">
                    Survey Date
                    <Tooltip title="Date when survey was conducted" arrow>
                      <InfoIcon fontSize="small" sx={{
                        ml: 0.5,
                        color: theme.palette.text.secondary
                      }} />
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Brand
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  SKU
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Batch No.
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Sample Checked
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Freshness
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  MFG Date
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Exp. Date
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Visual Defects
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  No of Defects
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Defect Type
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Remarks
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Images
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  State
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Location
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  Address
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(rowsPerPage > 0
                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : data
              ).map((row) => (
                <TableRow
                  key={row.subresultid}
                  hover
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="body2" noWrap>
                      {row['Outlet Name']}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {row.Zone}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {new Date(row.StartDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {row.Brand}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {row.SKU} {row.Unit}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {row['Batch No.']}{row['Batch No1.']}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {row['Sample Checked']}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {getFreshnessDays(row['MFG Date'])} days
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {convertDayOfYearToDate(row['MFG Date'])}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {convertDayOfYearToDate(row['Exp. Date'])}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Chip
                      label={row.VisualDefects}
                      color={row.VisualDefects === 'Yes' ? 'error' : 'success'}
                      size="small"
                      sx={{
                        borderRadius: '4px',
                        fontWeight: 500,
                        minWidth: '70px'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {row.no_of_defect}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="body2" noWrap>
                      {row?.defect_type ?row?.defect_type: '--'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="body2" noWrap>
                      {row?.Remarks ? row?.Remarks : '--'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {row.Defect_image ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">
                          {row.Defect_image.split(',').length}
                        </Typography>
                        <Tooltip title="Download Images" arrow>
                          <IconButton
                            size="small"
                            disabled={imageloadingId === row.subresultid}
                            onClick={() => {
                              handleDownloadImages(
                                row.subresultid,
                                row.subresultid,
                                row.Defect_image.split(',')
                              );
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.contrastText
                              }
                            }}
                          >
                            {imageloadingId === row.subresultid ? (
                              <Box width={24} height={24} display="flex" alignItems="center" justifyContent="center">
                                <CircularProgress size={16} />
                              </Box>
                            ) : (
                              <DownloadIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {row.State}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {row.Location}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="body2" noWrap>
                      {row.Address}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={14} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            '& .MuiTablePagination-toolbar': {
              padding: theme.spacing(1, 2)
            }
          }}
        />
      </Paper>
    </Box>
  );
};

export default SurveyResultsTable;
