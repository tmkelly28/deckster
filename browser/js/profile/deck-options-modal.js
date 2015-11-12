app.controller('DeckOptionsCtrl', function ($scope, $uibModalInstance, DeckService, deck, $state) {

	$scope.deck = deck;

	$scope.goCards = function () {
		$state.go('cards', {did: deck._id})
		$uibModalInstance.close();
	}

	$scope.goAddCard = function () {
		$state.go('addcard', {did: deck._id})
		$uibModalInstance.close();
	}

	$scope.goPrint = function () {
		$state.go('print', {did: deck._id});
		$uibModalInstance.close();
	}

  	$scope.cancel = function () {
    	$uibModalInstance.dismiss('cancel');
  	};
});