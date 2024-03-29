type DNSQuestion = {
  type: 'A',
  name: 'google.com'
}

export type DNSPostQuery = {
  id: 1,
  type: "query",
  flags: 256,
  flag_qr: boolean,
  opcode: "QUERY",
  flag_aa: boolean,
  flag_tc: boolean,
  flag_rd: boolean,
  flag_ra: boolean,
  flag_z: boolean,
  flag_ad: boolean,
  flag_cd: boolean,
  rcode: "NOERROR",
  questions: DNSQuestion[],
  answers: [],
  authorities: [],
  additionals: []
}