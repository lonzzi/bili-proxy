const handler: ExportedHandler = {
	async fetch(request) {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
			'Access-Control-Max-Age': '86400',
		};

		let API_URL = '';

		const apiUrlObj = new URL(request.url);
		const apiUrl = request.url.replace(apiUrlObj.origin, '').slice(1);

		if (apiUrl) {
			API_URL = apiUrl;
		}

		if (apiUrl.startsWith('http:/') && !apiUrl.startsWith('http://')) {
			API_URL = apiUrl.replace('http:/', 'http://');
		} else if (apiUrl.startsWith('https:/') && !apiUrl.startsWith('https://')) {
			API_URL = apiUrl.replace('https:/', 'https://');
		}

		// console.log(API_URL);

		const DEMO_PAGE = `
		<!DOCTYPE html>
		<html>
		<body>
			<h1>Bili Proxy</h1>
		</body>
		</html>
	`;

		const handleRequest = async (url: string) => {
			const headers = {
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
				Referer: 'https://www.bilibili.com',
			};

			request = new Request(url, {
				method: request.method,
				headers,
			});

			let response = await fetch(request);
			response = new Response(response.body, response);

			response.headers.set('Access-Control-Allow-Origin', '*');
			response.headers.set('Referrer-Policy', 'no-referrer');

			return response;
		};

		if (API_URL && API_URL !== 'favicon.ico') {
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
