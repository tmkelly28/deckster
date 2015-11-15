app.config(function ($stateProvider) {
    $stateProvider.state('addcard', {
        url: '/addcard/:did',
        templateUrl: 'js/addcard/add-card.template.html',
        controller: 'AddCardCtrl',
        resolve: {
        	deck: function ($stateParams, DeckService) {
        		return DeckService.fetchById($stateParams.did);
        	},
            templates: function (CardService) {
                return CardService.fetchTemplates();
            }
        }
    });
});

app.controller('AddCardCtrl', function ($scope, deck, templates, DeckService, $state, Session) {
	$scope.deck = deck;
    $scope.templates = templates;
	$scope.submit = function () {
        $scope.card.user = Session.user._id;
        $scope.card.deck = $scope.deck._id;
        DeckService.addCard($scope.deck._id, $scope.card)
        .then(function (card) {
            $state.go('editor', {cid: card._id});
        });
    }
    $scope.back = function () {
        $state.go('profile', Session.user._id);
    }
});