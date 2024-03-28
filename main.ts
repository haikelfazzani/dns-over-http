import config from "./config.ts";
import GetRequest from "./src/GetRequest.ts";
import PostRequest from "./src/PostRequest.ts";

const options: Deno.ServeOptions | Deno.ServeTlsOptions = {
  // key: Deno.readTextFileSync(Deno.cwd() + '/cert/key.pem'),
  // cert: Deno.readTextFileSync(Deno.cwd() + '/cert/cert.pem'),

  port: config.port,
  hostname: config.hostname
}

Deno.serve(options, handler);

async function handler(request: Request): Promise<Response> {
  if (request.method === 'GET') {
    return await GetRequest(request)
  }

  return await PostRequest(request)
}
