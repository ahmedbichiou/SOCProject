const graphurl = 'http://localhost:3000/graphql';

export const fetchStockGraphData = async (date: any) => {
    try {
      const response = await fetch(graphurl, {
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
      console.log('graphql response')
      console.log(result);
      return result.data.stockData; // Assuming that the response has a data field
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error; // Rethrow the error to handle it elsewhere if necessary
    }
  };


export const handleComparegraphql = async (startDate: any, compareDate: any) => {
    if (startDate && compareDate) {
        try {
            const startDateFormatted = startDate.format('YYYY-MM-DD');
            const compareDateFormatted = compareDate.format('YYYY-MM-DD');

            // Fetch stock data for both dates
            const data1 = await fetchStockGraphData(startDateFormatted);
            const data2 = await fetchStockGraphData(compareDateFormatted);

            // Calculate differences
            const comparison = {
                openDiff: data2.open - data1.open,
                highDiff: data2.high - data1.high,
                lowDiff: data2.low - data1.low,
                closeDiff: data2.close - data1.close,
            };

            // Return the comparison data
            return { data1, data2, comparison };
        } catch (err: any) {
            throw new Error(err.message);
        }
    } else {
        throw new Error('Please select both dates.');
    }
};
