const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'], deafault: 'student',
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.generateAccessToken = function () {
    return JsonWebTokenError.sign(
      {
      userId: this._id,
      username: this.username,
      role: this.role,
      },
      process.env.ACCESS_SECRET_KEY,
      {expiresIn:process.env.ACCESS_TOKEN_EXPIRESIN}
    );
};

userSchema.methods.generateRefreshToken = function () {
  return JsonWebTokenError.sign(
    {
      userId: this._id,
      username: this.username,
       role: this.role,
    },

    process.env.REFRESH_SECRET_KEY,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRESIN}
  );
};

module.exports = mongoose.model('User', userSchema);
