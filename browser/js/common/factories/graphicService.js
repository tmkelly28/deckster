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
			if (options.textContent) el.node.textContent = options.textContent
			if (options.fontColor) el.attr({'stroke': options.fontColor});
			return el;
		},
		setImageBackground: function (paper, url) {
			var image = paper.image(url);
			image.drag();
			var g = paper.select('g');
			g.prepend(image);
		}
	};
});