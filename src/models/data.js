const mongoose = require('mongoose');
const crypto = require('crypto');

// function arrayLimit(arr) {
//   return arr.length >= 10;
// }

// function arrayLimitIV(arr) {
//   return arr.length === 12;
// }

const dataShema = new mongoose.Schema({
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
  keyAuth: {
    type: [Number],
    required: true,
    min: [arr => arr.length === 31, 'key should have length of 31']
  },
  options: {
    days: { type: Number, default: 1 },
    down: { type: Number, default: 1 }
  },
  creationDate: {
    type: Date,
    default: Date.now,
    set: () => Date.now // trix to overide all wrong data
  },
  nonce: {
    type: String,
    set: () => crypto.randomBytes(42).toString('base64'), // trix to overide all wrong data
    default: crypto.randomBytes(42).toString('base64')
  }
});

const Data = mongoose.model('Data', dataShema);

module.exports = Data;
