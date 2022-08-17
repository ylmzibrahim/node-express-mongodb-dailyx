const mongoose = require('mongoose');

const profileSchema = mongoose.Schemma({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = Profile = mongoose.model('Profile', profileSchema);