app.factory('DeckService', function ($http, Session) {

	// note: cache is populated whenever a user record is fetched by the UserService
	var cache = [];
	var currentDeck;

	function toData (res) {
		return res.data;
	}

	return {
		create: function (newDeck) {
			return $http.post('/api/users/' + Session.user._id + '/decks', newDeck)
			.then(function (res) {
				cache.push(res.data);
				return res.data;
			});
		},
		fetchById: function (id) {
			return $http.get('/api/deck/' + id)
			.then(function (res) {
				currentDeck = res.data;
				return res.data;
			});
		},
		addCard: function (deckId, card) {
			return $http.post('/api/users/' + Session.user._id + '/decks/' + deckId + '/cards', card)
			.then(toData)
		},
		setCache: function (decks) {
			angular.copy(decks, cache);
		},
		getCache: function () {
			return cache;
		},
		getCurrentDeck: function () {
			return currentDeck;
		}
	};
});