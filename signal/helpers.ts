// import ByteBuffer from 'bytebuffer';

const util = (() => {
    // @ts-ignore
    const StaticArrayBufferProto = new ArrayBuffer().__proto__;

    return {
        toString: function (thing: any) {
            console.log('toString', StaticArrayBufferProto);

            if(typeof thing == 'string') {
                return thing;
            }
            return new TextDecoder().decode(thing);
            // return Buffer.from(thing.toString('binary'), 'binary');
        },
        toArrayBuffer: function (thing: any) {
            console.log('toArrayBuffer', StaticArrayBufferProto);
            if(thing === undefined) {
                return undefined;
            }
            if(thing === Object(thing)) {
                if(thing.__proto__ == StaticArrayBufferProto) {
                    return thing;
                }
            }

            if(typeof thing !== "string") {
                throw new Error("Tried to convert a non-string of type " + typeof thing + " to an array buffer");
            }
            return new TextEncoder().encode(thing);
            // return ByteBuffer.wrap(thing, 'binary').toArrayBuffer();
        },
        isEqual: function (a: string, b: string) {
            // TODO: Special-case arraybuffers, etc
            if(a === undefined || b === undefined) {
                return false;
            }
            a = util.toString(a);
            b = util.toString(b);
            const maxLength = Math.max(a.length, b.length);
            if(maxLength < 5) {
                throw new Error("a/b compare too short");
            }
            return a.substring(0, Math.min(maxLength, a.length)) == b.substring(0, Math.min(maxLength, b.length));
        },
        arrayBufferToBase64: (buffer: Iterable<number>) => {
            let binary = '';
            let bytes = new Uint8Array(buffer);
            let len = bytes.byteLength;
            for(let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        },
        base64ToArrayBuffer: (base64: string) => {
            let binary_string = window.atob(base64);
            let len = binary_string.length;
            let bytes = new Uint8Array(len);
            for(let i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
    };
})();

export default util;