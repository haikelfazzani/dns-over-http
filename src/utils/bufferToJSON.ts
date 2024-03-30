import { Buffer } from "node:buffer";
import dnsPacket from 'npm:dns-packet';
import { DNSPostQuery } from "../../types.ts";

export default // deno-lint-ignore no-explicit-any
  function bufferToJSON(dnsQuery: any, contentType: string | null): DNSPostQuery {
  if (contentType && contentType === 'application/dns-json') { return dnsQuery }

  const buffer = Buffer.from(dnsQuery);
  const str = buffer.toString().trim();
  const query = str.startsWith('{') ? JSON.parse(str) : dnsPacket.decode(buffer);
  query.questions = query.questions.slice(0, 1);
  return query
}