app.controller('NewDeckModalCtrl', function ($scope, $uibModalInstance, DeckService) {

	$scope.ok = function (deck) {
		DeckService.create(deck)
		.then(function (newDeck) {
    		$uibModalInstance.close(newDeck);
		});
  	};

  	$scope.cancel = function () {
    	$uibModalInstance.dismiss('cancel');
  	};
});