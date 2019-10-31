const fs = require('fs');

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

module.exports = ModularClassName;
