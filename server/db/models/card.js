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

var templates = {
    blank: '<svg id="svg1" width="333" height="463" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">' +
                    '<g>' +
                        '<title>Layer 1</title>' +
                        '<rect fill="none" stroke="#000000" stroke-width="5" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="0" y="0" width="333" height="463" id="svg_1"/>' +
                    '</g>' +
                '</svg>',
    blankBorder: '<svg></svg>',
    summoner: '<svg></svg>',
    monsterCollector: '<svg></svg>'
}

// assign default template
schema.pre('save', function (next) {
    if (this.svg === "Blank Template") this.svg = templates['blank'];
    next();
});

mongoose.model('Card', schema);