export default {
  async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    const url = new URL(request.url);

    // Serve assets from the dist directory
    const response = await env.ASSETS.fetch(request);

    // Add CORS header for giscus theme CSS
    if (url.pathname === '/giscus-theme.css') {
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Access-Control-Allow-Origin', 'https://giscus.app');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    return response;
  },
};
