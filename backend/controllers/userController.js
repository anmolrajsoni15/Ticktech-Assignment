const User = require('../models/userModel');

let port;
if (process.argv[1].includes('server.js')) {
    port = require('../server').serverPort;
} else if (process.argv[1].includes('cluster.js')) {
    port = require('../cluster').clusterPort;
}

exports.createUser = async(req, res) => {
    try {
        const {name, age, hobbies} = req.body;
        const user = await User.create({
            name,
            age,
            hobbies
        });
        res.status(201).json({
            requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
            status: "201 success",
            message: "User created successfully",
            user
        });
    } catch (error) {
        res.status(400).json({
            requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
            status: "400 error",
            message: "User creation failed",
            error
        });
    }
}

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
            status: "200 success",
            message: "All users fetched successfully",
            users
        });
    } catch (error) {
        res.status(400).json({
            requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
            status: "400 error",
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
                requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
                status: "404 error",
                message: "User not found"
            });
        }
        res.status(200).json({
            requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
            status: "200 success",
            message: "User fetched successfully",
            user
        });
    } catch (error) {
        res.status(400).json({
            requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
            status: "400 error",
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
                requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
                status: "404 error",
                message: "User not found"
            });
        }

        const {name, age, hobbies} = req.body;
        user.name = name;
        user.age = age;
        user.hobbies = hobbies;
        await user.save();

        res.status(200).json({
            requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
            status: "200 success",
            message: "User updated successfully",
            user
        });
    } catch (error) {
        res.status(400).json({
            requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
            status: "400 error",
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
                requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
                status: "404 error",
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
            status: "200 success",
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            requestFrom: `Request from ${process.pid} and running on http://localhost:${port}`,
            status: "400 error",
            message: "Failed to delete user",
            error
        });
    }
}