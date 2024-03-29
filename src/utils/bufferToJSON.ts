import { Buffer } from "node:buffer";
import dnsPacket from 'npm:dns-packet';
import { DNSPostQuery } from "../../types.ts";

export default // deno-lint-ignore no-explicit-any
function bufferToJSON(dnsQuery: any, contentType: string | null): DNSPostQuery {
  if (contentType && contentType === 'application/dns-json') { return dnsQuery }

  const buffer = Buffer.from(dnsQuery);
  const str = buffer.toString().trim();
  return str.startsWith('{') ? JSON.parse(str) : dnsPacket.decode(buffer)
}