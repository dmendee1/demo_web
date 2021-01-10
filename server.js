const express = require("express");

const cors = require("cors");
const mysql = require("mysql");
const config = require("./config/config.json");
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const index = require('./routes/api/index');
const worker = require('./routes/api/worker');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const swaggerOptions = {
	swaggerDefinition: {
		info: {
		version: "1.0.0",
		title: "Customer API",
		description: "Customer API Information",
		contact: {
			name: "Amazing Developer"
		},
		servers: ["http://localhost:8080"]
		}
	},
	apis: ["./routes/api/index.js", "./routes/api/worker.js"]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', index);

app.use('/worker', worker);

const port = process.env.PORT || 8080;

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`)
);
