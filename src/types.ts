type DNSQuestion = {
  type: 'A',
  name: 'google.com'
}

export type DNSPostQuery = {
  type: 'query',
  id: 1,
  flags: 256,
  questions: DNSQuestion[]
}