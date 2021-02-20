const mongoose = require('mongoose') , uniqueValidator = require('mongoose-unique-validator');
const schema = new mongoose.Schema({
  original_url: {
      type: 'string',
      unique: true
  },
});
schema.plugin(uniqueValidator, {message: 'is already exist.'});

module.exports = mongoose.model("URL", schema);
