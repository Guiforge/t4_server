const controllers = require('../controllers/controllers');

const initEndpoints = app => {
  app.get('/', (req, res) => {
    res.send('homa');
  });
  /*
	{
	  "enc": {
		"meta": {
		  "0": 45063,
		  "1": 5189,
		  "2": 60957,
		  "3": 38403,
		  "4": 42334,
		  "5": 22327,
		  "6": 30079,
		  "7": 17101,
		  "8": 40554,
		  "9": 43866,
		  "10": 31196,
		  "11": 55739,
		  "12": 39439,
		  "13": 190,
		  "14": 31363,
		  "15": 44431
		},
		"file": {
		  "0": 4778,
		  "1": 38132,
		  "2": 21729,
		  "3": 7646,
		  "4": 59185,
		  "5": 3083,
		  "6": 26958,
		  "7": 39974,
		  "8": 3164,
		  "9": 56096,
		  "10": 62249,
		  "11": 39323,
		  "12": 13304,
		  "13": 14220,
		  "14": 22644,
		  "15": 13579,
		  "16": 30481,
		  "17": 53751,
		  "18": 30027
		}
	  },
	  "key": {
		"0": 1536,
		"1": 32427,
		"2": 39029,
	  }
	}
  */
  app.post('/upload', (req, res) => {
    // console.log(req)
    controllers.upload('toto');
    res.send('42');
  });
};

module.exports = initEndpoints;
