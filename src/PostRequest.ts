import axios from 'npm:axios';
import dnsPacket from 'npm:dns-packet';
import config from '../config.ts';
import { Buffer } from "node:buffer";
import DomainBlacklistChecker from "./utils/DomainBlacklistChecker.ts";
import bufferToJSON from "./utils/bufferToJSON.ts";
import createDNSResponse from "./utils/createDNSResponse.ts";

/**
 * DNS query format { type: 'query', id: 1, flags: 256, questions: [{ type: 'A', name: 'google.com' }] }
 */

export default async function PostRequest(request: Request) {
  const contentType = request.headers.get('content-type');

  // if (!contentType) throw new Error('No Content-Type is specified');

  const arrayBuffer = await request.arrayBuffer();
  const dnsJSON = bufferToJSON(arrayBuffer, contentType);
  const question = dnsJSON.questions[0];

  if (config.useHosts && await DomainBlacklistChecker.fromStream(question.name)) {
    console.log('black listed', question.name);
    return new Response(dnsPacket.encode(createDNSResponse(question, dnsJSON.id)), { status: 200, headers: config.headers })
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
