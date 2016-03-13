var router = require('express').Router();
var mongoose = require("mongoose");
var Deck = mongoose.model('Deck');

// param middleware - sets the requested deck as req.deck
router.param("id", function (req, res, next, id) {
	Deck.findById(id)
	.populate('cards')
	.then(function(deck) {
		req.deck = deck;
		next();
	})
	.then(null,next);
});

// GET a deck by id
router.get("/:id", function (req, res) {
	res.status(200).json(req.deck);
});

module.exports = router;
