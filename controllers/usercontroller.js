const express = require("express");
const router = express.Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


/*
======================
    USER REGISTER
======================
*/
router.post('/register', async (req, res) => {

    let { username, passwordhash } = req.body.user;
    try {
        const User = await UserModel.create({
            username,
            passwordhash: bcrypt.hashSync(passwordhash, 13)
        });
    
        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

        res.status(201).json ({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "User name already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user",
            });
        }
        
    }

    // res.send("This is our user/register endpoint!");
});


/*
====================
    USER LOG IN
====================
*/
router.post('/login', async (req, res) => {
    let { username, passwordhash } = req.body.user;

    try {
        const loginUser = await UserModel.findOne({ 
            where: {
                username: username
            },
        });

        if (loginUser) {

            let passwordComparison = await bcrypt.compare(passwordhash, loginUser.passwordhash);

            if (passwordComparison) {
                let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});

            res.status(200).json ({
                message: "User successfully logged in",
                user: loginUser,
                sessionToken: token
            });

            } else {
            res.status(401).json ({
                message: "Login failed (code 17)"
            })
        }
        } else {
            res.status(401).json ({
                message: "Login failed (code 23)"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }

});

module.exports = router;