import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try {

        const { name, email, phone, password } = req.body;

        const userExists = await User.findOne({ email });

        if(userExists){
            return res.status(400).json({
                message:"Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            phone,
            password:hashedPassword
        });

        res.status(201).json({
            success:true,
            message:"User Registered Successfully"
        });

    } catch (error) {
        console.log(error);
    }
};

import generateToken from "../utils/generateToken.js";


export const login = async (req,res)=>{
    try {

        const { name, email, phone, password } = req.body;

        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({
                message:"Invalid Email"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid Password"
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success:true,
            message:"Login Successful",
            token,
            user
        });

    } catch (error) {
        console.log(error);
    }
};