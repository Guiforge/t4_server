const env = process.env.NODE_ENV || 'development';

const development = {
  uri: 'mongodb://admin:x6Y8gsXT2@mongo/dev'
};

const config = {
  development
};

// eslint-disable-next-line security/detect-object-injection
module.exports = config[env];
