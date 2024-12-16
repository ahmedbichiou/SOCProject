'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { getStockByDate } from '../../services/REST'; // Adjust the path to your REST service
import { StockData } from '../../types/stock'; // Adjust the path to your types

const ViewStockByDate = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchStock = async () => {
    if (!selectedDate) {
      setError('Please select a date.');
      return;
    }

    try {
      const data = await getStockByDate(selectedDate.format('YYYY-MM-DD'));
      setStockData(data);
      setError(null);
    } catch (err: any) {
      setStockData(null);
      setError(err.message);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          View Stock Data by Date
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
                      <Button variant="contained" color="primary" onClick={handleFetchStock} fullWidth>
                      Fetch Stock Data
                      </Button>
                    </Grid>
          
        </Grid>

        {/* Error Message */}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {/* Stock Data Display */}
        {stockData && (
          <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Stock Data on {selectedDate?.format('YYYY-MM-DD')}
            </Typography>
            <Typography>Open: {stockData.open}</Typography>
            <Typography>High: {stockData.high}</Typography>
            <Typography>Low: {stockData.low}</Typography>
            <Typography>Close: {stockData.close}</Typography>
            <Typography>Exchange: {stockData.exchange}</Typography>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default ViewStockByDate;
