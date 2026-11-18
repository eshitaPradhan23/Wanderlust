const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
});

// A user must have at least one way to be contacted: email or phone.
userSchema.pre("validate", function () {
    if (!this.email && !this.phone) {
        this.invalidate("email", "Please provide an email or a phone number");
    }
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
