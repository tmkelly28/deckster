app.config(function ($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.template.html',
        controller: 'SignupCtrl'
    });
});

app.controller('SignupCtrl', function ($scope, AuthService, $state) {

    $scope.signup = {};
    $scope.error = null;

    $scope.sendsignup = function (signupInfo) {

        $scope.error = null;

        AuthService.signup(signupInfo).then(function () {
            $state.go('profile');
        }).catch(function () {
            $scope.error = 'Invalid signup credentials.';
        });
    };
});