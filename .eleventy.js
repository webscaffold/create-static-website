const fs = require('fs');
const nunjucks = require('nunjucks');
const { path: sitePath } = require('./site.config');

class ModularClassName {
	constructor(output) {
		this._output = output;
		this._cache = new Map();
	}
	_getData(css) {
		if (!css.startsWith('/')) {
			throw new TypeError('CSS path must be absolute (starts with /)');
		}

		if (!this._cache.has(css)) {
			const file = this._output + css + '.json';
			const json = fs.readFileSync(file, {
				encoding: 'utf8'
			});
			this._cache.set(css, JSON.parse(json));
		}

		return this._cache.get(css);
	}
	getClassName(css, className) {
		const data = this._getData(css);

		if (!(className in data)) {
			throw new TypeError(`Cannot find className "${className}" in ${css}`);
		}

		return data[className];
	}
	getAllCamelCased(css) {
		const output = {};
		const data = this._getData(css);

		for (const [key, val] of Object.entries(data)) {
			output[key.replace(/-\w/g, (match) => match[1].toUpperCase())] = val;
		}

		return output;
	}
}

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
