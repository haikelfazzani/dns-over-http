import axios from 'npm:axios';
import dnsPacket from 'npm:dns-packet';
import config from '../config.ts';
import createDNSResponse from './utils/createDNSResponse.ts'
import DomainBlacklistChecker from "./utils/DomainBlacklistChecker.ts";

const isBase64 = (str: string) => /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);

export default async function GetRequest(request: Request) {
  const url = new URL(request.url);
  const queryName = url.searchParams.get('dns')!;
  const queryType = url.searchParams.get('type');
  const qName = isBase64(queryName) ? atob(queryName) : queryName;

  if (config.useHosts && await DomainBlacklistChecker.fromStream(qName)) {
    console.log('is black listed', qName);
    return new Response(dnsPacket.encode(createDNSResponse({name:qName, type:queryType || 'A', class:"IN"})), { status: 200, headers: config.headers })
  }

  const query = dnsPacket.encode({
    type: 'query',
    id: Math.floor(Math.random() * 65535),
    flags: dnsPacket.RECURSION_DESIRED, questions: [{ type: queryType || 'A', name: qName }]
  });

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