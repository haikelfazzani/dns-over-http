import config from "../../config.ts";

export default class DomainBlacklistChecker {
  static async fromStream(qName: string) {
    const data = await fetch(config.BLOCKLIST_URL, { headers: { 'Cache-Control': 'max-age=3600' } });
    const domainsTxt = await data.text();
    const domains = domainsTxt.replace(/^#.*\n/gm, "").trim().split(/\n|\r\n/gm).filter(k => k);
    return domains.some(v => new RegExp(v.replace('*.', '.*'), 'gi').test(qName))
  }

  static async fromFile(qName: string) {
    const text = await Deno.readTextFile(Deno.cwd() + "/hosts");
    const domains = text.replace(/^#.*\n/gm, "").trim().split(/\n|\r\n/gm).filter(k => k);
    return domains.some(v => new RegExp(v.replace('*.', '.*'), 'gi').test(qName))
  }
}