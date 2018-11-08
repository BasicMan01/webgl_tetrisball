import Controller from './controller/controller.js';

document.addEventListener('DOMContentLoaded', () => {
	let deferredPrompt;
	let controller = new Controller();

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register(
			'/webgl_tetrisball/sw.js', { scope: '/webgl_tetrisball/' }
		).then(registration => {
			// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}).catch(e => {
			// registration failed
			console.log('ServiceWorker registration failed: ', e);
		});
	}

	window.addEventListener('beforeinstallprompt', (e) => {
		// Prevent Chrome 67 and earlier from automatically showing the prompt
		e.preventDefault();

		// Stash the event so it can be triggered later.
		deferredPrompt = e;
	});
});
