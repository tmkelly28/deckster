var router = require('express').Router();
var mongoose = require("mongoose");
var Card = mongoose.model('Card');

router.get('/templates', function (req, res, next) {
	Card.getTemplatesForUser(req.user._id)
	.then(function (templates) {
		res.status(200).json(templates);
	})
	.then(null, next);
});

// param middleware - sets the requested card as req.card
router.param("id", function (req, res, next, id) {
	Card.findById(id)
	.then(function(card) {
		req.card = card;
		next();
	})
	.then(null,next);
});

// GET a card by id
router.get("/:id", function (req, res) {
	res.status(200).json(req.card);
});

// PUT a given card by id
router.put("/:id", function (req, res, next) {
	req.card.set(req.body);
	req.card.save()
	.then(function(card) {
		res.status(200).json(card);
	})
	.then(null, next);
});

module.exports = router;
