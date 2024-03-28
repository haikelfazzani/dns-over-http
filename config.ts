const config = {
  upstream: 'https://dns.cloudflare.com/dns-query',
  port: 3000,
  hostname: '127.0.0.1',
  headers: {
    'Content-Type': 'application/dns-message',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
    'Access-Control-Max-Age': 0 // in seconds
  // deno-lint-ignore no-explicit-any
  } as any
}

export default config