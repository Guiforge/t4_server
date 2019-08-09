const { upload } = require('../controllers/controllers');
// const { Download } = require('../controllers/controllers');
// const logger = require('../utils/logger')

const initEndpoints = app => {
  app.post('/upload', async (req, res) => {
    try {
      const id = await upload(req.body);
      res.status(200);
      res.send({ id });
    } catch (error) {
      res.status(400);
      res.send({ Error: 'Error' });
    }
  });

  app.get('/download/:id([0-9a-fA-F]{24})', async (req, res) => {
    const { id } = req.params;

    res.status(200);
    res.send({ id });
  });

  app.get('/Download/*', async (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = initEndpoints;
