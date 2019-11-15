const resourceListMarker = 'SW_ASSET_LIST';

export default function swPlugin() {
	const prefix = 'sw-assets:';

	return {
		name: 'sw-plugin',
		generateBundle(_outputOptions, bundle) {
			const resourceListJSON = JSON.stringify(
				Object.values(bundle)
					.map((v) => '/' + v.fileName)
					.map((v) => v.replace(/index\.html$/, ''))
					.filter((v) => !v.endsWith('.css'))
					.filter((v) => !v.endsWith('.ics'))
			);

			for (const item of Object.values(bundle)) {
				if (!item.code) continue;
				item.code = item.code.replace(resourceListMarker, resourceListJSON);
			}
		}
	};
}
