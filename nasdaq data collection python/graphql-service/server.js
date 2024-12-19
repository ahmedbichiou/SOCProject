const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');


// Load Nvidia EOD data from JSON file
let stockData;
fs.readFile('nvidia_eod_2024.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }
    stockData = JSON.parse(data);
});

// Define the GraphQL schema
const schema = buildSchema(`
    type StockData {
        date: String
        exchange: String
        open: Float
        high: Float
        low: Float
        close: Float
    }

    type Query {
        stockData(date: String!): StockData
        compareStocks(date1: String!, date2: String!): [StockData]
    }
`);

// Define the resolvers
const root = {
    stockData: ({ date }) => {
        const result = stockData.data.find(entry => entry.date.startsWith(date));
        return result ? {
            date: result.date,
            exchange: result.exchange,
            open: result.open,
            high: result.high,
            low: result.low,
            close: result.close
        } : null;
    },
    compareStocks: ({ date1, date2 }) => {
        const data1 = stockData.data.find(entry => entry.date.startsWith(date1));
        const data2 = stockData.data.find(entry => entry.date.startsWith(date2));

        return [data1, data2].map(data => data ? {
            date: data.date,
            exchange: data.exchange,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close
        } : null);
    }
};

// Set up Express and GraphQL
const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL interface
}));

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'GraphQL Stock API',
    version: '1.0.0',
    description: 'GraphQL API for NVIDIA stock data',
  },
  servers: [
    {
      url: 'http://localhost:3000/graphql',
    },
  ],
  paths: {
    '/graphql': {
      post: {
        description: 'GraphQL endpoint',
        requestBody: {
          content: {
            'application/json': {
              examples: {
                'Get Stock Data': {
                  value: {
                    query: '{ stockData(date: "2024-09-30") { date exchange open high low close } }'
                  }
                },
                'Compare Stocks': {
                  value: {
                    query: '{ compareStocks(date1: "2024-09-30", date2: "2024-09-27") { date exchange open high low close } }'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
});


/*TEST QUERIES  


//GET STOCK DATA
{
    "query": "{ stockData(date: \"2024-09-30\") { date exchange open high low close } }"
}


//COMPRAE STOCK DATES
{
    "query": "{ compareStocks(date1: \"2024-09-30\", date2: \"2024-09-27\") { date exchange open high low close } }"
}
    
*/