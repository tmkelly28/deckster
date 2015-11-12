'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
    	type: String,
    	required: true
    },
    cards: [{
        	type: mongoose.Schema.Types.ObjectId,
        	ref: 'Card'
        }],
    description: {
    	type: String
    }
});

mongoose.model('Deck', schema);