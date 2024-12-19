'use client';
import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { compareStockData } from '../../services/REST';
import { StockComparison } from '../../types/stock';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { BarChart, ScatterChart } from '@mui/x-charts';

const CompareStock = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [compareDate, setCompareDate] = useState<Dayjs | null>(dayjs());
  const [comparisonData, setComparisonData] = useState<StockComparison | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (startDate && compareDate) {
      try {
        const data = await compareStockData(
          startDate.format('YYYY-MM-DD'),
          compareDate.format('YYYY-MM-DD')
        );
        console.log(data)
        setComparisonData(data);
        setError(null);
      } catch (err: any) {
        setComparisonData(null);
        setError(err.message);
      }
    } else {
      setError('Please select both dates.');
    }
  };
  const [colorX, setColorX] = React.useState<
  'None' | 'piecewise' | 'continuous' | 'ordinal'
>('piecewise');
const [colorY, setColorY] = React.useState<'None' | 'piecewise' | 'continuous'>(
  'None',
);
const series = [
  {
    data: [
      comparisonData?.comparison.openDiff ?? null,
      comparisonData?.comparison.highDiff ?? null,
      comparisonData?.comparison.lowDiff ?? null,
      comparisonData?.comparison.closeDiff ?? null,
    ],
  },
];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Compare Nvidia Stock Data REST
            </Typography>
          </Grid>

          {/* Date Pickers */}
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontSize: '1.25rem' }}>
                Start Date
              </Typography>
              <StaticDatePicker
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                
              />
            </Box>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontSize: '1.25rem' }}>
                Compare Date
              </Typography>
              <StaticDatePicker
                value={compareDate}
                onChange={(newValue) => setCompareDate(newValue)}
               
              />
            </Box>
          </Grid>

          {/* Compare Button */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleCompare} fullWidth>
              Compare
            </Button>
          </Grid>

          {/* Error or Comparison Results */}
          <Grid item xs={12}>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            {comparisonData && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Comparison Results
                </Typography>

                {/* ScatterChart */}
                <BarChart
  height={300}
  grid={{ horizontal: true }}
  series={series}
  margin={{
    top: 10,
    bottom: 20,
  }}
  yAxis={[
    {
      label: 'Difference',
      colorMap: {
        type: 'piecewise',
        thresholds: [0], // Threshold at 0
        colors: ['red', 'blue'], // Red for negative, blue for positive
      },
    },
  ]}
  xAxis={[
    {
      label: 'Metrics',
      scaleType: 'band',
      data: ['Open', 'High', 'Low', 'Close'], // Bar labels
      valueFormatter: (value) => value.toString(),
    },
  ]}
/>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default CompareStock;
