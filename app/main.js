import Controller from './controller/controller.js';

document.addEventListener('DOMContentLoaded', () => {
	let deferredPrompt;
	let newWorker;
	let reload = false;
	let controller = new Controller();

	document.getElementById('btnUpdate').addEventListener('click', () => {
		reload = true;

		newWorker.postMessage({ action: 'skipWaiting' });
	});

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register(
			'/webgl_tetrisball/sw.js', { scope: '/webgl_tetrisball/' }
		).then(registration => {
			// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);

			registration.addEventListener('updatefound', () => {
				newWorker = registration.installing;

				newWorker.addEventListener('statechange', () => {
					switch (newWorker.state) {
						case 'installed': {
							// There is a new service worker available, show the notification
							if (navigator.serviceWorker.controller) {
								let banner = document.getElementById('updateAppBanner');

								banner.style.display = 'block';
							}
						} break;

						case 'activated': {
							if (!reload) {
								return;
							}

							window.location.reload();
						} break;
					}
				});
			});
		}).catch(e => {
			// Registration failed
			console.log('ServiceWorker registration failed: ', e);
		});
	}

	window.addEventListener('beforeinstallprompt', (event) => {
		// Prevent Chrome 67 and earlier from automatically showing the prompt
		event.preventDefault();

		if (document.cookie.indexOf('tetrisball_installApp') === -1) {
			let banner = document.getElementById('installAppBanner');

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
				let cookie = '';
				let date = new Date();
				let iso = date.toISOString();
				let sec = 30 * 24 * 60 * 60;

				date.setTime(date.getTime() + (sec * 1000));

				cookie  = 'tetrisball_installApp=' + iso + ';';
				cookie += 'path=/;';
				cookie += 'max-age=' + sec + ';';
				cookie += 'expires=' + date.toUTCString() + ';';

				if (location.protocol === 'https:') {
					cookie += 'secure;';
				}

				document.cookie = cookie;

				banner.style.display = 'none';

				deferredPrompt = null;
			});
		}
	});
});
