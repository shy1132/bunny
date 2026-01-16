const constants = require('./constants')

class Writer {
    constructor (buffer, endianness = constants.LITTLE_ENDIAN) {
        if (endianness !== constants.LITTLE_ENDIAN && endianness !== constants.BIG_ENDIAN) throw new Error(`Bad endianness type ${endianness}`);

        this.buffer = buffer ? Buffer.from(buffer) : Buffer.alloc(0)
        this.endianness = endianness;
        this.pos = 0;
    }

    seek(pos) {
        this.pos = pos;
    }

    peek() {
        return this.pos;
    }

    ensure(space) {
        if ((this.pos + space) > this.buffer.length) {
            space = (this.pos + space) - this.buffer.length;

            let buf = Buffer.allocUnsafe(space)
            this.buffer = Buffer.concat([ this.buffer, buf ])
        }

        return this.buffer.length;
    }

    trim() {
        this.buffer = this.buffer.slice(0, this.pos)
    }

    write(buf) {
        let size = buf.length;
        this.ensure(size)

        buf.copy(this.buffer, this.pos, 0, this.pos + size)
        this.pos += size;

        this.trim()
    }

    utf8(str) {
        let buf = Buffer.from(str, 'utf-8')
        let size = buf.length;

        this.ensure(size)

        buf.copy(this.buffer, this.pos, 0, this.pos + size)
        this.pos += size;

        this.trim()
    }

    cstr(str) {
        if (str.includes('\x00')) throw new Error('Input string includes NUL, can\'t safely write');

        let strBuffer = Buffer.from(str, 'utf-8')

        let buf = Buffer.allocUnsafe(strBuffer.length + 1)
        strBuffer.copy(buf)
        buf[buf.length - 1] = 0;

        let size = buf.length;

        this.ensure(size)

        buf.copy(this.buffer, this.pos, 0, this.pos + size)
        this.pos += size;

        this.trim()
    }

    u(value, size, endianness = this.endianness) {
        this.ensure(size)

        if (endianness === constants.LITTLE_ENDIAN) {
            this.buffer.writeUIntLE(value, this.pos, size)
        } else if (endianness === constants.BIG_ENDIAN) {
            this.buffer.writeUIntBE(value, this.pos, size)
        }

        this.pos += size;

        this.trim()
    }

    i(value, size, endianness = this.endianness) {
        this.ensure(size)

        if (endianness === constants.LITTLE_ENDIAN) {
            this.buffer.writeIntLE(value, this.pos, size)
        } else if (endianness === constants.BIG_ENDIAN) {
            this.buffer.writeIntBE(value, this.pos, size)
        }

        this.pos += size;

        this.trim()
    }

    u8(value) {
        let size = 1;
        this.ensure(size)

        this.buffer.writeUInt8(value, this.pos)
        this.pos += size;

        this.trim()
    }

    u16(value, endianness = this.endianness) {
        return this.u(value, 2, endianness);
    }

    u24(value, endianness = this.endianness) {
        return this.u(value, 3, endianness);
    }

    u32(value, endianness = this.endianness) {
        return this.u(value, 4, endianness);
    }

    u40(value, endianness = this.endianness) {
        return this.u(value, 5, endianness);
    }

    u48(value, endianness = this.endianness) {
        return this.u(value, 6, endianness);
    }

    u56(value, endianness = this.endianness) {
        let size = 7;
        this.ensure(size)

        let v = BigInt(value)

        if (endianness === constants.LITTLE_ENDIAN) {
            this.buffer[this.pos] = Number(v & 0xFFn)
            this.buffer[this.pos + 1] = Number((v >> 8n) & 0xFFn)
            this.buffer[this.pos + 2] = Number((v >> 16n) & 0xFFn)
            this.buffer[this.pos + 3] = Number((v >> 24n) & 0xFFn)
            this.buffer[this.pos + 4] = Number((v >> 32n) & 0xFFn)
            this.buffer[this.pos + 5] = Number((v >> 40n) & 0xFFn)
            this.buffer[this.pos + 6] = Number((v >> 48n) & 0xFFn)
        } else if (endianness === constants.BIG_ENDIAN) {
            this.buffer[this.pos] = Number((v >> 48n) & 0xFFn)
            this.buffer[this.pos + 1] = Number((v >> 40n) & 0xFFn)
            this.buffer[this.pos + 2] = Number((v >> 32n) & 0xFFn)
            this.buffer[this.pos + 3] = Number((v >> 24n) & 0xFFn)
            this.buffer[this.pos + 4] = Number((v >> 16n) & 0xFFn)
            this.buffer[this.pos + 5] = Number((v >> 8n) & 0xFFn)
            this.buffer[this.pos + 6] = Number(v & 0xFFn)
        }

        this.pos += size;

        this.trim()
    }

