import axios from 'npm:axios';
import dnsPacket from 'npm:dns-packet';
import config from '../config.ts';
import { Buffer } from "node:buffer";
import isDomainBlocked from "./utils/isDomainBlocked.ts";
import bufferToJSON from "./utils/bufferToJSON.ts";

/**
 * DNS query format { type: 'query', id: 1, flags: 256, questions: [{ type: 'A', name: 'google.com' }] }
 */

export default async function PostRequest(request: Request) {
  const contentType = request.headers.get('content-type');
  const blackList = [];

  // if (!contentType) throw new Error('No Content-Type is specified');

  const arrayBuffer = await request.arrayBuffer();
  const dnsJSON = bufferToJSON(arrayBuffer, contentType);
  const questions = dnsJSON.questions;

  // must add 0.0.0.0 to each black listed questions as data
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    if (config.useHosts && await isDomainBlocked(question.name)) {
      console.log('is black listed', question.name);
      blackList.push(question);
      // return new Response(dnsPacket.encode(dnsResponse(question.name, question.type || 'A')), { status: 200, headers: config.headers })
    }
  }

  const buffer = dnsPacket.encode(dnsJSON);

  if (!Buffer.isBuffer(buffer)) throw new Error('DNS query is not buffer');

  const rdr = await axios.post(config.upstream, buffer, {
    method: 'POST',
    headers: { 'Content-Type': 'application/dns-message' },
    responseType: 'arraybuffer'
  });

  const response =dnsPacket.decode(rdr.data);
  console.log(response.questions);

  return new Response(rdr.data, { status: 200, headers: config.headers });
}