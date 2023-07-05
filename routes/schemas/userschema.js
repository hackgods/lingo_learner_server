const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    firstName: {
        type: String,
        required: [true,"Please enter first name"]
    },
    lastName: {
        type: String,
        required: [true,"Please enter last name"]
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    email: {
        type: String,
        required: 'Please enter your email',
        trim: true,
        lowercase:true,
        unique:true
    },
    currentLearningLanguage: {
        type: String,
    },
    
    dob: {
        type: Date,
        //required: [true,"Please enter dob"]
    },
    createdDate: Date,
    points: {
        type: Number,
        min: 0,
        max: 1000,
        default: 0
    },
    password: {
        type: String,
        required: [true,"Please enter password"]
    },
});

module.exports = mongoose.model('Users', userSchema);