    u64(value, endianness = this.endianness) {
        let size = 8;
        this.ensure(size)

        if (endianness === constants.LITTLE_ENDIAN) {
            this.buffer.writeBigUInt64LE(value, this.pos)
        } else if (endianness === constants.BIG_ENDIAN) {
            this.buffer.writeBigUInt64BE(value, this.pos)
        }

        this.pos += size;

        this.trim()
    }

    i8(value) {
        let size = 1;
        this.ensure(size)

        this.buffer.writeInt8(value, this.pos)
        this.pos += size;

        this.trim()
    }

    i16(value, endianness = this.endianness) {
        return this.i(value, 2, endianness);
    }

    i24(value, endianness = this.endianness) {
        return this.i(value, 3, endianness);
    }

    i32(value, endianness = this.endianness) {
        return this.i(value, 4, endianness);
    }

    i40(value, endianness = this.endianness) {
        return this.i(value, 5, endianness);
    }

    i48(value, endianness = this.endianness) {
        return this.i(value, 6, endianness);
    }

    i56(value, endianness = this.endianness) {
        let size = 7;
        this.ensure(size)

        let v = BigInt(value)
        v = BigInt.asIntN(56, v)

        if (endianness === constants.LITTLE_ENDIAN) {
            this.buffer[this.pos] = Number(v & 0xFFn)
            this.buffer[this.pos + 1] = Number((v >> 8n) & 0xFFn)
            this.buffer[this.pos + 2] = Number((v >> 16n) & 0xFFn)
            this.buffer[this.pos + 3] = Number((v >> 24n) & 0xFFn)
            this.buffer[this.pos + 4] = Number((v >> 32n) & 0xFFn)
            this.buffer[this.pos + 5] = Number((v >> 40n) & 0xFFn)
            this.buffer[this.pos + 6] = Number((v >> 48n) & 0xFFn)
        } else if (endianness === constants.BIG_ENDIAN) {
            this.buffer[this.pos] = Number((v >> 48n) & 0xFFn)
            this.buffer[this.pos + 1] = Number((v >> 40n) & 0xFFn)
            this.buffer[this.pos + 2] = Number((v >> 32n) & 0xFFn)
            this.buffer[this.pos + 3] = Number((v >> 24n) & 0xFFn)
            this.buffer[this.pos + 4] = Number((v >> 16n) & 0xFFn)
            this.buffer[this.pos + 5] = Number((v >> 8n) & 0xFFn)
            this.buffer[this.pos + 6] = Number(v & 0xFFn)
        }

        this.pos += size;

        this.trim()
    }

    i64(value, endianness = this.endianness) {
        let size = 8;
        this.ensure(size)

        if (endianness === constants.LITTLE_ENDIAN) {
            this.buffer.writeBigInt64LE(value, this.pos)
        } else if (endianness === constants.BIG_ENDIAN) {
            this.buffer.writeBigInt64BE(value, this.pos)
        }

        this.pos += size;

        this.trim()
    }

    f32(value, endianness = this.endianness) {
        let size = 4;
        this.ensure(size)

        if (endianness === constants.LITTLE_ENDIAN) {
            this.buffer.writeFloatLE(value, this.pos)
        } else if (endianness === constants.BIG_ENDIAN) {
            this.buffer.writeFloatBE(value, this.pos)
        }

        this.pos += size;

        this.trim()
    }

    f64(value, endianness = this.endianness) {
        let size = 8
        this.ensure(size)

        if (endianness === constants.LITTLE_ENDIAN) {
            this.buffer.writeDoubleLE(value, this.pos)
        } else if (endianness === constants.BIG_ENDIAN) {
            this.buffer.writeDoubleBE(value, this.pos)
        }

        this.pos += size;

        this.trim()
    }
}

module.exports = Writer;