const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// UserSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   return token;
// };
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, username: this.username }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
  return token;
};

module.exports = mongoose.model('User', UserSchema);
