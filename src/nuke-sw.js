async function run() {
	// Is this actually being executed in a ServiceWorker?
	if (!(self instanceof ServiceWorkerGlobalScope)) {
		return;
	}
	// Nuke the service worker.
	await self.registration.unregister();

	// Reload all open pages.
	clients.matchAll({ includeUncontrolled: true }).then((clients) => {
		clients.forEach((client) => client.navigate('/'));
	});
}
run();
