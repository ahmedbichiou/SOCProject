export interface StockData {
    date: string;
    exchange: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }
  
  export interface StockComparison {
    date1: StockData;
    date2: StockData;
    comparison: {
      openDiff: number;
      highDiff: number;
      lowDiff: number;
      closeDiff: number;
    };
  }
  