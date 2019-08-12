const mongoose = require('mongoose');
const crypto = require('crypto');

function arrayLimit(arr) {
  return arr.length >= 10;
}

function arrayLimitIV(arr) {
  return arr.length === 12;
}

const dataShema = new mongoose.Schema({
  enc: {
    meta: {
      data: { type: [Number], required: true, validate: [arrayLimit, 'meta is too small'] },
      ivMeta: {
        type: [Number],
        required: true,
        validate: [arrayLimitIV, 'Ivmeta is not in correct format']
      }
    },
    file: {
      data: { type: [Number], required: true, validate: [arrayLimit, 'meta is too small'] },
      ivFile: {
        type: [Number],
        required: true,
        validate: [arrayLimitIV, 'Ivmeta is not in correct format']
      }
    }
  },
  key: {
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
