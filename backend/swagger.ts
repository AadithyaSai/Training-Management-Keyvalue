const swaggerAutogen = require("swagger-autogen")();

const doc = {
	info: {
		title: "My API",
		description: "Description",
	},
	host: "localhost:3000",
	schemes: ["http"],
};

const outputFile = "./dist/swagger-output.json";
const endpointsFiles = ["./index.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);

// src/swagger.ts
// import swaggerJSDoc from "swagger-jsdoc";

// const options: swaggerJSDoc.Options = {
// 	definition: {
// 		openapi: "3.0.0",
// 		info: {
// 			title: "Your API Title",
// 			version: "1.0.0",
// 			description: "Your API description",
// 		},
// 	},
// 	apis: ["./src/routes/*.ts", "./src/controller/*.ts"], // adjust path to your routes
// };

// export const swaggerSpec = swaggerJSDoc(options);
// console.log("swagger : ", swaggerSpec);
