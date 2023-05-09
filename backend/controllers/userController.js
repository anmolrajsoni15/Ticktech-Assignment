const User = require('../models/userModel');

exports.createUser = async(req, res) => {
    try {
        const {name, age, hobbies} = req.body;
        const user = await User.create({
            name,
            age,
            hobbies
        });
        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (error) {
        res.status(400).json({
            message: "User creation failed",
            error
        });
        console.log(error);
    }
}

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            message: "All users fetched successfully",
            users
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to fetch users",
            error
        });
        console.log(error);
    }
}

exports.getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            message: "User fetched successfully",
            user
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to fetch user",
            error
        });
        console.log(error);
    }
}

exports.updateUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const {name, age, hobbies} = req.body;
        user.name = name;
        user.age = age;
        user.hobbies = hobbies;
        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update user",
            error
        });
        console.log(error);
    }
}

exports.deleteUserById = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete user",
            error
        });
        console.log(error);
    }
}