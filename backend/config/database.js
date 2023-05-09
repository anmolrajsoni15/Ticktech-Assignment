const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');

exports.connectDatabase = async() => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {dbName: "testingDB"});
    console.log(`MongoDB successfully connected to ${mongoUri}`);
}

exports.connectConsistentDatabase = async() => {
    const mongoUri = 'mongodb://127.0.0.1:27017/';

    await mongoose.connect(mongoUri);
    console.log(`MongoDB successfully connected to ${mongoUri}`);
}