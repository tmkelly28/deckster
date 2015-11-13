app.config(function ($stateProvider) {
    $stateProvider.state('cards', {
        url: '/cards/:did',
        templateUrl: 'js/cards/cards.template.html',
        controller: 'CardsCtrl',
        resolve: {
        	deck: function ($stateParams, DeckService) {
        		return DeckService.fetchById($stateParams.did);
        	}
        }
    });
});

app.controller('CardsCtrl', function ($scope, deck, $state, DeckService) {
	$scope.deck = deck;
	$scope.goEditor = function (card) {
		$state.go('editor', { cid: card._id });
	}
    $scope.removeCard = function (did, cid) {
        DeckService.removeCard(did, cid)
        .then(function (cache) {
            $scope.deck = cache;
        });  
    }
});