import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Control API",
      version: "1.0.0",
      description: "API para controle financeiro pessoal",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["src/routes/*.ts"], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;