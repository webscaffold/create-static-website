import { promises as fsp } from 'fs';

import { terser } from 'rollup-plugin-terser';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import htmlCSSPlugin from './lib/html-css-plugin.js';
import postCSSBuild from './lib/postcss-build.js';
import eleventyPlugin from './lib/11ty-plugin.js';
import globInputPlugin from './lib/glob-input-plugin';
import httpServer from './lib/http-server';
import buildStartSequencePlugin from './lib/build-start-sequence-plugin';
import classnamePlugin from './lib/classname-plugin';
import assetPlugin from './lib/asset-plugin';
import swPlugin from './lib/sw-plugin';

const siteConfig = require('./site.config.js');

export default async function({ watch }) {
	await Promise.all([postCSSBuild('src/**/*.css', '.build-tmp', { watch })]);
	if (watch) {
		httpServer();
	}

	return {
		input: {
			'nuke-sw': 'src/nuke-sw.js',
			sw: 'src/sw.js',
		},
		output: {
			dir: 'build' + siteConfig.path,
			format: 'esm',
			assetFileNames: '[name]-[hash][extname]'
		},
		watch: {
			clearScreen: false,
			// Avoid watching intermediate files, else watch gets stuck in a loop.
			// 11ty source files are watched by eleventyPlugin.
			exclude: '.build-tmp/**/*.html'
		},
		plugins: [
			nodeResolve(),
			commonjs(),
			{
				resolveFileUrl({ fileName }) {
					return JSON.stringify(siteConfig.path + fileName);
				}
			},
			buildStartSequencePlugin(),
			eleventyPlugin(),
			globInputPlugin('.build-tmp/**/*.html'),
			htmlCSSPlugin(),
			assetPlugin(),
			classnamePlugin('.build-tmp'),
			terser({ ecma: 8, module: true }),
			swPlugin(),
			{
				// This is a dirty hack to copy /devsummit/404.html to /404.html, which is where
				// Firebase hosting will look for the 404 page.
				async writeBundle(bundle) {
					const notFound = Object.values(bundle).find((entry) => entry.fileName.endsWith('404.html'));
					await fsp.writeFile('build/404.html', notFound.code);
				}
			}
		]
	};
}
