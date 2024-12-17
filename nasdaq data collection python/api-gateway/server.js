const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 4000;

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Proxy configuration
const proxyConfig = {
    '/rest': {
        target: 'http://rest-service:5000',
        pathRewrite: {'^/rest': ''},
    },
    '/graphql': {
        target: 'http://graphql-service:3000',
    },
    '/soap': {
        target: 'http://soap-service:8080',
        pathRewrite: {'^/soap': ''},
    }
};

// Setup proxy routes
Object.entries(proxyConfig).forEach(([path, config]) => {
    app.use(path, createProxyMiddleware(config));
});

// Swagger documentation
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Stock Data API Gateway',
        version: '1.0.0',
        description: 'Gateway for REST, GraphQL and SOAP services'
    },
    servers: [
        {
            url: 'http://localhost:4000'
        }
    ],
    paths: {
        '/rest/api/stock/{date}': {
            get: {
                summary: 'Get stock data (REST)',
                parameters: [
                    {
                        in: 'path',
                        name: 'date',
                        required: true,
                        schema: { type: 'string' }
                    }
                ]
            }
        },
        '/graphql': {
            post: {
                summary: 'GraphQL endpoint'
            }
        },
        '/soap/dataService': {
            post: {
                summary: 'SOAP endpoint'
            }
        }
    }
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
