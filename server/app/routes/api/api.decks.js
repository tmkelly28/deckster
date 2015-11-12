var router = require('express').Router();
var mongoose = require("mongoose");
var _ = require('lodash');
var Deck = mongoose.model('Deck');
var User = mongoose.model('User');

// GET all decks by query
router.get("/", function (req, res, next) {
	Deck.find({ user: req.requestedUser._id })
	.populate('cards')
	.then(function (decks) {
		res.status(200).json(decks);
	})
	.then(null,next);
});

// POST a new deck
router.post("/", function (req, res, next) {
	var _deck;

	Deck.create(req.body)
	.then(function (deck) {
		_deck = deck
		return User.findByIdAndUpdate(req.requestedUser._id, { $push: { 'decks': deck._id } });
	})
	.then(function (user) {
		res.status(201).json(_deck);
	})
	.then(null,next);
});

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
router.get("/:id", function (req, res, next) {
	res.json(req.deck);
});

// PUT a given deck by id
router.put("/:id", function (req, res, next) {
	req.deck.set(req.body);
	req.deck.save()
	.then(function(deck) {
		res.status(200).json(deck);
	})
	.then(null, next);
});

// DELETE a given deck by id
router.delete("/:id", function (req, res, next) {
	var _deck = req.deck;

	req.deck.remove()
	.then(function (deck) {
		return User.findByIdAndUpdate(req.requestedUser._id, { $pull: { 'decks': _deck._id } });
	}).then(function () {
		res.status(200).json(_deck);
	})
	.then(null,next);
});

router.use('/:id/cards', require('./api.cards'));

module.exports = router;