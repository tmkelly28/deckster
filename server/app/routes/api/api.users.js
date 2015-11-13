var router = require('express').Router();
var mongoose = require("mongoose");
var _ = require('lodash');
var passport = require('passport');
var User = mongoose.model('User');

// GET all users by query
router.get("/", function (req, res, next) {
	User.find({})
	.then(function (users) {
		res.status(200).json(users);
	})
	.then(null,next);
});

// POST a new user
router.post("/", function (req, res, next) {
	User.create(req.body)
	.then(function (user) {
		req.logIn(user, function (loginErr) {
			if (loginErr) res.status(500).send(loginErr);
			res.status(201).send({
            	user: _.omit(user.toJSON(), ['password', 'salt'])
       		});
		})
	})
	.then(null,next);
});

// param middleware - sets the requested user as req.requestedUser
router.param("id", function (req, res, next, id) {
	User.findById(id)
	.populate('decks')
	.then(function(user) {
		req.requestedUser = user;
		next();
	})
	.then(null,next);
});

// GET a user by id
router.get("/:id", function (req, res, next) {
	res.json(req.requestedUser);
});

// PUT a given user by id
router.put("/:id", function (req, res, next) {
	req.requestedUser.set(req.body);
	req.requestedUser.save()
	.then(function(user){
		res.status(200).json(user);
	})
	.then(null, next);
});

// DELETE a given user by id
router.delete("/:id", function (req, res, next) {
	req.requestedUser.remove()
	.then(function (user){
		res.status(200).json(user);
	})
	.then(null,next);
});

router.use('/:id/decks', require('./api.decks'));

module.exports = router;