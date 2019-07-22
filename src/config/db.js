const env = process.env.NODE_ENV || 'development';

const development = {
  uri: 'mongodb://mongo/dev'
};

// mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017/admin
//uri: 'mongodb://netDb:27017/test' //'mongodb://root:example@t4_netDb:27017/superDB'

const test = {
  uri: 'mongodb://mongo/test'
};

const config = {
  development,
  test
};

// eslint-disable-next-line security/detect-object-injection
module.exports = config[env];
