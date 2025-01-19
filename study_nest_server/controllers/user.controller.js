
const User = require("../models/user.models");
const jwt = require('jsonwebtoken');
const { verifyRole } = require("../middleware/auth.middleware")

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User with Role
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  const passwordValidation =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const passwordMatchedOrNot = passwordValidation.test(password);
  if (!passwordMatchedOrNot) {
    return res.status(401).send({
      status: "fail password",
      msg: "Password must have at least one uppercase character, one number, one special character, and be at least 8 characters long.",
    });
  }

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = await User.create({ username, email, password, role });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
       // token: generateToken(user.id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {

  const { email, password } = req.body;

  const cookieOptions = {
    httpOnly: true,
    secure:true,
    sameSite: 'None',
  };

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user.id, user.role)
      res.cookie("token",token,cookieOptions)  
     return res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      

    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logoutUser = async(req,res) =>{
  res.cookie("token",null,{
    expires:new Date(Date.now()),
  });
  res.status(200).send("logout Successfully"); 
}



module.exports = { registerUser, verifyRole,loginUser, logoutUser };
