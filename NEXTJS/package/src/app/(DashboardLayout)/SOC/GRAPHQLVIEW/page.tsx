'use client';
import React, { useState } from 'react';
import { fetchStockGraphData } from '../../services/Graphql';
import { StockData } from '../../types/stock';
import { Box, Typography, Button, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);


const StockDataComponent = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState('');
 const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const fetchStockData  = async () => {
    if (selectedDate) {
      const date = selectedDate.format('YYYY-MM-DD');
      
      try {
        const stockData = await fetchStockGraphData(date);
        setStockData(stockData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    }
  };
 // Radar Chart Data
  const radarChartData = {
    labels: ['Open', 'High', 'Low', 'Close'],
    datasets: [
      {
        label: `Stock Data on ${selectedDate?.format('YYYY-MM-DD')}`,
        data: stockData
          ? [stockData.open, stockData.high, stockData.low, stockData.close]
          : [0, 0, 0, 0],
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 1,
      },
    ],
  };

  const radarChartOptions = {
    responsive: true,
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: Math.max(
          stockData ? Math.max(stockData.high, stockData.close) * 1.2 : 10,
          10
        ),
      },
    },
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
              View Stock Data by Date GraphQL
            </Typography>
    
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Date Picker */}
              <Grid item xs={12} lg={12}>
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
                    Select Date
                  </Typography>
                  <StaticDatePicker
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={fetchStockData} fullWidth>
                  Fetch Stock Data
                </Button>
              </Grid>
    
                {error && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                  </Typography>
                )}
                 {stockData && (
              <Grid item xs={12} lg={12}>
              <Box
                    sx={{
                      
                      p: 3,
                      boxShadow: 3,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      textAlign: 'center',
                    }}
                    >
              <Typography variant="h2" >
                      Stock Data on {selectedDate?.format('YYYY-MM-DD')}
                    </Typography>
                    
                    </Box></Grid>)}
             
              <Grid item xs={12} lg={6}>
              
    
                {stockData && (
                    <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      boxShadow: 3,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      paddingBottom: 53,
                      textAlign: 'center',
                    }}
                    >
                    <Typography variant="h4" gutterBottom>
                      Data values 
                    </Typography>
                    <Typography variant="subtitle1">Open: {stockData.open}</Typography>
                    <Typography variant="subtitle1">High: {stockData.high}</Typography>
                    <Typography variant="subtitle1">Low: {stockData.low}</Typography>
                    <Typography variant="subtitle1">Close: {stockData.close}</Typography>
                    <Typography variant="subtitle1">Exchange: {stockData.exchange}</Typography>
                    </Box>
                )}
              </Grid>
              {stockData && (
              <Grid item xs={12} lg={6}>
              <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      boxShadow: 3,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                    }}
                  >
              {/* Radar Chart */}
              {stockData && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 4 }}>
                    <Radar data={radarChartData} options={radarChartOptions} />
                  </Box>
                </Grid>
              )}
    </Box></Grid>)}
    
             
            </Grid>
          </Box>
        </LocalizationProvider>
  );
};

export default StockDataComponent;
