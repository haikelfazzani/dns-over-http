import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import bufferToJSON from "./src/utils/bufferToJSON.ts";

const dnsResponse = {
  id: 1,
  type: "response",
  flags: 384,
  flag_qr: true,
  opcode: "QUERY",
  flag_aa: false,
  flag_tc: false,
  flag_rd: true,
  flag_ra: true,
  flag_z: false,
  flag_ad: false,
  flag_cd: false,
  rcode: "NOERROR",
  questions: [ { name: "cloudflare.com", type: "A", class: "IN" } ],
  answers: [
    {
      name: "cloudflare.com",
      type: "A",
      ttl: 300,
      class: "IN",
      flush: false,
      data: "104.16.132.229"
    },
    {
      name: "cloudflare.com",
      type: "A",
      ttl: 300,
      class: "IN",
      flush: false,
      data: "104.16.133.229"
    }
  ],
  authorities: [],
  additionals: []
}

Deno.test(async function postResolve() {
  const query = {
    type: 'query',
    id: 1,
    flags: 256,
    questions: [
      { type: 'A', name: 'cloudflare.com' },
      { type: 'A', name: 'analytics.google.com' }
    ]
  };

  const data = JSON.stringify(query);
  const body = new TextEncoder().encode(data);

  const response = await fetch('http://localhost:3000', { method: 'POST', body })
  const buff = await response.arrayBuffer();

  assertEquals(dnsResponse, bufferToJSON(buff, null) as any);
});

// Deno.test(async function getResolve() {
//   const domainBase64 = btoa('cloudflare.com');

//   const response = await fetch('http://localhost:3000/dns-query?dns=' + domainBase64 + '&type=A')
//   const data = await response.arrayBuffer();

//   assertEquals(dnsResponse, bufferToJSON(data, null) as any);
// });
