const config = {
  upstream: 'https://cloudflare-dns.com/dns-query',
  port: 3000,
  hostname: '127.0.0.1',
  headers: {
    'Content-Type': 'application/dns-message',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Accept, Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
    'Access-Control-Max-Age': 0 // in seconds
    // deno-lint-ignore no-explicit-any
  } as any,

  useHosts: true,

  BLOCKLIST_URL: 'https://raw.githubusercontent.com/badmojr/1Hosts/86459557efef855f6f56569589c144ce82c708c9/Lite/wildcards.txt'
}

export default config