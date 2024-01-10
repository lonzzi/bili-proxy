import { whitelist } from './config';

const handler: ExportedHandler = {
	async fetch(request) {
		let API_URL = '';

		const requestOrigin = request.headers.get('origin') || '';
		const urlObj = new URL(request.url);

		const apiUrl = request.url.replace(urlObj.origin, '').slice(1);

		if (apiUrl) {
			API_URL = apiUrl;
		}

		if (apiUrl.startsWith('http:/') && !apiUrl.startsWith('http://')) {
			API_URL = apiUrl.replace('http:/', 'http://');
		} else if (apiUrl.startsWith('https:/') && !apiUrl.startsWith('https://')) {
			API_URL = apiUrl.replace('https:/', 'https://');
		}

		const DEMO_PAGE = `
		<!DOCTYPE html>
		<html>
		<body>
			<h1>Bili Proxy</h1>
		</body>
		</html>
	`;

		const handleRequest = async (url: string) => {
			try {
				new URL(url);
			} catch (err) {
				return new Response('Invalid URL', {
					status: 400,
					statusText: 'Bad Request',
				});
			}

			request = new Request(url, request);
			request.headers.set('Origin', 'https://www.bilibili.com');
			request.headers.set('Referer', 'https://www.bilibili.com');

			let response = await fetch(request);
			response = new Response(response.body, response);

			response.headers.set('Access-Control-Allow-Origin', requestOrigin || '*');
			response.headers.set('Referrer-Policy', 'no-referrer');
			response.headers.set('Access-Control-Allow-Credentials', 'true');

			return response;
		};

		if (API_URL && API_URL !== 'favicon.ico') {
			try {
				if (requestOrigin && !whitelist.includes(requestOrigin)) {
					return new Response('Not allowed', {
						status: 403,
						statusText: 'Forbidden',
					});
				}
			} catch (err) {
				return new Response("Haven't set the whitelist config", {
					status: 500,
					statusText: 'Internal Server Error',
				});
			}

			return handleRequest(API_URL);
		} else {
			return new Response(DEMO_PAGE, {
				headers: {
					'content-type': 'text/html;charset=UTF-8',
				},
			});
		}
	},
};

export default handler;
