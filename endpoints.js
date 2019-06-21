const initEndpoints = (app) => {
	/**
	* @swagger
	*   /:
	*       get:
	*           description: Hello world !
	*           responses:
	*               '200':    # status code
	*                   description: A JSON array of user names
	*                   content:
	*                       application/json:
	*                           schema:
	*                               type: string
	*/
	app.get('/', (req, res) => {
		res.send('Hello world 1\n');
	});
}

module.exports = initEndpoints;