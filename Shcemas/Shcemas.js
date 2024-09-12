const mongoose = require('mongoose'); 
const { Schema } = mongoose;



// Define user schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'], 
    default: 'editor',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true, 
});




const User = mongoose.model('User', userSchema);

module.exports = { User };
