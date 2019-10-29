const nunjucks = require('nunjucks');
const ModularClassName = require('./lib/modular-class-name');

module.exports = function(eleventyConfig) {
	const config = {
		dir: {
			input: 'src',
			output: '.build-tmp'
		}
	};

	const modCSS = new ModularClassName(config.dir.output);

	/** Get a class name from a CSS module */
	eleventyConfig.addShortcode('className', (css, className) => {
		return modCSS.getClassName(css, className);
	});

	const cssPerPage = new Map();

	// This is to hack around https://github.com/11ty/eleventy/issues/638
	eleventyConfig.addShortcode('pageStart', (page) => {
		cssPerPage.set(page.url, new Set());
		return '';
	});

	/** Add some CSS, deduping anything along the way */
	eleventyConfig.addShortcode('css', (page, url) => {
		if (!cssPerPage.has(page.url)) {
			cssPerPage.set(page.url, new Set());
		}

		const set = cssPerPage.get(page.url);

		if (set.has(url)) return '';
		set.add(url);

		return new nunjucks.runtime.SafeString(`<style>confboxInline(confboxAsset(${url}))</style>`);
	});

	eleventyConfig.addShortcode('headingSlug', (str) => {
		return new nunjucks.runtime.SafeString(
			str.replace(/\s/g, () => `<span class=${modCSS.getClassName('/_includes/module.css', 'slug-dash')}></span>`)
		);
	});

	eleventyConfig.addShortcode('idify', (str) => {
		return str.toLowerCase().replace(/\s/g, '-');
	});

	/** Dump JSON data in a way that's safe to be output in HTML */
	eleventyConfig.addShortcode('json', (obj) => {
		return JSON.stringify(obj)
			.replace(/<!--/g, '<\\!--')
			.replace(/<script/g, '<\\script')
			.replace(/<\/script/g, '<\\/script');
	});

	// eleventyConfig.addCollection('pages', (collection) => {
	// 	return buildScheduleData(collection.getFilteredByTag('session'), collection.getFilteredByTag('speakers'));
	// });

	return config;
};
