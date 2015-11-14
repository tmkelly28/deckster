'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

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
    },
    isTemplate: {
        type: Boolean,
        default: false
    }
});

var templates = [
    {
        name: 'Blank Template',
        svg:'<svg id="svg1" width="339" height="469" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">' +
                '<g id="group">' +
                    '<title>Layer 1</title>' +
                    '<rect fill="none" stroke="#000000" stroke-width="5" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="3" y="3" width="333" height="463" rx="10" ry="10" id="svg_1"/>' +
                '</g>' +
            '</svg>'
    },
    {
        name: 'Blank With Frame',
        svg: '<svg width="339" height="469" xmlns="http://www.w3.org/2000/svg">' +
                '<g id="group">' +
                    '<title>Layer 1</title>' +
                    '<rect fill="none" stroke="#000000" stroke-width="5" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="3" y="3" width="333" height="463" rx="10" ry="10" id="svg_1"/>' +
                    '<rect fill="none" stroke="#000000" stroke-width="5" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="34.5" y="39" width="270" height="270" rx="10" ry="10" id="svg_2"/>' +
                '</g>' +
            '</svg>'
    },
    {
        name: 'Summoner',
        svg: '<svg></svg>'
    },
    {
        name: 'Monster Collector',
        svg: '<svg></svg>'
    }
];

schema.statics.getTemplatesForUser = function (uid) {
    return this.model('Card').find({user:uid}).exec()
    .then(function (cards) {
        console.log(cards);
        cards = cards.filter(card => card.isTemplate === true);
        return cards.concat(templates);
    })
}

mongoose.model('Card', schema);