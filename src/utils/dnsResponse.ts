export default function dnsResponse(qName: string, qType: string) {
  return {
    id: 18850,
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
    questions: [{ name: qName, type: "A", class: "IN" }],
    answers: [
      {
        name: qName,
        type: qType,
        ttl: 300,
        class: "IN",
        flush: false,
        data: "0.0.0.0"
      }
    ],
    authorities: [],
    additionals: []
  }
}