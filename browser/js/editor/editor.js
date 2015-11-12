app.config(function ($stateProvider) {
    $stateProvider.state('editor', {
        url: '/editor/:cid',
        templateUrl: 'js/editor/editor.template.html',
        controller: 'EditorCtrl',
        resolve: {
        	card: function ($stateParams, CardService) {
        		return CardService.fetchById($stateParams.cid);
        	}
        }
    });
});

app.controller('EditorCtrl', function ($scope, card, CardService, $timeout) {
	$scope.card = card;
    $scope.toggleAlert = false;

    $scope.changeBgColor = function (color) {
        $('#svg_1').attr('fill', color);
    }

    $scope.changeBorderColor = function (color) {
        $('#svg_1').attr('stroke', color);
    }

    $scope.changeBorderSize = function (size) {
        $('#svg_1').attr('stroke-width', size);
    }

    /* parse string to DOM svg */
    var parser = new DOMParser();
    var svg = parser.parseFromString($scope.card.svg, 'text/xml');
    document.getElementById('svg-container').appendChild(svg.documentElement);

    /* parse DOM svg to string */
    $scope.save = function () {
        var str = $('#svg-container');
        CardService.saveChanges($scope.card._id, { svg: str[0].innerHTML })
        .then(function (card) {
            $scope.card = card;
            $scope.toggleAlert = true;
            $timeout(function () {
                $scope.toggleAlert = false;
            }, 1000)
        })
    }

    $scope.close = function () {
        $scope.toggleAlert = false;
    }
});