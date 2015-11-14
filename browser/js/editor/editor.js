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

app.controller('EditorCtrl', function ($scope, card, CardService, $timeout, GraphicService, $rootScope, Upload, Session) {
    
    $scope.card = card;
    $scope.toggleAlert = false;
    $scope.borderSizeCollapsed = true;
    $scope.textOptionsCollapsed = true;
    $scope.templateCheck = false;

    /* declare the paper (Snap representation of the svg) */
    var paper;

    /* Move Snap configuration to the event queue to handle the async loading of SVG */
    $(document).ready(function(){
        setTimeout(snapConfiguration, 0);
    });

    // Snap configuration on page load;
    function snapConfiguration () {
        paper = Snap('#svg1');
        var text = paper.selectAll('text');
        text.items.forEach(function (i) {
           i.drag();
        });
    }


    /* parse string to DOM svg */
    var svgContainer = document.getElementById('svg-container');
    svgContainer.appendChild(GraphicService.parseSvg($scope.card.svg));

    /* Methods for applying edits to SVG in DOM */
    $scope.changeBgColor = function (color) {
        $('#svg_1').attr('fill', color);
    }
    $scope.changeBorderColor = function (color) {
        $('#svg_1').attr('stroke', color);
    }
    $scope.changeBorderSize = function (size) {
        $('#svg_1').attr('stroke-width', size);
    }
    $scope.addTextElement = function (text) {
        var textEl = GraphicService.defaultTextEl(paper);
        textEl = GraphicService.configure(textEl, text);
        paper.append(textEl);
    }

    /* parse DOM svg to string for storage in db */
    $scope.save = function () {
        var str = $('#svg-container');
        var templateStatus = $scope.card.isTemplate || $scope.templateCheck;
        CardService.saveChanges($scope.card._id, { svg: str[0].innerHTML, isTemplate: templateStatus, user: Session.user._id })
        .then(function (card) {
            $scope.card = card;
            $scope.toggleAlert = true;
            $timeout(function () {
                $scope.toggleAlert = false;
            }, 1000)
        })
    }

    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];

        if (file) {
            file.upload = Upload.upload({
                url: '/api/upload',
                method: 'POST',
                data: {
                    key: file.name,
                    "Content-Type": file.type != '' ? file.type : 'application/octet-stream',
                    filename: file.name,
                    file: file
                }
            });

            file.upload.then(function (response) {
                var imageUrl = response.data.imageUrl;
                GraphicService.setImageBackground(paper, imageUrl);
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }   
    }

});
