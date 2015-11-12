app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state, $uibModal, DeckService) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

            /* Create New Deck Modal */
            scope.animationsEnabled = true;
            scope.open = function (size) {

                var modalInstance = $uibModal.open({
                    animation: scope.animationsEnabled,
                    templateUrl: '/js/common/directives/navbar/new-deck.template.html',
                    controller: 'NewDeckModalCtrl',
                    size: size
                });

                modalInstance.result.then(function (newDeck) {
                    $rootScope.$broadcast('deckAdded');
                });

            }; /* end scope.open */

        } /* end link function */
    };
});
