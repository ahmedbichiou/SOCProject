import { StockData } from '../types/stock';

export const handleFetchStock = async (selectedDate: any): Promise<StockData | null> => {
  // Ensure selectedDate exists
  if (!selectedDate) {
    throw new Error('Please select a date.');
  }

  const date = selectedDate.format('YYYY-MM-DD');

  // Build SOAP XML request
  const soapRequest = `
   <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <getData xmlns="http://example.com/">
            <parameter>${date}</parameter>
        </getData>
    </soap:Body>
  </soap:Envelope>`;

  try {
   
    const response = await fetch('http://localhost:8080/dataService', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml', // Required for SOAP
      },
      body: soapRequest,
    });

    if (!response.ok) {
      throw new Error( "Error fetching data: ${response.statusText}");
    }

    // Parse the SOAP XML response
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    console.log('SOAP response:', xmlDoc);
    if (!xmlDoc) {
      throw new Error('No data found for the provided date.');
    }

    const stockData: StockData = {
      date: xmlDoc.getElementsByTagName('date')[0].textContent || '',
      exchange: xmlDoc.getElementsByTagName('exchange')[0].textContent || '',
      open: parseFloat(xmlDoc.getElementsByTagName('open')[0].textContent || '0'),
      high: parseFloat(xmlDoc.getElementsByTagName('high')[0].textContent || '0'),
      low: parseFloat(xmlDoc.getElementsByTagName('low')[0].textContent || '0'),
      close: parseFloat(xmlDoc.getElementsByTagName('close')[0].textContent || '0'),
    };

    return stockData;
  } catch (err: any) {
    throw new Error(err.message);
  }
};