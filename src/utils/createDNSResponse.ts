import { DNSQuestion } from '../../types.ts'

export default function createDNSResponse(question: DNSQuestion, id: number | string = 18850) {
  return {
    id,
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
    questions: [{ name: question.name, type: question.type, class: question.class }],
    answers: [
      {
        name: question.name,
        type: question.type,
        ttl: 300,
        class: question.class,
        flush: false,
        data: "0.0.0.0"
      }
    ],
    authorities: [],
    additionals: []
  }
}