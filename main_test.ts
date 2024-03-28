import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test(async function addTest() {
  const result = await Deno.resolveDns('google.com', 'A', { nameServer: { ipAddr: '127.0.0.1', port: 5053 } });

  console.log(result);
  
  assertEquals(result, []);
});
