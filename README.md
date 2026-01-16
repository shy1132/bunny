# bunny

a very simple buffer reader/writer for JavaScript, written with ease-of-use in mind, for small projects

## example

reading/writing a custom Minecraft Classic level format
```js
const zlib = require('zlib')
const bunny = require('@shy1132/bunny')

const levelMagic = 0x11326351;
const levelVersion = 1;

function parse(buffer) {
    const reader = new bunny.Reader(buffer, bunny.BIG_ENDIAN)

    let magic = reader.u32()
    if (magic !== levelMagic) throw new Error('invalid level');

    let version = reader.u8()
    if (version > levelVersion) throw new Error(`version ${version} is newer than ${levelVersion}`);

    let [ dimX, dimY, dimZ ] = [ reader.u16(), reader.u16(), reader.u16() ]
    let [ spawnX, spawnY, spawnZ ] = [ reader.u16(), reader.u16(), reader.u16() ]

    let compressed = reader.u8() === 1;

    let serializedBlockArray = reader.read(buffer.length - reader.peek())
    let blockArray;
    if (compressed) {
        blockArray = zlib.gunzipSync(serializedBlockArray)
    } else {
        blockArray = serializedBlockArray;
    }

    return {
        blockArray,
        dim: {
            x: dimX,
            y: dimY,
            z: dimZ
        },
        spawn: {
            x: spawnX,
            y: spawnY,
            z: spawnZ
        }
    };
}

function create(blockArray, dim, spawn) {
    const writer = new bunny.Writer(null, bunny.BIG_ENDIAN)

    writer.u32(levelMagic)
    writer.u8(levelVersion)

    writer.u16(dim.x)
    writer.u16(dim.y)
    writer.u16(dim.z)

    writer.u16(spawn.x)
    writer.u16(spawn.y)
    writer.u16(spawn.z)

    writer.u8(1) //compressed

    let serializedBlockArray = zlib.gzipSync(blockArray, { level: 3 })
    writer.write(serializedBlockArray)

    return writer.buffer;
}
```

## documentation

there currently is no documentation right now, i intend to write one in the future. it should be fairly simple to tell how to use it from the example and from the exposed api

## when should i use this instead of the native node.js buffer module?

it's good for handling buffers in very simple contexts, like simple file formats and simple protocols. it's not so good for huge stuff, you should probably roll your own module at that point. i wrote this because it's useful for me across many of my simpler projects

## contributing

i don't want this to be some huge project i have to manage, but i don't mind issues and pull requests! if adding a feature, please make sure it doesn't compromise on ease-of-use and doesn't do *too* much
