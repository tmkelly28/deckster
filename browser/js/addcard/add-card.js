app.config(function ($stateProvider) {
    $stateProvider.state('addcard', {
        url: '/addcard/:did',
        templateUrl: 'js/addcard/add-card.template.html',
        controller: 'AddCardCtrl',
        resolve: {
        	deck: function ($stateParams, DeckService) {
        		return DeckService.fetchById($stateParams.did);
        	}
        }
    });
});

app.controller('AddCardCtrl', function ($scope, deck, DeckService, $state) {
	$scope.deck = deck;
	$scope.submit = function () {
        DeckService.addCard($scope.deck._id, $scope.card)
        .then(function (card) {
            $state.go('editor', {cid: card._id})
        });
    }
});