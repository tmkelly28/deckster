app.factory('GraphicService', function () {
	var parser = new DOMParser();
	
	return {
		parseSvg: function (svg) {
			var el = parser.parseFromString(svg, 'text/xml');
			return el.documentElement;
		},
		defaultTextEl: function (paper) {
			return paper.text(100, 100, 'default');
		},
		configure: function (el, options) {
			if(!options.isEdit) el.drag();
			if (options.fontStyle) el.attr({'font-family': options.fontStyle});
			if (options.fontSize) el.attr({'font-size': options.fontSize});
			if (options.fontColor) el.attr({'fill': options.fontColor});
			if (options.textContent) el.node.textContent = options.textContent
			if (options.fontColor) el.attr({'stroke': options.fontColor});
			return el;
		},
		setImageBackground: function (paper, url, config) {
			var image = paper.image(url);
			console.log(image);
			if (config !== 'frame') image.drag();
			if (config === 'frame') {
				image.attr({
					transform: 'matrix(1,0,0,1,37,41)'
				});
			}

			// append or prepend, depending on configuration
			var g = paper.select('g');
			if (config === 'back') g.prepend(image);
			else g.append(image);

			console.log('in gservice', image)

			return image;
		},
		addClickEvent: function (el, fn) {
			el.click(fn);
		},
		resizeSelected: function (el, options) {
			if (options.width) el.attr({width: options.width});
			if (options.height) el.attr({height: options.height});
		},
		removeSelected: function (el) {
			el.remove();
		}
	};
});