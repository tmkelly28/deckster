var router = require('express').Router();
var mongoose = require("mongoose");
var _ = require('lodash');
var Card = mongoose.model('Card');
var Deck = mongoose.model('Deck');

// GET all cards from a deck
router.get("/", function (req, res, next) {
	res.status(200).json(req.deck.cards);
});

// POST a new card
router.post("/", function (req, res, next) {
	var _card;

	Card.create(req.body)
	.then(function (card) {
		_card = card;
		return Deck.findByIdAndUpdate(req.deck._id, { $push: { 'cards': card._id } })
	})
	.then(function (deck) {
		res.status(201).json(_card);
	})
	.then(null,next);
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
router.get("/:id", function (req, res, next) {
	res.json(req.card);
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

// DELETE a given card by id (responds with a deck)
router.delete("/:id", function (req, res, next) {
	var cardId = req.card._id;

	req.card.remove()
	.then(function () {
		req.deck.cards = req.deck.cards.filter(card => card._id !== cardId);
		return req.deck.save();
	})
	.then(function (deck) {
		res.status(200).json(deck);
	})
	.then(null,next);
});

module.exports = router;