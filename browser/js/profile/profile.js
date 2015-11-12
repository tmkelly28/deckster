app.config(function ($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile/:uid',
        templateUrl: 'js/profile/profile.template.html',
        controller: 'ProfileCtrl',
        resolve: {
        	user: function ($stateParams, UserService) {
        		return UserService.fetchById($stateParams.uid);
        	}
        }
    });
});

app.controller('ProfileCtrl', function ($scope, $state, user, AuthService, $rootScope, AUTH_EVENTS, UserService, DeckService, $uibModal) {

    var setUser = function () {
        AuthService.getLoggedInUser()
        .then(function (user) {
            return UserService.fetchById(user._id);
        })
        .then(function (user) {
            $scope.user = user;
            $scope.decks = user.decks;
        });
    };

    var setDeck = function () {
        $scope.decks = DeckService.getCache();
    }


    /*  The controls with the navbar directive communicate with the profile via events.
        This allows the profile to be populated after logging in, when the Your Profile option is selected 
    */
    $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
    $rootScope.$on('deckAdded', setDeck);
    
    // When logging in, this invocation sets the user
    setUser();


    /* Deck Control Modal */
    $scope.open = function (deck) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/js/profile/deck-options.template.html',
            controller: 'DeckOptionsCtrl',
            size: 'lg',
            resolve: {
                deck: deck
            }
        });

        modalInstance.result.then(function () {
            
        });

    }; /* end scope.open */
});