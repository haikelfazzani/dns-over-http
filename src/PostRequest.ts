import axios from 'npm:axios';
import dnsPacket from 'npm:dns-packet';
import config from '../config.ts';
import { Buffer } from "node:buffer";

/**
 * DNS query format { type: 'query', id: 1, flags: 256, questions: [{ type: 'A', name: 'google.com' }] }
 */

// deno-lint-ignore no-explicit-any
function formatQuery(dnsQuery: any, contentType: string | null) {
  if (contentType && contentType === 'application/dns-json') { return dnsPacket.encode(dnsQuery) }

  const buffer = Buffer.from(dnsQuery);
  const str = buffer.toString();
  return str.startsWith('{') ? dnsPacket.encode(JSON.parse(str)) : buffer
}

export default async function PostRequest(request: Request) {
  const contentType = request.headers.get('content-type');

  if (!contentType) throw new Error('No Content-Type is specified');

  const arrayBuffer = await request.arrayBuffer();
  const buffer = formatQuery(arrayBuffer, contentType);

  if (!Buffer.isBuffer(buffer)) throw new Error('DNS query is not buffer');

  const dnsResponse = await axios.post(config.upstream, buffer, {
    method: 'POST',
    headers: { 'Content-Type': 'application/dns-message' },
    responseType: 'arraybuffer'
  });

  return new Response(dnsResponse.data, { status: 200, headers: config.headers });
}