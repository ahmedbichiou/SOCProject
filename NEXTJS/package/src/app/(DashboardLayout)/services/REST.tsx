import { StockData, StockComparison } from '../types/stock';

const BASE_URL = 'http://localhost:5000/api/stock';

/**
 * Fetch stock data for a single date.
 * @param date - The date to fetch data for (format: YYYY-MM-DD).
 * @returns A promise resolving to the stock data for the specified date.
 * @throws An error if the request fails or no data is found.
 */
export const getStockByDate = async (date: string): Promise<StockData> => {
  const response = await fetch(`${BASE_URL}/${date}`);
  if (!response.ok) {
    throw new Error('No data found for the provided date.');
  }
  return response.json();
};

/**
 * Compare stock data between two dates.
 * @param date1 - The first date (format: YYYY-MM-DD).
 * @param date2 - The second date (format: YYYY-MM-DD).
 * @returns A promise resolving to the comparison data between the two dates.
 * @throws An error if the request fails or no data is found for either date.
 */
export const compareStockData = async (
  date1: string,
  date2: string
): Promise<StockComparison> => {
  const response = await fetch(`${BASE_URL}/compare/${date1}/${date2}`);
  if (!response.ok) {
    throw new Error('No data found for one or both of the provided dates.');
  }
  return response.json();
};
