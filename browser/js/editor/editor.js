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
    $scope.selectedElType = null;
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

    /* toggles */
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
    $scope.bgiurlCollapsed = true;
    $scope.fbgiurlCollapsed = true;
    $scope.newImageUrlCollapsed = true;
    


    /* declare the paper (Snap representation of the svg) */
    var paper;

    /* declare cb function for click event handler */
    function setSelected () {
        console.log(this);
        $scope.selectedEl = this;
        $scope.selectedElType = this.type;
        $scope.save();
        $rootScope.$digest();
    }

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

    /* parse string to DOM svg */
    var svgContainer = document.getElementById('svg-container');
    svgContainer.appendChild(GraphicService.parseSvg($scope.card.svg));

    /* Methods for applying edits to SVG in DOM */
    $scope.changeBgColor = function (color) {
        $('#svg_1').attr('fill', color);
        $scope.save();
    }
    $scope.changeBorderColor = function (color) {
        $('#svg_1').attr('stroke', color);
        $scope.save();
    }
    $scope.changeBorderSize = function (size) {
        $('#svg_1').attr('stroke-width', size);
        $scope.save();
    }
    $scope.changeFrameBgColor = function (color) {
        $('#svg_2').attr('fill', color);
        $scope.save();
    }
    $scope.changeFrameBorderColor = function (color) {
        $('#svg_2').attr('stroke', color);
        $scope.save();
    }
    $scope.changeFrameBorderSize = function (size) {
        $('#svg_2').attr('stroke-width', size);
        $scope.save();
    }
    $scope.addTextElement = function (text) {
        var textEl = GraphicService.defaultTextEl(paper);
        textEl = GraphicService.configure(textEl, text);
        GraphicService.addClickEvent(textEl, setSelected);
        paper.append(textEl);
        $scope.save();
    }
    $scope.editTextElement = function (el, edit) {
        el = GraphicService.configure(el, edit);
        $scope.save();
    }

    /* parse DOM svg to string for storage in db */
    $scope.save = function () {
        var str = $('#svg-container');
        var templateStatus = $scope.card.isTemplate || $scope.templateCheck;
        CardService.saveChanges($scope.card._id, { svg: str[0].innerHTML, isTemplate: templateStatus, user: Session.user._id })
        .then(function (card) {
            $scope.card = card;
            console.log('saved ', card)
        });
    }
    $scope.saveAsTemplate = function () {
        $scope.templateCheck = true;
        $scope.toggleSaveAlert = true;
        $timeout(function () {
            $scope.toggleSaveAlert = false;
        }, 2000)
        $scope.save();
    }

    /* handle file uploads */
    $scope.uploadFiles = function(file, errFiles, config) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];

        if (file) {
            /* cache the width and height
            due to the delay in rendering the svg, sometimes these attributes are not set in the DOM by the time we save
            */
            var cbHeight = file.$ngfHeight
            var cbWidth = file.$ngfWidth
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

                // fix height/width issues that may result from async loading of svg
                if (!image.node.attributes.width) image.attr({ width: cbWidth });
                if (!image.node.attributes.height) image.attr({ height: cbHeight });

                $scope.save();
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
        $scope.save();
    }

    /* methods for handling element selection */
    $scope.removeSelected = function () {
        GraphicService.removeSelected($scope.selectedEl);
        $scope.selectedEl = null;
        $scope.save();
    }

    $scope.resizeSelected = function (options) {
        GraphicService.resizeSelected($scope.selectedEl, options);
        $scope.save();
    }

    /* navigation methods */
    $scope.back = function () {
        $state.go('cards', {did: $scope.card.deck});
    }


});
