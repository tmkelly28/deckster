app.factory('UserService', function ($http, DeckService) {

	function toData (res) {
		return res.data;
	}

	return {
		// Fetchs the user by id, and sets that User's decks in the DeckService's cache
		fetchById: function (id) {
			return $http.get('api/users/' + id)
			.then(function (res) {
				DeckService.setCache(res.data.decks)
				return res.data;
			});
		}
	};
});