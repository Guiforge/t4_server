const initEndpoints = app => {
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
    res.send('roro');
  });
};

module.exports = initEndpoints;
