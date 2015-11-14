app.config(function ($stateProvider) {
    $stateProvider.state('print', {
        url: '/print/:did',
        templateUrl: 'js/print/print.template.html',
        controller: 'PrintCtrl',
        resolve: {
        	deck: function ($stateParams, DeckService) {
        		return DeckService.fetchById($stateParams.did)
        	}
        }
    });
});

app.controller('PrintCtrl', function ($scope, deck, GraphicService, $state, Session) {
	$scope.deck = deck;

    /* Move rendering to the event queue to handle the async loading of SVG */
    setTimeout(function () {
		for (var i = 0; i < $scope.deck.cards.length; i++) {
            var c = "#print-container li:nth-child(" + (i + 1) + ")";
            $(c).append(GraphicService.parseSvg($scope.deck.cards[i].svg));
		}
    }, 0);

    $scope.print = function () {
        window.print();
    };

    $scope.back = function () {
        $state.go('profile', Session.user._id);
    };
});