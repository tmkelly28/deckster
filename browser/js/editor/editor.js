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

app.controller('EditorCtrl', function ($scope, card, CardService, $timeout, GraphicService, $rootScope, Upload, Session, $state) {
    
    $scope.card = card;
    $scope.selectedEl = null;
    $scope.toggleSaveAlert = false;
    $scope.toggleErrorAlert = false;
    $scope.borderSizeCollapsed = true;
    $scope.fborderSizeCollapsed = true;
    $scope.bgImageCollapsed = true;
    $scope.fbgImageCollapsed = true;
    $scope.imageCollapsed = true;
    $scope.bgipCollapsed = true;
    $scope.selectCollapsed = true;
    $scope.textOptionsCollapsed = true;
    $scope.templateCheck = false;
    $scope.hasFrame = $scope.card.templateOrigin !== 'Blank';
    $scope.presetBackgroundImages = [
        {   name: 'Pure of Heart',
            url: 'https://s3-us-west-2.amazonaws.com/deckster/pureheart.jpg'
        },
        {   name: 'Sinister Intent',
            url: 'https://s3-us-west-2.amazonaws.com/deckster/sinisterintent.jpg'
        }
    ];
    $scope.presetImages = [];

    $scope.back = function () {
        $state.go('cards', {did: $scope.card.deck});
    }

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
        var imgs = paper.selectAll('image');
        text.items.forEach(function (t) {
           t.drag();
           GraphicService.addClickEvent(t, setSelected);
        });
        imgs.items.forEach(function (i) {
            i.drag();
            GraphicService.addClickEvent(i, setSelected);
        });
    }

    function setSelected () {
        console.log(this);
        $scope.selectedEl = this;
        $rootScope.$digest();
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
    $scope.changeFrameBgColor = function (color) {
        $('#svg_2').attr('fill', color);
    }
    $scope.changeFrameBorderColor = function (color) {
        $('#svg_2').attr('stroke', color);
    }
    $scope.changeFrameBorderSize = function (size) {
        $('#svg_2').attr('stroke-width', size);
    }
    $scope.addTextElement = function (text) {
        var textEl = GraphicService.defaultTextEl(paper);
        textEl = GraphicService.configure(textEl, text);
        GraphicService.addClickEvent(textEl, setSelected);
        paper.append(textEl);
    }

    /* parse DOM svg to string for storage in db */
    $scope.save = function () {
        var str = $('#svg-container');
        var templateStatus = $scope.card.isTemplate || $scope.templateCheck;
        CardService.saveChanges($scope.card._id, { svg: str[0].innerHTML, isTemplate: templateStatus, user: Session.user._id })
        .then(function (card) {
            $scope.card = card;
            $scope.toggleSaveAlert = true;
            $timeout(function () {
                $scope.toggleSaveAlert = false;
            }, 1000)
        })
    }

    $scope.uploadFiles = function(file, errFiles, config) {
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
                var image = GraphicService.setImageBackground(paper, imageUrl, config);
                GraphicService.addClickEvent(image, setSelected);
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
        } else {
            $scope.toggleErrorAlert = true;
            $scope.errorMsg = "This image doesn't seem to work. Please try a different one"
            $timeout(function () {
                $scope.toggleErrorAlert = false;
            }, 2000);
        } 
    }

    $scope.selectImage = function (imageUrl, config) {
        var image = GraphicService.setImageBackground(paper, imageUrl, config);
        GraphicService.addClickEvent(image, setSelected);
    }

    $scope.removeSelected = function () {
        GraphicService.removeSelected($scope.selectedEl);
        $scope.selectedEl = null;
    }

    $scope.resizeSelected = function (options) {
        GraphicService.resizeSelected($scope.selectedEl, options);
    }



});
