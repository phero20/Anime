import User from "../models/authModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const avatars = [
    'https://i.pinimg.com/736x/d8/0b/66/d80b66f5bf5d26f092df1f1cf955091a.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvLwij0Omv_jDGnlNxCNZkbJNyaMjXBQpaag&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy4_AiX3WacNPxG3EAZH1c-C081edxgFtE-g&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR68NkGAwFzlZKSFDuEdFszcI8oHeKM01hr3A&s'
]

export const signUp = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        // Check if user already exists
        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({success: false, message: 'User Already Exists'});
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Randomly select avatar
        const avatar = avatars[Math.floor(Math.random() * avatars.length)];
        // Create new user
        const user = await User.create({username, email, password: hashedPassword, avatar});
        // Generate JWT token
        const token = jwt.sign({
            userId: user._id,
            email
        }, process.env.JWT_SECRET);
        res.status(201).json({
            success: true,
            data: {
                token,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET
        );
        res.status(200).json({
            success: true,
            data: {
                token,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};