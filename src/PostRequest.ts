import axios from 'npm:axios';
import { decode } from "npm:dnspacket-ts";
import config from '../config.ts';
import DomainBlacklistChecker from "./utils/DomainBlacklistChecker.ts";
import bufferToJSON from "./utils/bufferToJSON.ts";

export default async function PostRequest(request: Request) {
  const contentType = request.headers.get('content-type');

  // if (!contentType) throw new Error('No Content-Type is specified');

  const arrayBuffer = await request.arrayBuffer();
  const dnsJSON = bufferToJSON(arrayBuffer, contentType);
  const question = dnsJSON.questions[0];

  if (config.useHosts && await DomainBlacklistChecker.fromStream(question.name)) {
    console.log('black listed', question.name);
    return new Response(null, { status: 200, headers: config.headers })
  }

  console.log(arrayBuffer);
  
  const json = decode(arrayBuffer);
  console.log(json);

  const rdr = await axios.post(config.upstream, arrayBuffer, {
    method: 'POST',
    headers: { 'Content-Type': 'application/dns-message' },
    responseType: 'arraybuffer'
  });

  return new Response(rdr.data, { status: 200, headers: config.headers });
}
