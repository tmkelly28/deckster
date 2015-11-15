app.factory('DeckService', function ($http, Session) {

	// note: cache is populated whenever a user record is fetched by the UserService
	var cache = [];
	var currentDeck;

	function toData (res) {
		return res.data;
	}

	var service = {};

	service.create = function (newDeck) {
		return $http.post('/api/users/' + Session.user._id + '/decks', newDeck)
		.then(function (res) {
			cache.push(res.data);
			return res.data;
		});
	}
	service.fetchById = function (id) {
		return $http.get('/api/deck/' + id)
		.then(function (res) {
			currentDeck = res.data;
			return res.data;
		});
	}
	service.removeDeck = function (id) {
		return $http.delete('/api/users/' + Session.user._id + '/decks/' + id)
		.then(function (res) {
			return service.removeDeckFromCache(res.data._id);
		})
	}
	service.addCard = function (deckId, card) {
		var template = JSON.parse(card.svg);
		card.svg = template.svg;
		card.templateOrigin = template.templateOrigin;
		return $http.post('/api/users/' + Session.user._id + '/decks/' + deckId + '/cards', card)
		.then(toData)
	}
	service.removeCard = function (deckId, cardId) {
		return $http.delete('/api/users/' + Session.user._id + '/decks/' + deckId + '/cards/' + cardId)
		.then(function (res) {
			return service.removeCardFromCache(res.data._id)
		});
	}
	service.setCache = function (decks) {
		angular.copy(decks, cache);
	}
	service.getCache = function () {
		return cache;
	}
	service.removeDeckFromCache = function (id) {
		cache = cache.filter(deck => deck._id !== id);
		return cache;
	}
	service.removeCardFromCache = function (id) {
		currentDeck.cards = currentDeck.cards.filter(card => card._id !== id);
		return currentDeck;
	}
	service.getCurrentDeck = function () {
		return currentDeck;
	}
	
	return service;
});