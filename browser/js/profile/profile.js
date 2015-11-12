app.config(function ($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'js/profile/profile.template.html',
        controller: 'profileCtrl'
    });
});

app.controller('ProfileCtrl', function ($scope, $state) {

});