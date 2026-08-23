interface Env {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      if (env.ASSETS) {
        const response = await env.ASSETS.fetch(request);
        if (response.status !== 404) {
          return response;
        }
      }

      return new Response('Skyrellac Platform Online', {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    } catch (err: any) {
      return new Response(`Worker Server Error: ${err.message}`, { status: 500 });
    }
  },
};
