import axios from 'npm:axios';
import dnsPacket from 'npm:dns-packet';
import config from '../config.ts';
import { Buffer } from "node:buffer";

/**
 * DNS query format { type: 'query', id: 1, flags: 256, questions: [{ type: 'A', name: 'google.com' }] }
 */

function formatQuery(arrayBuffer: ArrayBuffer) {
  const buffer = Buffer.from(arrayBuffer);
  try {
    return dnsPacket.encode(JSON.parse(buffer.toString('utf8').trim()))
  } catch (error) {
    console.log('formatQuery', error.message);
    return buffer
  }
}

export default async function PostRequest(request: Request) {
  // const contentType = request.headers.get('conent-type');
  // console.log('contentType ', contentType, request.headers);
  // console.log(request.url);

  try {
    const arrayBuffer = await request.arrayBuffer();

    if (!Buffer.isBuffer(formatQuery(arrayBuffer))) throw new Error('DNS query is not buffer')

    // if (contentType === 'application/dns-json') {

    // }

    const dnsResponse = await axios.post(config.upstream, formatQuery(arrayBuffer), {
      method: 'POST',
      headers: { 'Content-Type': 'application/dns-message' },
      responseType: 'arraybuffer'
    });

    const response = new Response(dnsResponse.data, {
      status: 200,
      headers: config.headers
    });

    return response
  } catch (error) {
    console.error('\nErr==>', error.message);

    return new Response(error.message, {
      status: 200,
      headers: config.headers
    })
  }
}