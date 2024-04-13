import { DNSQuestion } from '../../types.ts'

export default function createDNSResponse(question: DNSQuestion, id: number = 0) {
  return {
    id: id,
    flags: {
      QR: "RESPONSE",
      Opcode: 0,
      AA: 0,
      TC: 0,
      RD: 1,
      RA: 1,
      Z: 0,
      RCODE: 'NOERROR'
    },
    questions: [ { CLASS: question.class, NAME: question.name, TYPE: question.type } ],

  }
  
}