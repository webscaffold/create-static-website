/**
 * This pluings runs `buildStartSequence` function for all plugins that have it and are loaded via rollup
 *
 * @export {Funciton} Plugin function
 * @returns {Object} Rollup plugin object
 */
export default function buildStartSequencePlugin() {
	return {
		name: 'build-start-sequence-plugin',
		async buildStart(options, ...args) {
			for (const plugin of options.plugins) {
				if (plugin.buildStartSequence) {
					await plugin.buildStartSequence.call(this, options, ...args);
				}
			}
		}
	};
}
