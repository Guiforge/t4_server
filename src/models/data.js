const mongoose = require('mongoose');
const crypto = require('crypto');

// function arrayLimit(arr) {
//   return arr.length >= 10;
// }

// function arrayLimitIV(arr) {
//   return arr.length === 12;
// }

const dataShema = new mongoose.Schema({
  // encrypt meta
  enc: {
    encrypted: { type: String, requires: true },
    auth: {
      type: Buffer,
      required: true,
      min: [arr => arr.byteLength === 16, 'Auth Tag Meta should have length of 16']
    }
  },
  ivMeta: {
    type: Buffer,
    required: true,
    min: [arr => arr.byteLength === 92, 'Vector Meta should have length of 92']
  },
  authTag: {
    type: Buffer,
    min: [arr => arr.byteLength === 16, 'authTag should have length of 16']
  },
  sizeZip: {
    type: Number
  },
  // keys that certify that you have the secret key with nonce Challenge
  keyAuth: {
    type: Buffer,
    required: true,
    min: [arr => arr.length === 31, 'key should have length of 31']
  },
  down: { type: Number, default: 1 },
  days: {
    type: Date,
    required: true,
    set: (nbDay) => {
      const date = new Date(Date.now())
      date.setDate(date.getDate() + nbDay);
      return date
    }
  },
  creationDate: {
    type: Date,
    default: Date.now,
    set: () => Date.now // trix to overide all wrong data
  },
  // nonce challenge with keyAuth
  nonce: {
    type: String,
    set: () => crypto.randomBytes(42).toString('base64'), // trix to overide all wrong data
    default: crypto.randomBytes(42).toString('base64')
  },
  owner: {
    type: String,
    required: true,
    min: [arr => arr.length === 512, 'owner tag have to length equal too 512']
  }
});

const Data = mongoose.model('Data', dataShema);

module.exports = Data;
