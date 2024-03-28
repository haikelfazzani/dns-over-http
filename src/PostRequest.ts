import axios from 'npm:axios';
import dnsPacket from 'npm:dns-packet';
import config from '../config.ts';

/**
 * DNS query format { type: 'query', id: 1, flags: 256, questions: [{ type: 'A', name: 'google.com' }] }
 */

export default async function PostRequest(request: Request) {
  // const contentType = request.headers.get('conent-type');
  // console.log('contentType ', contentType, request.headers);
  console.log(request.url);
  
  try {
    const body = await request.arrayBuffer();
  
    // const queryText = new TextDecoder().decode(body).trim();
    console.log('\n\n', new TextDecoder().decode(body));
    
    // const queryJSon = JSON.parse(queryText);
  
    // if (contentType === 'application/dns-json') {
  
    // }
  
    const dnsResponse = await axios.post(config.upstream, dnsPacket.encode(body), {
      method: 'POST',
      headers: { 'Content-Type': 'application/dns-message' },
      responseType: 'arraybuffer'
    });
  
    return new Response(dnsResponse.data, {
      status: 200,
      headers: config.headers
    })
  } catch (error) {
    console.error(error.message);
    
    return new Response(error.message, {
      status: 200,
      headers: config.headers
    })
  }
}