'use client';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { StockComparison } from '../../types/stock';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { BarChart } from '@mui/x-charts';
import { handleComparegraphql } from '../../services/Graphql';

// Updated fetchStockGraphData to replace compareStockData
const fetchStockGraphData = async (date: any) => {
  try {
    const response = await fetch(`http://localhost:3000/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          {
            stockData(date: "${date}") {
              date
              exchange
              open
              high
              low
              close
            }
          }
        `,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }

    const result = await response.json();
    return result.data.stockData; // Assuming that the response has a data field
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

const CompareStock = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [compareDate, setCompareDate] = useState<Dayjs | null>(dayjs());
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (startDate && compareDate) {
      const comparisonData = await handleComparegraphql(startDate, compareDate);
      setComparisonData(comparisonData);
    }
  };

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
              Compare Nvidia Stock Data GraphQL
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

                {/* BarChart for Differences */}
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
