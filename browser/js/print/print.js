app.config(function ($stateProvider) {
    $stateProvider.state('print', {
        url: '/print/:did',
        templateUrl: 'js/print/print.template.html'
    });
});

app.controller('PrintCtrl', function ($scope) {

});