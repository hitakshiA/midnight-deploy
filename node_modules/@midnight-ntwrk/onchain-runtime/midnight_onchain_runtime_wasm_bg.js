let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_5.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_5.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}
/**
 * @param {any} coin
 * @returns {any}
 */
export function encodeCoinInfo(coin) {
    const ret = wasm.encodeCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} coin
 * @returns {any}
 */
export function encodeQualifiedCoinInfo(coin) {
    const ret = wasm.encodeQualifiedCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} coin
 * @returns {any}
 */
export function decodeCoinInfo(coin) {
    const ret = wasm.decodeCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} coin
 * @returns {any}
 */
export function decodeQualifiedCoinInfo(coin) {
    const ret = wasm.decodeQualifiedCoinInfo(coin);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} tt
 * @returns {Uint8Array}
 */
export function encodeTokenType(tt) {
    const ptr0 = passStringToWasm0(tt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodeTokenType(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} tt
 * @returns {string}
 */
export function decodeTokenType(tt) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decodeTokenType(tt);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {string} addr
 * @returns {Uint8Array}
 */
export function encodeContractAddress(addr) {
    const ptr0 = passStringToWasm0(addr, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodeContractAddress(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} addr
 * @returns {string}
 */
export function decodeContractAddress(addr) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decodeContractAddress(addr);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {string} pk
 * @returns {Uint8Array}
 */
export function encodeCoinPublicKey(pk) {
    const ptr0 = passStringToWasm0(pk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encodeCoinPublicKey(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {Uint8Array} pk
 * @returns {string}
 */
export function decodeCoinPublicKey(pk) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.decodeCoinPublicKey(pk);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} entry_point
 * @returns {string}
 */
export function entryPointHash(entry_point) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.entryPointHash(entry_point);
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @returns {string}
 */
export function communicationCommitmentRandomness() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.communicationCommitmentRandomness();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} input
 * @param {any} output
 * @param {string} rand
 * @returns {string}
 */
export function communicationCommitment(input, output, rand) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(rand, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.communicationCommitment(input, output, ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @returns {string}
 */
export function sampleSigningKey() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleSigningKey();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {string} key
 * @param {Uint8Array} data
 * @returns {string}
 */
export function signData(key, data) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.signData(ptr0, len0, data);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {string} key
 * @returns {string}
 */
export function signatureVerifyingKey(key) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.signatureVerifyingKey(ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {string} key
 * @param {Uint8Array} data
 * @param {string} signature
 * @returns {boolean}
 */
export function verifySignature(key, data, signature) {
    const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(signature, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.verifySignature(ptr0, len0, data, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * @param {Uint8Array} domain_sep
 * @param {string} contract
 * @returns {string}
 */
export function tokenType(domain_sep, contract) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(contract, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.tokenType(domain_sep, ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @returns {string}
 */
export function sampleContractAddress() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleContractAddress();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @returns {string}
 */
export function sampleTokenType() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.sampleTokenType();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @returns {string}
 */
export function dummyContractAddress() {
    let deferred2_0;
    let deferred2_1;
    try {
        const ret = wasm.dummyContractAddress();
        var ptr1 = ret[0];
        var len1 = ret[1];
        if (ret[3]) {
            ptr1 = 0; len1 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {any} coin
 * @param {any} recipient
 * @returns {any}
 */
export function coinCommitment(coin, recipient) {
    const ret = wasm.coinCommitment(coin, recipient);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} value
 * @returns {any}
 */
export function leafHash(value) {
    const ret = wasm.leafHash(value);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} alignment
 * @returns {bigint}
 */
export function maxAlignedSize(alignment) {
    const ret = wasm.maxAlignedSize(alignment);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return BigInt.asUintN(64, ret[0]);
}

/**
 * @returns {bigint}
 */
export function maxField() {
    const ret = wasm.maxField();
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {string} zkir
 * @param {any} input
 * @param {any} output
 * @param {any} public_transcript
 * @param {any} private_transcript_outputs
 */
export function checkProofData(zkir, input, output, public_transcript, private_transcript_outputs) {
    const ptr0 = passStringToWasm0(zkir, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.checkProofData(ptr0, len0, input, output, public_transcript, private_transcript_outputs);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {bigint} x
 * @returns {bigint}
 */
export function bigIntModFr(x) {
    const ret = wasm.bigIntModFr(x);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} x
 * @returns {bigint}
 */
export function valueToBigInt(x) {
    const ret = wasm.valueToBigInt(x);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} x
 * @returns {any}
 */
export function bigIntToValue(x) {
    const ret = wasm.bigIntToValue(x);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @returns {any}
 */
export function transientHash(align, val) {
    const ret = wasm.transientHash(align, val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @param {any} opening
 * @returns {any}
 */
export function transientCommit(align, val, opening) {
    const ret = wasm.transientCommit(align, val, opening);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @returns {any}
 */
export function persistentHash(align, val) {
    const ret = wasm.persistentHash(align, val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @param {any} opening
 * @returns {any}
 */
export function persistentCommit(align, val, opening) {
    const ret = wasm.persistentCommit(align, val, opening);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} persistent
 * @returns {any}
 */
export function degradeToTransient(persistent) {
    const ret = wasm.degradeToTransient(persistent);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} transient
 * @returns {any}
 */
export function upgradeFromTransient(transient) {
    const ret = wasm.upgradeFromTransient(transient);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} align
 * @param {any} val
 * @returns {any}
 */
export function hashToCurve(align, val) {
    const ret = wasm.hashToCurve(align, val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {any}
 */
export function ecAdd(a, b) {
    const ret = wasm.ecAdd(a, b);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {any}
 */
export function ecMul(a, b) {
    const ret = wasm.ecMul(a, b);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {any} val
 * @returns {any}
 */
export function ecMulGenerator(val) {
    const ret = wasm.ecMulGenerator(val);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_2.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}
/**
 * @param {VmStack} initial
 * @param {any} ops
 * @param {CostModel} cost_model
 * @param {bigint | null} [gas_limit]
 * @returns {VmResults}
 */
export function runProgram(initial, ops, cost_model, gas_limit) {
    _assertClass(initial, VmStack);
    _assertClass(cost_model, CostModel);
    const ret = wasm.runProgram(initial.__wbg_ptr, ops, cost_model.__wbg_ptr, !isLikeNone(gas_limit), isLikeNone(gas_limit) ? BigInt(0) : gas_limit);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return VmResults.__wrap(ret[0]);
}

function __wbg_adapter_54(arg0, arg1, arg2) {
    wasm.closure512_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_286(arg0, arg1, arg2, arg3) {
    wasm.closure553_externref_shim(arg0, arg1, arg2, arg3);
}

/**
 * @enum {0 | 1 | 2 | 3}
 */
export const NetworkId = Object.freeze({
    Undeployed: 0, "0": "Undeployed",
    DevNet: 1, "1": "DevNet",
    TestNet: 2, "2": "TestNet",
    MainNet: 3, "3": "MainNet",
});

const __wbindgen_enum_ReadableStreamType = ["bytes"];

const ContractMaintenanceAuthorityFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractmaintenanceauthority_free(ptr >>> 0, 1));

export class ContractMaintenanceAuthority {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractMaintenanceAuthority.prototype);
        obj.__wbg_ptr = ptr;
        ContractMaintenanceAuthorityFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractMaintenanceAuthorityFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractmaintenanceauthority_free(ptr, 0);
    }
    /**
     * @param {Array<any>} committee
     * @param {number} threshold
     * @param {bigint | null} [counter]
     */
    constructor(committee, threshold, counter) {
        const ret = wasm.contractmaintenanceauthority_new(committee, threshold, isLikeNone(counter) ? 0 : addToExternrefTable0(counter));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ContractMaintenanceAuthorityFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Array<any>}
     */
    get committee() {
        const ret = wasm.contractmaintenanceauthority_committee(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {number}
     */
    get threshold() {
        const ret = wasm.contractmaintenanceauthority_threshold(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {bigint}
     */
    get counter() {
        const ret = wasm.contractmaintenanceauthority_counter(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {NetworkId} netid
     * @returns {any}
     */
    serialize(netid) {
        const ret = wasm.contractmaintenanceauthority_serialize(this.__wbg_ptr, netid);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} raw
     * @param {NetworkId} netid
     * @returns {ContractMaintenanceAuthority}
     */
    static deserialize(raw, netid) {
        const ret = wasm.contractmaintenanceauthority_deserialize(raw, netid);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ContractMaintenanceAuthority.__wrap(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractmaintenanceauthority_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const ContractOperationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractoperation_free(ptr >>> 0, 1));

export class ContractOperation {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractOperation.prototype);
        obj.__wbg_ptr = ptr;
        ContractOperationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractOperationFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractoperation_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.contractoperation_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ContractOperationFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any}
     */
    get verifierKey() {
        const ret = wasm.contractoperation_verifier_key(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} key
     */
    set verifierKey(key) {
        const ret = wasm.contractoperation_set_verifier_key(this.__wbg_ptr, key);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {NetworkId} netid
     * @returns {any}
     */
    serialize(netid) {
        const ret = wasm.contractoperation_serialize(this.__wbg_ptr, netid);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} raw
     * @param {NetworkId} netid
     * @returns {ContractOperation}
     */
    static deserialize(raw, netid) {
        const ret = wasm.contractoperation_deserialize(raw, netid);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ContractOperation.__wrap(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractoperation_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const ContractStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractstate_free(ptr >>> 0, 1));

export class ContractState {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractState.prototype);
        obj.__wbg_ptr = ptr;
        ContractStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractStateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractstate_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.contractstate_new();
        this.__wbg_ptr = ret >>> 0;
        ContractStateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {StateValue}
     */
    get data() {
        const ret = wasm.contractstate_data(this.__wbg_ptr);
        return StateValue.__wrap(ret);
    }
    /**
     * @param {StateValue} data
     */
    set data(data) {
        _assertClass(data, StateValue);
        wasm.contractstate_set_data(this.__wbg_ptr, data.__wbg_ptr);
    }
    /**
     * @returns {ContractMaintenanceAuthority}
     */
    get maintenanceAuthority() {
        const ret = wasm.contractstate_maintenance_authority(this.__wbg_ptr);
        return ContractMaintenanceAuthority.__wrap(ret);
    }
    /**
     * @param {ContractMaintenanceAuthority} authority
     */
    set maintenanceAuthority(authority) {
        _assertClass(authority, ContractMaintenanceAuthority);
        wasm.contractstate_set_maintenance_authority(this.__wbg_ptr, authority.__wbg_ptr);
    }
    /**
     * @returns {any[]}
     */
    operations() {
        const ret = wasm.contractstate_operations(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {any} operation
     * @returns {ContractOperation | undefined}
     */
    operation(operation) {
        const ret = wasm.contractstate_operation(this.__wbg_ptr, operation);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : ContractOperation.__wrap(ret[0]);
    }
    /**
     * @param {any} operation
     * @param {ContractOperation} value
     */
    setOperation(operation, value) {
        _assertClass(value, ContractOperation);
        const ret = wasm.contractstate_setOperation(this.__wbg_ptr, operation, value.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @param {any} query
     * @param {CostModel} cost_model
     * @returns {any}
     */
    query(query, cost_model) {
        _assertClass(cost_model, CostModel);
        const ret = wasm.contractstate_query(this.__wbg_ptr, query, cost_model.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {NetworkId} netid
     * @returns {any}
     */
    serialize(netid) {
        const ret = wasm.contractstate_serialize(this.__wbg_ptr, netid);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {Uint8Array} raw
     * @param {NetworkId} netid
     * @returns {ContractState}
     */
    static deserialize(raw, netid) {
        const ret = wasm.contractstate_deserialize(raw, netid);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ContractState.__wrap(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.contractstate_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const CostModelFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_costmodel_free(ptr >>> 0, 1));

export class CostModel {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CostModel.prototype);
        obj.__wbg_ptr = ptr;
        CostModelFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CostModelFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_costmodel_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.costmodel_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        CostModelFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {CostModel}
     */
    static dummyCostModel() {
        const ret = wasm.costmodel_dummyCostModel();
        return CostModel.__wrap(ret);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.costmodel_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const IntoUnderlyingByteSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0, 1));

export class IntoUnderlyingByteSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingByteSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingbytesource_free(ptr, 0);
    }
    /**
     * @returns {ReadableStreamType}
     */
    get type() {
        const ret = wasm.intounderlyingbytesource_type(this.__wbg_ptr);
        return __wbindgen_enum_ReadableStreamType[ret];
    }
    /**
     * @returns {number}
     */
    get autoAllocateChunkSize() {
        const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {ReadableByteStreamController} controller
     */
    start(controller) {
        wasm.intounderlyingbytesource_start(this.__wbg_ptr, controller);
    }
    /**
     * @param {ReadableByteStreamController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingbytesource_cancel(ptr);
    }
}

const IntoUnderlyingSinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsink_free(ptr >>> 0, 1));

export class IntoUnderlyingSink {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSinkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsink_free(ptr, 0);
    }
    /**
     * @param {any} chunk
     * @returns {Promise<any>}
     */
    write(chunk) {
        const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, chunk);
        return ret;
    }
    /**
     * @returns {Promise<any>}
     */
    close() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_close(ptr);
        return ret;
    }
    /**
     * @param {any} reason
     * @returns {Promise<any>}
     */
    abort(reason) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_abort(ptr, reason);
        return ret;
    }
}

const IntoUnderlyingSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsource_free(ptr >>> 0, 1));

export class IntoUnderlyingSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsource_free(ptr, 0);
    }
    /**
     * @param {ReadableStreamDefaultController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingsource_cancel(ptr);
    }
}

const QueryContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_querycontext_free(ptr >>> 0, 1));

export class QueryContext {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(QueryContext.prototype);
        obj.__wbg_ptr = ptr;
        QueryContextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QueryContextFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_querycontext_free(ptr, 0);
    }
    /**
     * @param {StateValue} state
     * @param {string} address
     */
    constructor(state, address) {
        _assertClass(state, StateValue);
        const ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.querycontext_new(state.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        QueryContextFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {StateValue}
     */
    get state() {
        const ret = wasm.querycontext_state(this.__wbg_ptr);
        return StateValue.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    get address() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.querycontext_address(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    get effects() {
        const ret = wasm.querycontext_effects(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} effects
     */
    set effects(effects) {
        const ret = wasm.querycontext_set_effects(this.__wbg_ptr, effects);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {any}
     */
    get block() {
        const ret = wasm.querycontext_block(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} block
     */
    set block(block) {
        const ret = wasm.querycontext_set_block(this.__wbg_ptr, block);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {any}
     */
    get comIndicies() {
        const ret = wasm.querycontext_com_indicies(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {string} comm
     * @param {bigint} index
     * @returns {QueryContext}
     */
    insertCommitment(comm, index) {
        const ptr0 = passStringToWasm0(comm, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.querycontext_insertCommitment(this.__wbg_ptr, ptr0, len0, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QueryContext.__wrap(ret[0]);
    }
    /**
     * @param {any} coin
     * @returns {any}
     */
    qualify(coin) {
        const ret = wasm.querycontext_qualify(this.__wbg_ptr, coin);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} transcript
     * @param {CostModel} cost_model
     * @returns {QueryContext}
     */
    runTranscript(transcript, cost_model) {
        _assertClass(cost_model, CostModel);
        const ret = wasm.querycontext_runTranscript(this.__wbg_ptr, transcript, cost_model.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QueryContext.__wrap(ret[0]);
    }
    /**
     * @param {any} ops
     * @param {CostModel} cost_model
     * @param {bigint | null} [gas_limit]
     * @returns {QueryResults}
     */
    query(ops, cost_model, gas_limit) {
        _assertClass(cost_model, CostModel);
        const ret = wasm.querycontext_query(this.__wbg_ptr, ops, cost_model.__wbg_ptr, !isLikeNone(gas_limit), isLikeNone(gas_limit) ? BigInt(0) : gas_limit);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QueryResults.__wrap(ret[0]);
    }
    /**
     * @param {any} program
     * @param {CostModel} cost_model
     * @returns {any}
     */
    intoTranscript(program, cost_model) {
        _assertClass(cost_model, CostModel);
        const ret = wasm.querycontext_intoTranscript(this.__wbg_ptr, program, cost_model.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.querycontext_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const QueryResultsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_queryresults_free(ptr >>> 0, 1));

export class QueryResults {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(QueryResults.prototype);
        obj.__wbg_ptr = ptr;
        QueryResultsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QueryResultsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_queryresults_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.queryresults_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        QueryResultsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {QueryContext}
     */
    get context() {
        const ret = wasm.queryresults_context(this.__wbg_ptr);
        return QueryContext.__wrap(ret);
    }
    /**
     * @returns {any}
     */
    get events() {
        const ret = wasm.queryresults_events(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get gasCost() {
        const ret = wasm.queryresults_gas_cost(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.queryresults_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const StateBoundedMerkleTreeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_stateboundedmerkletree_free(ptr >>> 0, 1));

export class StateBoundedMerkleTree {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StateBoundedMerkleTree.prototype);
        obj.__wbg_ptr = ptr;
        StateBoundedMerkleTreeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StateBoundedMerkleTreeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stateboundedmerkletree_free(ptr, 0);
    }
    /**
     * @param {number} height
     */
    constructor(height) {
        const ret = wasm.stateboundedmerkletree_blank(height);
        this.__wbg_ptr = ret >>> 0;
        StateBoundedMerkleTreeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get height() {
        const ret = wasm.stateboundedmerkletree_height(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {any}
     */
    root() {
        const ret = wasm.stateboundedmerkletree_root(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} leaf
     * @returns {any}
     */
    findPathForLeaf(leaf) {
        const ret = wasm.stateboundedmerkletree_findPathForLeaf(this.__wbg_ptr, leaf);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {bigint} index
     * @param {any} leaf
     * @returns {any}
     */
    pathForLeaf(index, leaf) {
        const ret = wasm.stateboundedmerkletree_pathForLeaf(this.__wbg_ptr, index, leaf);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {bigint} index
     * @param {any} leaf
     * @returns {StateBoundedMerkleTree}
     */
    update(index, leaf) {
        const ret = wasm.stateboundedmerkletree_update(this.__wbg_ptr, index, leaf);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateBoundedMerkleTree.__wrap(ret[0]);
    }
    /**
     * @param {bigint} start
     * @param {bigint} end
     * @returns {StateBoundedMerkleTree}
     */
    collapse(start, end) {
        const ret = wasm.stateboundedmerkletree_collapse(this.__wbg_ptr, start, end);
        return StateBoundedMerkleTree.__wrap(ret);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.stateboundedmerkletree_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const StateMapFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_statemap_free(ptr >>> 0, 1));

export class StateMap {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StateMap.prototype);
        obj.__wbg_ptr = ptr;
        StateMapFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StateMapFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_statemap_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.statemap_new();
        this.__wbg_ptr = ret >>> 0;
        StateMapFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {any[]}
     */
    keys() {
        const ret = wasm.statemap_keys(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {any} key
     * @returns {StateValue | undefined}
     */
    get(key) {
        const ret = wasm.statemap_get(this.__wbg_ptr, key);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : StateValue.__wrap(ret[0]);
    }
    /**
     * @param {any} key
     * @param {StateValue} value
     * @returns {StateMap}
     */
    insert(key, value) {
        _assertClass(value, StateValue);
        const ret = wasm.statemap_insert(this.__wbg_ptr, key, value.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateMap.__wrap(ret[0]);
    }
    /**
     * @param {any} key
     * @returns {StateMap}
     */
    remove(key) {
        const ret = wasm.statemap_remove(this.__wbg_ptr, key);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateMap.__wrap(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.statemap_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const StateValueFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_statevalue_free(ptr >>> 0, 1));

export class StateValue {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StateValue.prototype);
        obj.__wbg_ptr = ptr;
        StateValueFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StateValueFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_statevalue_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.statevalue_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        StateValueFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.statevalue_type(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {StateValue}
     */
    static newNull() {
        const ret = wasm.statevalue_newNull();
        return StateValue.__wrap(ret);
    }
    /**
     * @param {any} value
     * @returns {StateValue}
     */
    static newCell(value) {
        const ret = wasm.statevalue_newCell(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @param {StateMap} map
     * @returns {StateValue}
     */
    static newMap(map) {
        _assertClass(map, StateMap);
        const ret = wasm.statevalue_newMap(map.__wbg_ptr);
        return StateValue.__wrap(ret);
    }
    /**
     * @param {StateBoundedMerkleTree} tree
     * @returns {StateValue}
     */
    static newBoundedMerkleTree(tree) {
        _assertClass(tree, StateBoundedMerkleTree);
        const ret = wasm.statevalue_newBoundedMerkleTree(tree.__wbg_ptr);
        return StateValue.__wrap(ret);
    }
    /**
     * @returns {StateValue}
     */
    static newArray() {
        const ret = wasm.statevalue_newArray();
        return StateValue.__wrap(ret);
    }
    /**
     * @param {StateValue} value
     * @returns {StateValue}
     */
    arrayPush(value) {
        _assertClass(value, StateValue);
        const ret = wasm.statevalue_arrayPush(this.__wbg_ptr, value.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    asCell() {
        const ret = wasm.statevalue_asCell(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {StateMap | undefined}
     */
    asMap() {
        const ret = wasm.statevalue_asMap(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : StateMap.__wrap(ret[0]);
    }
    /**
     * @returns {StateBoundedMerkleTree | undefined}
     */
    asBoundedMerkleTree() {
        const ret = wasm.statevalue_asBoundedMerkleTree(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : StateBoundedMerkleTree.__wrap(ret[0]);
    }
    /**
     * @returns {any[] | undefined}
     */
    asArray() {
        const ret = wasm.statevalue_asArray(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * @returns {number}
     */
    logSize() {
        const ret = wasm.statevalue_logSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {any}
     */
    encode() {
        const ret = wasm.statevalue_encode(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @param {any} value
     * @returns {StateValue}
     */
    static decode(value) {
        const ret = wasm.statevalue_decode(value);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.statevalue_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const VmResultsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vmresults_free(ptr >>> 0, 1));

export class VmResults {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VmResults.prototype);
        obj.__wbg_ptr = ptr;
        VmResultsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VmResultsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vmresults_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.vmresults_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return StateValue.__wrap(ret[0]);
    }
    /**
     * @returns {VmStack}
     */
    get stack() {
        const ret = wasm.vmresults_stack(this.__wbg_ptr);
        return VmStack.__wrap(ret);
    }
    /**
     * @returns {any}
     */
    get events() {
        const ret = wasm.vmresults_events(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * @returns {bigint}
     */
    get gasCost() {
        const ret = wasm.vmresults_gas_cost(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.vmresults_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const VmStackFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vmstack_free(ptr >>> 0, 1));

export class VmStack {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VmStack.prototype);
        obj.__wbg_ptr = ptr;
        VmStackFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VmStackFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vmstack_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.vmstack_new();
        this.__wbg_ptr = ret >>> 0;
        VmStackFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {StateValue} value
     * @param {boolean} is_strong
     */
    push(value, is_strong) {
        _assertClass(value, StateValue);
        wasm.vmstack_push(this.__wbg_ptr, value.__wbg_ptr, is_strong);
    }
    removeLast() {
        wasm.vmstack_removeLast(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    length() {
        const ret = wasm.vmstack_length(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} idx
     * @returns {StateValue | undefined}
     */
    get(idx) {
        const ret = wasm.vmstack_get(this.__wbg_ptr, idx);
        return ret === 0 ? undefined : StateValue.__wrap(ret);
    }
    /**
     * @param {number} idx
     * @returns {boolean | undefined}
     */
    isStrong(idx) {
        const ret = wasm.vmstack_isStrong(this.__wbg_ptr, idx);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * @param {boolean | null} [compact]
     * @returns {string}
     */
    toString(compact) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.vmstack_toString(this.__wbg_ptr, isLikeNone(compact) ? 0xFFFFFF : compact ? 1 : 0);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

export function __wbg_BigInt_470dd987b8190f8e(arg0) {
    const ret = BigInt(arg0);
    return ret;
};

export function __wbg_BigInt_ddea6d2f55558acb() { return handleError(function (arg0) {
    const ret = BigInt(arg0);
    return ret;
}, arguments) };

export function __wbg_String_fed4d24b68977888(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_buffer_09165b52af8c5237(arg0) {
    const ret = arg0.buffer;
    return ret;
};

export function __wbg_buffer_609cc3eee51ed158(arg0) {
    const ret = arg0.buffer;
    return ret;
};

export function __wbg_byobRequest_77d9adf63337edfb(arg0) {
    const ret = arg0.byobRequest;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_byteLength_e674b853d9c77e1d(arg0) {
    const ret = arg0.byteLength;
    return ret;
};

export function __wbg_byteOffset_fd862df290ef848d(arg0) {
    const ret = arg0.byteOffset;
    return ret;
};

export function __wbg_call_672a4d21634d4a24() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_call_7cccdd69e0791ae2() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_close_304cc1fef3466669() { return handleError(function (arg0) {
    arg0.close();
}, arguments) };

export function __wbg_close_5ce03e29be453811() { return handleError(function (arg0) {
    arg0.close();
}, arguments) };

export function __wbg_contractstate_new(arg0) {
    const ret = ContractState.__wrap(arg0);
    return ret;
};

export function __wbg_crypto_574e78ad8b13b65f(arg0) {
    const ret = arg0.crypto;
    return ret;
};

export function __wbg_done_769e5ede4b31c67b(arg0) {
    const ret = arg0.done;
    return ret;
};

export function __wbg_enqueue_bb16ba72f537dc9e() { return handleError(function (arg0, arg1) {
    arg0.enqueue(arg1);
}, arguments) };

export function __wbg_entries_3265d4158b33e5dc(arg0) {
    const ret = Object.entries(arg0);
    return ret;
};

export function __wbg_getRandomValues_b8f5dbd5f3995a9e() { return handleError(function (arg0, arg1) {
    arg0.getRandomValues(arg1);
}, arguments) };

export function __wbg_get_67b2ba62fc30de12() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_get_b9b93047fe3cf45b(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

export function __wbg_getwithrefkey_bb8f74a92cb2e784(arg0, arg1) {
    const ret = arg0[arg1];
    return ret;
};

export function __wbg_instanceof_ArrayBuffer_e14585432e3737fc(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Uint8Array_17156bcf118086a9(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_isArray_a1eab7e0d067391b(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
};

export function __wbg_isSafeInteger_343e2beeeece1bb0(arg0) {
    const ret = Number.isSafeInteger(arg0);
    return ret;
};

export function __wbg_iterator_9a24c88df860dc65() {
    const ret = Symbol.iterator;
    return ret;
};

export function __wbg_length_a446193dc22c12f8(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_e2d2a49132c1b256(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_msCrypto_a61aeb35a24c1329(arg0) {
    const ret = arg0.msCrypto;
    return ret;
};

export function __wbg_new_23a2665fac83c611(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_286(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return ret;
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_new_405e22f390576ce2() {
    const ret = new Object();
    return ret;
};

export function __wbg_new_5e0be73521bc8c17() {
    const ret = new Map();
    return ret;
};

export function __wbg_new_78feb108b6472713() {
    const ret = new Array();
    return ret;
};

export function __wbg_new_a12002a7f91c75be(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

export function __wbg_new_c68d7209be747379(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_newnoargs_105ed471475aaf50(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a(arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_newwithlength_a381634e90c276d4(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
};

export function __wbg_next_25feadfc0913fea9(arg0) {
    const ret = arg0.next;
    return ret;
};

export function __wbg_next_6574e1a8a62d1055() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments) };

export function __wbg_node_905d3e251edff8a2(arg0) {
    const ret = arg0.node;
    return ret;
};

export function __wbg_process_dc0fbacc7c1c06f7(arg0) {
    const ret = arg0.process;
    return ret;
};

export function __wbg_push_737cfc8c1432c2c6(arg0, arg1) {
    const ret = arg0.push(arg1);
    return ret;
};

export function __wbg_queueMicrotask_97d92b4fcc8a61c5(arg0) {
    queueMicrotask(arg0);
};

export function __wbg_queueMicrotask_d3219def82552485(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
};

export function __wbg_randomFillSync_ac0988aba3254290() { return handleError(function (arg0, arg1) {
    arg0.randomFillSync(arg1);
}, arguments) };

export function __wbg_require_60cc747a6bc5215a() { return handleError(function () {
    const ret = module.require;
    return ret;
}, arguments) };

export function __wbg_resolve_4851785c9c5f573d(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
};

export function __wbg_respond_1f279fa9f8edcb1c() { return handleError(function (arg0, arg1) {
    arg0.respond(arg1 >>> 0);
}, arguments) };

export function __wbg_set_37837023f3d740e8(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
};

export function __wbg_set_3fda3bac07393de4(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
};

export function __wbg_set_65595bdd868b3009(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
};

export function __wbg_set_8fc6bf8a5b1071d1(arg0, arg1, arg2) {
    const ret = arg0.set(arg1, arg2);
    return ret;
};

export function __wbg_statevalue_new(arg0) {
    const ret = StateValue.__wrap(arg0);
    return ret;
};

export function __wbg_static_accessor_GLOBAL_88a902d13a557d07() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_SELF_37c5d418e4bf5819() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_WINDOW_5de37043a91a9c40() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_subarray_aa9065fa9dc5df96(arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_then_44b73946d2fb3e7d(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
};

export function __wbg_toString_b5d4438bc26b267c() { return handleError(function (arg0, arg1) {
    const ret = arg0.toString(arg1);
    return ret;
}, arguments) };

export function __wbg_toString_c813bbd34d063839(arg0) {
    const ret = arg0.toString();
    return ret;
};

export function __wbg_value_cd1ffa7b1ab794f1(arg0) {
    const ret = arg0.value;
    return ret;
};

export function __wbg_versions_c01dfd4722a88165(arg0) {
    const ret = arg0.versions;
    return ret;
};

export function __wbg_view_fd8a56e8983f448d(arg0) {
    const ret = arg0.view;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbindgen_bigint_from_i64(arg0) {
    const ret = arg0;
    return ret;
};

export function __wbindgen_bigint_from_u128(arg0, arg1) {
    const ret = BigInt.asUintN(64, arg0) << BigInt(64) | BigInt.asUintN(64, arg1);
    return ret;
};

export function __wbindgen_bigint_from_u64(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return ret;
};

export function __wbindgen_bigint_get_as_i64(arg0, arg1) {
    const v = arg1;
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbindgen_boolean_get(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

export function __wbindgen_cb_drop(arg0) {
    const obj = arg0.original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

export function __wbindgen_closure_wrapper2600(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 513, __wbg_adapter_54);
    return ret;
};

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbindgen_in(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_2;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_is_bigint(arg0) {
    const ret = typeof(arg0) === 'bigint';
    return ret;
};

export function __wbindgen_is_function(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};

export function __wbindgen_is_object(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbindgen_is_string(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
};

export function __wbindgen_is_undefined(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbindgen_jsval_eq(arg0, arg1) {
    const ret = arg0 === arg1;
    return ret;
};

export function __wbindgen_jsval_loose_eq(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return ret;
};

export function __wbindgen_number_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return ret;
};

export function __wbindgen_shr(arg0, arg1) {
    const ret = arg0 >> arg1;
    return ret;
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

