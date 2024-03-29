import config from "./config.ts";
import GetRequest from "./src/GetRequest.ts";
import PostRequest from "./src/PostRequest.ts";

const validRequestPaths = ['/', '/dns-query'];

const options: Deno.ServeOptions | Deno.ServeTlsOptions = {
  // key: Deno.readTextFileSync(Deno.cwd() + '/cert/key.pem'),
  // cert: Deno.readTextFileSync(Deno.cwd() + '/cert/cert.pem'),

  port: config.port,
  hostname: config.hostname
}
console.log(Deno.env.has('DENO_ENV'))
Deno.serve(options, handler);

async function handler(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    if (!validRequestPaths.some(v => v.includes(url.pathname))) throw new Error('Invalid pathname');

    return request.method === 'GET' ? GetRequest(request) : PostRequest(request);
  } catch (error) {
    console.error('\nErr==>', error.message);
    return new Response(error.message, { status: 400, headers: config.headers })
  }
}
