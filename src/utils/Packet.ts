import { Buffer } from "node:buffer";

export default class Packet {
  static encode(jsonPacket: any) {

    // DNS Header
    const header = Buffer.alloc(12);
    header.writeUInt16BE(jsonPacket.id || 0, 0); // ID
    let flags = 0;
    flags |= (jsonPacket.flag_qr || 0) << 15;
    flags |= (jsonPacket.opcode || 0) << 11;
    flags |= (jsonPacket.flag_aa || 0) << 10;
    flags |= (jsonPacket.flag_tc || 0) << 9;
    flags |= (jsonPacket.flag_rd || 0) << 8;
    flags |= (jsonPacket.flag_ra || 0) << 7;
    flags |= (jsonPacket.flag_z || 0) << 6;
    flags |= (jsonPacket.flag_ad || 0) << 5;
    flags |= (jsonPacket.flag_cd || 0) << 4;
    flags |= (jsonPacket.rcode || 0);

    header.writeUInt16BE(flags, 2); // Flags
    header.writeUInt16BE(jsonPacket.questions.length || 0, 4); // Question Count
    header.writeUInt16BE(0, 6); // Answer Record Count
    header.writeUInt16BE(0, 8); // Authority Record Count
    header.writeUInt16BE(0, 10); // Additional Record Count

    // DNS Question
    const q = jsonPacket.questions[0];
    const labels = q.name.split('.');
    const buffer = Buffer.alloc(labels.reduce((acc: any, label: any) => acc + 1 + label.length, 1));
    let offset = 0;
    labels.forEach((label: any) => {
      buffer.writeUInt8(label.length, offset++);
      buffer.write(label, offset, label.length, 'ascii');
      offset += label.length;
    });
    buffer.writeUInt8(0, offset); // Null terminator
    const qtype = Buffer.alloc(2);
    qtype.writeUInt16BE(this.getTypeCode(q.type), 0); // Get type code
    const qclass = Buffer.alloc(2);

    qclass.writeUInt16BE(this.getClassCode(q.class), 0); // Get class code
    const question = Buffer.concat([buffer, qtype, qclass]);

    // Concatenate header and question
    return Buffer.concat([header, question]);
  }

  private static getTypeCode(type: string) {
    const types: any = {
      'A': 1,
      'CNAME': 5,
      // Add more types as needed
    };
    return types[type] || 1;
  }

  private static getClassCode(clx: string) {
    const classes: any = {
      'IN': 1,
      'CH': 3,
      // Add more classes as needed
    };
    return classes[clx] || 1;
  }
}