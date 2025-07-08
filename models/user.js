const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: String,
    balance: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ['donor', 'receiver', 'admin'],
        required: true
    },
    profileImage: {
        url: String,
        filename: String
    }
}, { timestamps: true }); // <-- adds createdAt & updatedAt

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
