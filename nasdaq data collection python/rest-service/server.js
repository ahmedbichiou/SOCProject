
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5000;
const cors = require('cors');
// Load Nvidia EOD data from JSON file
let stockData;
fs.readFile('nvidia_eod_2024.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }
    stockData = JSON.parse(data);
});
app.use(cors());
// Helper function to fetch stock data by date
const fetchDataByDate = (date) => {
    const result = stockData.data.find(entry => entry.date.startsWith(date));
    return result ? {
        date: result.date,
        exchange: result.exchange,
        open: result.open,
        high: result.high,
        low: result.low,
        close: result.close
    } : null;
};

// Endpoint to get data for a single date
app.get('/api/stock/:date', (req, res) => {
    const date = req.params.date;
    const response = fetchDataByDate(date);
    
    if (response) {
        res.json(response);
    } else {
        res.status(404).json({ message: 'No data found for the provided date.' });
    }
});

// Endpoint to compare data between two dates
app.get('/api/stock/compare/:date1/:date2', (req, res) => {
    const { date1, date2 } = req.params;
    const data1 = fetchDataByDate(date1);
    const data2 = fetchDataByDate(date2);

    if (data1 && data2) {
        const comparison = {
            date1: data1,
            date2: data2,
            comparison: {
                openDiff: data2.open - data1.open,
                highDiff: data2.high - data1.high,
                lowDiff: data2.low - data1.low,
                closeDiff: data2.close - data1.close
            }
        };
        res.json(comparison);
    } else {
        res.status(404).json({ message: 'No data found for one or both of the provided dates.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


/* TESTS 

GET http://localhost:3000/api/stock/2024-09-30

GET http://localhost:3000/api/stock/compare/2024-09-26/2024-09-27
*/