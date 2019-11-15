if (self instanceof ServiceWorkerGlobalScope) {
	addEventListener('install', () => {
		skipWaiting();
	});
	addEventListener('activate', async () => {
		await self.registration.unregister();
		const allClients = await clients.matchAll({
			includeUncontrolled: true
		});
		for (const client of allClients) client.navigate('/');
	});
}
