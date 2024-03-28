import axios from 'npm:axios';
import dnsPacket from 'npm:dns-packet';
import config from '../config.ts';

export default async function GetRequest(request: Request) {

  console.log('get', request.url);
  

  const url = new URL(request.url)
  const queryName = url.searchParams.get('dns');
  const queryType = url.searchParams.get('type');

  const query = { type: 'query', id: 1, flags: dnsPacket.RECURSION_DESIRED, questions: [{ type: queryType || 'A', name: queryName }] }

  const dnsResponse = await axios.post(config.upstream, dnsPacket.encode(query), {
    method: 'POST',
    headers: { 'Content-Type': 'application/dns-message' },
    responseType: 'arraybuffer'
  });

  return new Response("dnsResponse.data", {
    status: 200,
    headers: config.headers
  })
}