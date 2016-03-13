app.factory('CardService', function ($http) {
	var currentCard;

	return {
		fetchById: function (id) {
			return $http.get('/api/card/' + id)
			.then(function (res) {
				currentCard = res.data;
				return currentCard;
			});
		},
		saveChanges: function (id, changes) {
			return $http.put('/api/card/' + id, changes)
			.then(function (res) {
				currentCard = res.data;
				return currentCard;
			});
		},
		fetchTemplates: function () {
			return $http.get('/api/card/templates')
			.then(function (res) {
				return res.data;
			})
		}
	};

});
