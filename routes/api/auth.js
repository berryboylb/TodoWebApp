const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const User = require('../../models/User');

//@route GET 
//@description test route
//@access public
router.get('/', auth, async (req, res) => {
    //get user data
    try{
        //.select('-password') stops the password from being returned
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});


//@route POST api/users
//@description register route
//@access public
router.post('/', 
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ], 

    async (req, res) => {
    //get valiadtion result
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //if there are errors
        return res.status(400).json({ errors: errors.array()});
    }

    //get  email, password from req.body
    const { email, password } = req.body;

    try{
        //see if the user already exists
        let user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        }

        //check if password matches with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        }

        //Return jsonwebtoken

        //create a payload first
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }
        );
    }
    catch(err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }    
});

module.exports = router;