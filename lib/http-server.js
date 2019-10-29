import { promisify } from 'util';
import findFreePort from 'find-free-port';
import express from 'express';

const findFreePortP = promisify(findFreePort);

export default async function() {
	const app = express();
	app.use((req, res, next) => {
		res.set('Cache-Control', 'no-cache');
		next();
	});
	app.use(express.static('build'));
	const port = await findFreePortP(8080);
	app.listen(port);
	console.log(`Listening on localhost:${port}`);
}
