const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt'); 
var jwt = require('jsonwebtoken');

const JWT_SECRET = "aryanisgoodb$oy";

const fetchuser = require('../middleware/fetchuser');

// Route1 : Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    return res.status(400).json({ success ,errors: errors.array() });
  }
  // Check whether the user with this email exists already
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success,error: "Sorry a user with this email already exists" })
    }
    const salt  = await  bcrypt.genSalt(10);
    const secured_password  = await  bcrypt.hash(req.body.password,salt);          
    // Create a new user
    user = await User.create({
      name: req.body.name,
      password: secured_password,
      email: req.body.email,
    });

    const data = {
      user : {
        id : user.id
      }
    }

    const authtoken  = jwt.sign(data,JWT_SECRET);
    console.log(authtoken);
    success = true;
    res.json({success,authtoken});
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
})

//Route2 :  Authentication a user : POST "/api/auth/login". No login required

router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
],async (req,res)=>{
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password} = req.body;
  try{
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error:"Try to with correct details"});
    }
    const passwordCompare = await bcrypt.compare(password,user.password);
    // if password doesn't match
    if(!passwordCompare){
      return res.status(400).json({success ,error:"Try to with correct details"});
    }
    // if password match 

    const data = {
      user : {
        id : user.id
      }
    }

    const authtoken  = jwt.sign(data,JWT_SECRET);
    success = true; 
    res.json({success,authtoken});

  }catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route3 : Get loggedin user details  : POST "/api/auth/getuser". login required


router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});




module.exports = router;

