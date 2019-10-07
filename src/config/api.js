const api = {
  HOST: 'localhost',
  PORT: '8070',
  PROTO: 'http'
};

api.ALL = `${api.PROTO}://${api.HOST}:${api.PORT}`;

module.exports = api;
