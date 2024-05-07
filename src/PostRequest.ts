import axios from 'npm:axios';
import { decode } from "npm:dnspacket-ts@1.0.9";
import config from '../config.ts';
import DomainBlacklistChecker from "./utils/DomainBlacklistChecker.ts";

export default async function PostRequest(request: Request) {
  const contentType = request.headers.get('content-type');

  if (!contentType) throw new Error('No Content-Type is specified');

  const arrayBuffer = await request.arrayBuffer();
  const question = decode(arrayBuffer).questions[0];

  if (config.useHosts && await DomainBlacklistChecker.fromFile(question.NAME)) {
    console.log('black listed', question.NAME);
    return new Response(null, { status: 200, headers: config.headers })
  }

  const rdr = await axios.post(config.upstream, arrayBuffer, {
    method: 'POST',
    headers: { 'Content-Type': 'application/dns-message' },
    responseType: 'arraybuffer'
  });

  return new Response(rdr.data, { status: 200, headers: config.headers });
}
