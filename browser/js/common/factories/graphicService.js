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
			el.drag();
			if (options.fontStyle) el.attr({'font-family': options.fontStyle});
			if (options.fontSize) el.attr({'font-size': options.fontSize});
			if (options.fontColor) el.attr({'fill': options.fontColor});
			if (options.textContent) el.node.textContent = options.textContent
			if (options.fontColor) el.attr({'stroke': options.fontColor});
			return el;
		},
		setImageBackground: function (paper, url, config) {
			var image = paper.image(url);
			if (config !== 'frame') image.drag();
			if (config === 'frame') {
				image.attr({
					transform: 'matrix(1,0,0,1,37,41)'
				});
				setTimeout(function () {
					Snap.select('image').attr({
						width: 265,
						height: 265
					});
				}, 1000);
			}

			// append or prepend, depending on configuration
			var g = paper.select('g');
			if (config === 'back') g.prepend(image);
			else g.append(image);

			return image;
		},
		addClickEvent: function (el, fn) {
			el.click(fn);
		},
		resizeSelected: function (el, options) {
			el.attr({
				width: options.width,
				height: options.height
			})
		},
		removeSelected: function (el) {
			el.remove();
		}
	};
});