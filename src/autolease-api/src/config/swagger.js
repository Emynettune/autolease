"use strict";
const swaggerJSDoc = require("swagger-jsdoc");
const config = require("./env");




const swaggerDefinition = {
    openapi: "3.0.1",
    info: {
        title: 'AutoLease API',
        version: '1.0.0',
        description: 'Caption: AutoLease API documentation',
    },
    servers: [
        {
             url: config.env.API_Base_Path,
             description: 'AutoLease API Base Path'
        }, 
    ],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
    },
    security: [{ bearerAuth: [] }],
};
const options = {
    swaggerDefinition: swaggerDefinition,
    apis: [
        "./src/autolease-api/src/docs/**/*.js"
    ],
    basePath: config.env.API_Base_Path,
    
    
    
};

const swaggerSpec = swaggerJSDoc(options);

console.log (swaggerSpec);

module.exports = swaggerSpec;