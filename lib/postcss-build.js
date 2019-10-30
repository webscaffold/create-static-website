import { spawn } from 'child_process';

export default async function postCSSBuild(inGlob, outPath, { watch } = {}) {
	const firstDir = inGlob.split('/')[0];
	const opts = [inGlob, '--dir', outPath, '--base', firstDir];
	const proc = spawn('postcss', opts, { stdio: 'inherit' });

	await new Promise((resolve) => {
		proc.on('exit', (code) => {
			if (code !== 0) throw Error('postCSS build failed');
			resolve();
		});
	});

	if (watch) {
		spawn('postcss', [...opts, '--watch'], { stdio: 'inherit' });
	}
}
