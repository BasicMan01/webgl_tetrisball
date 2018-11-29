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
			// Registration failed
			console.log('ServiceWorker registration failed: ', e);
		});
	}

	window.addEventListener('beforeinstallprompt', (event) => {
		let banner = document.getElementById('installAppBanner');
		
		// Prevent Chrome 67 and earlier from automatically showing the prompt
		event.preventDefault();

		// Stash the event so it can be triggered later.
		deferredPrompt = event;

		banner.style.display = 'block';
		
		document.getElementById('btnAccept').addEventListener('click', (event) => {
			banner.style.display = 'none';

			// Show the prompt
			deferredPrompt.prompt();

			// Wait for the user to respond to the prompt
			deferredPrompt.userChoice.then((choiceResult) => {
				deferredPrompt = null;
			});
		});
		
		document.getElementById('btnDecline').addEventListener('click', (event) => {
			banner.style.display = 'none';
			
			deferredPrompt = null;
		});
	});
});
