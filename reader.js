const constants = require('./constants')

class Reader {
    constructor (buffer, endianness = constants.LITTLE_ENDIAN) {
        if (!buffer) throw new Error('A buffer is required');
        if (endianness !== constants.LITTLE_ENDIAN && endianness !== constants.BIG_ENDIAN) throw new Error(`Bad endianness type ${endianness}`);

        this.buffer = Buffer.from(buffer)
        this.endianness = endianness;
        this.pos = 0;
    }

    seek(pos) {
        this.pos = pos;
    }

    peek() {
        return this.pos;
    }

    read(size) {
        let buf = this.buffer.slice(this.pos, this.pos + size)
        this.pos += size;

        return buf;
    }

    utf8(size) {
        let str = this.buffer.slice(this.pos, this.pos + size).toString('utf-8')
        this.pos += size;

        return str;
    }

    cstr() {
        let size = this.buffer.indexOf(0x00, this.pos)
        let str = this.buffer.slice(this.pos, this.pos + size).slice(0, -1).toString('utf-8')

        this.pos += size;

        return str;
    }

    u(size, endianness = this.endianness) {
        let value;
        if (endianness === constants.LITTLE_ENDIAN) {
            value = this.buffer.readUIntLE(this.pos, size)
        } else if (endianness === constants.BIG_ENDIAN) {
            value = this.buffer.readUIntBE(this.pos, size)
        }

        this.pos += size;

        return value;
    }

    i(size, endianness = this.endianness) {
        let value;
        if (endianness === constants.LITTLE_ENDIAN) {
            value = this.buffer.readIntLE(this.pos, size)
        } else if (endianness === constants.BIG_ENDIAN) {
            value = this.buffer.readIntBE(this.pos, size)
        }

        this.pos += size;

        return value;
    }

    u8() {
        let value = this.buffer.readUInt8(this.pos)
        this.pos += 1;
        return value;
    }

    u16(endianness = this.endianness) {
        return this.u(2, endianness);
    }

    u24(endianness = this.endianness) {
        return this.u(3, endianness);
    }

    u32(endianness = this.endianness) {
        return this.u(4, endianness);
    }

    u40(endianness = this.endianness) {
        return this.u(5, endianness);
    }

    u48(endianness = this.endianness) {
        return this.u(6, endianness);
    }

    u56(endianness = this.endianness) {
        let value;
        if (endianness === constants.LITTLE_ENDIAN) {
            value =
                (BigInt(this.buffer[this.pos])) |
                (BigInt(this.buffer[this.pos + 1]) << 8n) |
                (BigInt(this.buffer[this.pos + 2]) << 16n) |
                (BigInt(this.buffer[this.pos + 3]) << 24n) |
                (BigInt(this.buffer[this.pos + 4]) << 32n) |
                (BigInt(this.buffer[this.pos + 5]) << 40n) |
                (BigInt(this.buffer[this.pos + 6]) << 48n)
        } else if (endianness === constants.BIG_ENDIAN) {
            value =
                (BigInt(this.buffer[this.pos]) << 48n) |
                (BigInt(this.buffer[this.pos + 1]) << 40n) |
                (BigInt(this.buffer[this.pos + 2]) << 32n) |
                (BigInt(this.buffer[this.pos + 3]) << 24n) |
                (BigInt(this.buffer[this.pos + 4]) << 16n) |
                (BigInt(this.buffer[this.pos + 5]) << 8n) |
                (BigInt(this.buffer[this.pos + 6]))
        }

        this.pos += 7;

        return value;
    }

    u64(endianness = this.endianness) {
        let value;
        if (endianness === constants.LITTLE_ENDIAN) {
            value = this.buffer.readBigUInt64LE(this.pos)
        } else if (endianness === constants.BIG_ENDIAN) {
            value = this.buffer.readBigUInt64BE(this.pos)
        }

        this.pos += 8;

        return value;
    }

    i8() {
        let value = this.buffer.readInt8(this.pos)
        this.pos += 1;
        return value;
    }

    i16(endianness = this.endianness) {
        return this.i(2, endianness);
    }

    i24(endianness = this.endianness) {
        return this.i(3, endianness);
    }

    i32(endianness = this.endianness) {
        return this.i(4, endianness);
    }

    i40(endianness = this.endianness) {
        return this.i(5, endianness);
    }

    i48(endianness = this.endianness) {
        return this.i(6, endianness);
    }

    i56(endianness = this.endianness) {
        let value;
        if (endianness === constants.LITTLE_ENDIAN) {
            value =
                (BigInt(this.buffer[this.pos])) |
                (BigInt(this.buffer[this.pos + 1]) << 8n) |
                (BigInt(this.buffer[this.pos + 2]) << 16n) |
                (BigInt(this.buffer[this.pos + 3]) << 24n) |
                (BigInt(this.buffer[this.pos + 4]) << 32n) |
                (BigInt(this.buffer[this.pos + 5]) << 40n) |
                (BigInt(this.buffer[this.pos + 6]) << 48n)
        } else if (endianness === constants.BIG_ENDIAN) {
            value =
                (BigInt(this.buffer[this.pos]) << 48n) |
                (BigInt(this.buffer[this.pos + 1]) << 40n) |
                (BigInt(this.buffer[this.pos + 2]) << 32n) |
                (BigInt(this.buffer[this.pos + 3]) << 24n) |
                (BigInt(this.buffer[this.pos + 4]) << 16n) |
                (BigInt(this.buffer[this.pos + 5]) << 8n) |
                (BigInt(this.buffer[this.pos + 6]))
        }

        value = BigInt.asIntN(56, value)

        this.pos += 7;

        return value;
    }

    i64(endianness = this.endianness) {
        let value;
        if (endianness === constants.LITTLE_ENDIAN) {
            value = this.buffer.readBigInt64LE(this.pos)
        } else if (endianness === constants.BIG_ENDIAN) {
            value = this.buffer.readBigInt64BE(this.pos)
        }

        this.pos += 8;

        return value;
    }

    f32(endianness = this.endianness) {
        let value;
        if (endianness === constants.LITTLE_ENDIAN) {
            value = this.buffer.readFloatLE(this.pos)
        } else if (endianness === constants.BIG_ENDIAN) {
            value = this.buffer.readFloatBE(this.pos)
        }

        this.pos += 4;

        return value;
    }

    f64(endianness = this.endianness) {
        let value;
        if (endianness === constants.LITTLE_ENDIAN) {
            value = this.buffer.readDoubleLE(this.pos)
        } else if (endianness === constants.BIG_ENDIAN) {
            value = this.buffer.readDoubleBE(this.pos)
        }

        this.pos += 8;

        return value;
    }
}

module.exports = Reader;