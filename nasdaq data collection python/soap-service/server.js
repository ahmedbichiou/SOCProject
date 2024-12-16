const soap = require('soap');
const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Load the Nvidia EOD data from JSON file
let stockData;
fs.readFile('nvidia_eod_2024.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }
    stockData = JSON.parse(data);
});

// Function to fetch stock data by date
const fetchDataByDate = (date) => {
    // Find entry in the data array
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

// Define the WSDL
const service = {
    DataService: {
        DataServicePort: {
            getData: (args, callback) => {
                const date = args.parameter; // Expecting date as input parameter
                const response = fetchDataByDate(date);
                if (response) {
                    callback(null, { result: response });
                } else {
                    callback(new Error('No data found for the provided date.'));
                }
            }
        }
    }
};

// WSDL definition
const xml = `
<definitions xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
             xmlns:tns="http://example.com/"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
             targetNamespace="http://example.com/"
             name="DataService">
    <message name="getDataRequest">
        <part name="parameter" type="xsd:string"/>
    </message>
    <message name="getDataResponse">
        <part name="result" type="tns:StockData"/>
    </message>
    <complexType name="StockData">
        <sequence>
            <element name="date" type="xsd:string"/>
            <element name="exchange" type="xsd:string"/>
            <element name="open" type="xsd:float"/>
            <element name="high" type="xsd:float"/>
            <element name="low" type="xsd:float"/>
            <element name="close" type="xsd:float"/>
        </sequence>
    </complexType>
    <portType name="DataServicePortType">
        <operation name="getData">
            <input message="tns:getDataRequest"/>
            <output message="tns:getDataResponse"/>
        </operation>
    </portType>
    <binding name="DataServiceBinding" type="tns:DataServicePortType">
        <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="getData">
            <soap:operation soapAction="getData"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
    </binding>
    <service name="DataService">
        <port name="DataServicePort" binding="tns:DataServiceBinding">
            <soap:address location="http://localhost:${PORT}/dataService"/>
        </port>
    </service>
</definitions>`;

 // Start the SOAP server
soap.listen(app, '/dataService', service, xml);
console.log(`Service SOAP démarré sur http://localhost:${PORT}/dataService?wsdl`);

// Start the express application
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

/* example post request




http://localhost:8080/dataService?wsdl

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <getData xmlns="http://example.com/">
            <parameter>2024-09-30</parameter>
        </getData>
    </soap:Body>
</soap:Envelope>







*/