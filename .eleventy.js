const nunjucks = require('nunjucks');
const ModularClassName = require('./lib/modular-class-name');
const { path: sitePath } = require('./site.config');

module.exports = function(eleventyConfig) {
	const config = {
		dir: {
			input: 'src',
			output: '.build-tmp'
		},
		pathPrefix: sitePath
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

		return new nunjucks.runtime.SafeString(`<style>siteInline(siteAsset(${url}))</style>`);
	});

	eleventyConfig.addShortcode('headingSlug', (str) => {
		return new nunjucks.runtime.SafeString(
			str.replace(/\s/g, () => `<span class=${modCSS.getClassName('/_includes/module.css', 'slug-dash')}></span>`)
		);
	});

	/** Dump JSON data in a way that's safe to be output in HTML */
	eleventyConfig.addShortcode('json', (obj) => {
		return JSON.stringify(obj)
			.replace(/<!--/g, '<\\!--')
			.replace(/<script/g, '<\\script')
			.replace(/<\/script/g, '<\\/script');
	});

	/** Get an ISO 8601 version of a date */
	eleventyConfig.addShortcode('isoDate', (timestamp) => {
		return new Date(timestamp.valueOf()).toISOString();
	});

	return config;
};
