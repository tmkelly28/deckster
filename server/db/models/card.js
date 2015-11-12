'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    svg: {
    	type: String,
    	required: true
    },
    name: {
        type: String,
        required: true
    }
});

mongoose.model('Card', schema);