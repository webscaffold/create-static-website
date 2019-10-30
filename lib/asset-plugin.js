import { readFileSync } from 'fs';
import { basename } from 'path';

const defaultOpts = {
	prefix: 'asset-url'
};

export default function assetPlugin(opts) {
	opts = Object.assign({}, defaultOpts, opts);
	const prefix = opts.prefix + ':';
	return {
		name: 'asset-plugin',
		async resolveId(id, importer) {
			if (!id.startsWith(prefix)) {
				return;
			}
			return prefix + (await this.resolveId(id.slice(prefix.length), importer));
		},
		load(id) {
			if (!id.startsWith(prefix)) {
				return;
			}
			const assetId = this.emitAsset(basename(id), readFileSync(id.slice(prefix.length)));
			return `export default import.meta.ROLLUP_ASSET_URL_${assetId}`;
		}
	};
}
