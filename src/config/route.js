const regId = '[0-9a-fA-F]{24}';

module.exports = {
  infoFile: `/info/:id(${regId})`,
  delete: `/file/delete/:id(${regId})`,
  download: `/download/:id(${regId})`,
  getNonce: `/nonce/:id(${regId})`,
  getMeta: `/meta/:id(${regId})`
};
