module.exports = {
  file: {
    level: 'info',
    filename: `../../.app.log`,
    // handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    timestamp: true,
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    timestamp: true,
    // handleExceptions: true,
    json: false,
    colorize: true
  }
};
