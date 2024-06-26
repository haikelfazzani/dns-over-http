import config from "./config.ts";
import GetRequest from "./src/GetRequest.ts";
import PostRequest from "./src/PostRequest.ts";
import RateLimit from "./src/utils/RateLimit.ts";

const validRequestPaths = ['/', '/dns-query'];

const options: Deno.ServeOptions | Deno.ServeTlsOptions = {
  // key: Deno.readTextFileSync(Deno.cwd() + '/cert/key.pem'),
  // cert: Deno.readTextFileSync(Deno.cwd() + '/cert/cert.pem'),

  port: config.port,
  hostname: config.hostname
}

Deno.serve(options, handler);

async function handler(request: Request, info: Deno.ServeHandlerInfo): Promise<Response> {
  try {
    if(RateLimit(info.remoteAddr)) {
      return new Response("Rate limit exceeded", { status: 429 })
    }

    const url = new URL(request.url);
    if (!validRequestPaths.some(v => v.includes(url.pathname))) throw new Error('Invalid pathname');

    return request.method === 'GET' ? await GetRequest(request) : await PostRequest(request);
  } catch (error) {
    console.error('\nErr==>', error.message);
    return new Response(error.message, { status: 400, headers: config.headers })
  }
}
