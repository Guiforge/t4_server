const { upload } = require('../controllers/controllers');
const { Download } = require('../controllers/controllers');
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

  app.get('/download/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const reg = /^[0-9a-fA-F]{24}$/;
      if (!id.match(reg)) {
        throw new Error('Error Bad format');
      }


      res.status(200);
      res.send({ a: 'a' });
    } catch (error) {
      res.status(400);
      res.send({ error: error.message });
    }
  });

  app.get('/Download/*', async (req, res) => {
    res.status(400);
    res.send({ Error: 'Bad Request' });
  });
};

module.exports = initEndpoints;
