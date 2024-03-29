import config from "../../config.ts";

export default async function isDomainBlocked(qName: string) {
  const data = await fetch(config.BLOCKLIST_URL, { headers: { 'Cache-Control': 'max-age=3600' } });
  const domainsTxt = await data.text();
  const domains = domainsTxt.replace(/^#.*\n/gm, "").split(/\n|\r\n/gm).filter(k => k).map(v => v.trim().split(' ')[1]);
  return domains.some(v => v === qName)
}