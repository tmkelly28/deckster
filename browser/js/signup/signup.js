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

        AuthService.signup(signupInfo).then(function (user) {
            $state.go('profile', {uid: user._id});
        }).catch(function () {
            $scope.error = 'Invalid signup credentials.';
        });
    };
});