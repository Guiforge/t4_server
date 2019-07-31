const controllers = require('../controllers/controllers');
// const logger = require('../utils/logger')

const initEndpoints = app => {
  app.get('/', (req, res) => {
    res.send('homa');
  });

  app.post('/upload', async (req, res) => {
    try {
      const id = await controllers.upload(req.body);
      res.status(200);
      res.send({ id });
    } catch (error) {
      res.status(400);
      res.send({ Error: 'Error' });
    }
  });
};

module.exports = initEndpoints;
