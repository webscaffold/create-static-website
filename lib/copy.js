import path from 'path';
import { promises as fsp } from 'fs';

import globby from 'globby';

export default function copy(config) {
	return {
		name: 'copy',
		async generateBundle(options, bundle) {
			for (const [glob, { stripPrefix, dest }] of Object.entries(config)) {
				const files = await globby(glob);
				for (const file of files) {
					if (!file.startsWith(stripPrefix)) {
						continue;
					}
					const fileName = path.join(dest, file.slice(stripPrefix.length));
					const source = await fsp.readFile(file);
					bundle[fileName] = { fileName, source, type: 'asset' };
				}
			}
		}
	};
}
