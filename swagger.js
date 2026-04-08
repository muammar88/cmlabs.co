const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Crawler API",
    version: "1.0.0",
    description: "API untuk crawler dan image proxy (_next/image)",
  },
  servers: [
    {
      url: "http://localhost:3033",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./router/*.js"], // penting: arahkan ke router kamu
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
