const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const option = {
	swaggerDefinition : {
		openapi: '3.0.0',
		info : {
			title: 'Title of app !!',
			version: '1.0.0',
			description: 'nawak description !',
		},
		basePath : '/',
	},
	apis : ['endpoints.js'],
};


const specs = swaggerJsdoc(option);

module.exports = (app) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
	app.get('/toto', (req, res) => {
		res.send('salut');
	})
}