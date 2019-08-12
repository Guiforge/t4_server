const regId = '[0-9a-fA-F]{24}';

module.exports = {
  upload: '/upload',
  download: `/download/:id(${regId})`,
  download404: '/download/*',
  getNonce: `/nonce/:id(${regId})`,
  getMeta: `/meta/:id(${regId})`
};
