const mongoose = require('mongoose');

function arrayLimit(arr) {
  return arr.length >= 10;
}

const dataShema = new mongoose.Schema({
  enc: {
    meta: { type: [Number], required: true, validate: [arrayLimit, 'meta is too small'] },
    file: { type: [Number], required: true, validate: [arrayLimit, 'file is too small'] }
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
  CreationDate: { type: Date, default: Date.now }
});

const Data = mongoose.model('Data', dataShema);

module.exports = Data;
