import axios from 'npm:axios';
import dnsPacket from 'npm:dns-packet';
import config from '../config.ts';
import { Buffer } from "node:buffer";
import isDomainBlocked from "./utils/isDomainBlocked.ts";
import { DNSPostQuery } from "./types.ts";
import dnsResponse from './utils/dnsResponse.ts'

/**
 * DNS query format { type: 'query', id: 1, flags: 256, questions: [{ type: 'A', name: 'google.com' }] }
 */

// deno-lint-ignore no-explicit-any
function bufferToJSON(dnsQuery: any, contentType: string | null): DNSPostQuery {
  if (contentType && contentType === 'application/dns-json') { return dnsQuery }

  const buffer = Buffer.from(dnsQuery);
  const str = buffer.toString();
  return str.startsWith('{') ? JSON.parse(str) : dnsPacket.decode(buffer)
}

export default async function PostRequest(request: Request) {
  const contentType = request.headers.get('content-type');

  // if (!contentType) throw new Error('No Content-Type is specified');

  const arrayBuffer = await request.arrayBuffer();
  const dnsJSON = bufferToJSON(arrayBuffer, contentType);

  for (let i = 0; i < dnsJSON.questions.length; i++) {
    const question = dnsJSON.questions[i];

    if (config.useHosts && await isDomainBlocked(question.name)) {
      console.log('is black listed', question.name);
      return new Response(dnsPacket.encode(dnsResponse(question.name, question.type || 'A')), { status: 200, headers: config.headers })
    }
  }

  const buffer = dnsPacket.encode(dnsJSON);

  if (!Buffer.isBuffer(buffer)) throw new Error('DNS query is not buffer');

  const rdr = await axios.post(config.upstream, buffer, {
    method: 'POST',
    headers: { 'Content-Type': 'application/dns-message' },
    responseType: 'arraybuffer'
  });

  return new Response(rdr.data, { status: 200, headers: config.headers });
}