import axios from 'npm:axios';
import { encode } from "npm:dnspacket-ts@1.0.9";
import config from '../config.ts';
// import createDNSResponse from './utils/createDNSResponse.ts'
import DomainBlacklistChecker from "./utils/DomainBlacklistChecker.ts";

const isBase64 = (str: string) => /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);

export default async function GetRequest(request: Request) {
  const url = new URL(request.url);
  const queryName = url.searchParams.get('dns')!;
  // deno-lint-ignore no-explicit-any
  const queryType = url.searchParams.get('type') as any;
  const qName = isBase64(queryName) ? atob(queryName) : queryName;

  if (config.useHosts && await DomainBlacklistChecker.fromStream(qName)) {
    console.log('is black listed', qName);
    // const response = createDNSResponse({ name: qName, type: queryType || 'A', class: "IN" });
    return new Response(null, { status: 200, headers: config.headers })
  }

  const query = encode({
    id: 153,
    flags: {
      RD: 1,
    },
    questions: [
      { CLASS: "IN", NAME: qName, TYPE: queryType || 'A'},
    ],
  })

  const rdr = await axios.post(config.upstream, query, {
    method: 'POST',
    headers: { 'Content-Type': 'application/dns-message' },
    responseType: 'arraybuffer'
  });

  return new Response(rdr.data, {
    status: 200,
    headers: config.headers
  })
}