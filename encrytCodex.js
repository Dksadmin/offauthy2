    function Encrypt(e, t, o, n) {
    var r = [];
    switch (o.toLowerCase()) {
    case "chgsqsa":
        if (null == e || null == t) {
            return null
        }
        r = PackageSAData(e, t);
        break;
    case "chgpwd":
        if (null == e || null == n) {
            return null
        }
        r = PackageNewAndOldPwd(e, n);
        break;
    case "pwd":
        if (null == e) {
            return null
        }
        r = PackagePwdOnly(e);
        break;
    case "pin":
        if (null == e) {
            return null
        }
        r = PackagePinOnly(e);
        break;
    case "proof":
        if (null == e && null == t) {
            return null
        }
        r = PackageLoginIntData(null != e ? e : t);
        break;
    case "saproof":
        if (null == t) {
            return null
        }
        r = PackageSADataForProof(t);
        break;
    case "newpwd":
        if (null == n) {
            return null
        }
        r = PackageNewPwdOnly(n)
    }
    if (null == r || "undefined" == typeof r) {
        return r
    }
    if ("undefined" != typeof Key && void 0 !== parseRSAKeyFromString) {
        var a = parseRSAKeyFromString(Key)
    }
   var i = RSAEncrypt(r, a, randomNum);
    return i
}
function PackageSADataForProof(e) {
    var t, o = [], n = 0;
    for (t = 0; t < e.length; t++) {
        o[n++] = 127 & e.charCodeAt(t),
        o[n++] = (65280 & e.charCodeAt(t)) >> 8
    }
    return o
}
function parseRSAKeyFromString(e) {
    var t = e.indexOf(";");
    if (0 > t) {
        return null
    }
    var o = e.substr(0, t)
      , n = e.substr(t + 1)
      , r = o.indexOf("=");
    if (0 > r) {
        return null
    }
    var a = o.substr(r + 1);
    if (r = n.indexOf("="),
    0 > r) {
        return null
    }
    var i = n.substr(r + 1)
      , l = new Object;
    return l.n = hexStringToMP(i),
    l.e = parseInt(a, 16),
    l
}
function hexStringToMP(e) {
    var t, o, n = Math.ceil(e.length / 4), r = new JSMPnumber;
    for (r.size = n,
    t = 0; n > t; t++) {
        o = e.substr(4 * t, 4),
        r.data[n - 1 - t] = parseInt(o, 16)
    }
    return r
}
function JSMPnumber() {
    this.size = 1,
    this.data = [],
    this.data[0] = 0
}
function applyPKCSv2Padding(e, t, o) {
    var n, r = e.length, a = [218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9], i = t - r - 40 - 2, l = [];
    for (n = 0; i > n; n++) {
        l[n] = 0
    }
    l[i] = 1;
    var s = a.concat(l, e)
      , c = [];
    for (n = 0; 20 > n; n++) {
        c[n] = Math.floor(256 * Math.random())
    }
    c = SHA1(c.concat(o));
    var d = MGF(c, t - 21)
      , f = XORarrays(s, d)
      , u = MGF(f, 20)
      , p = XORarrays(c, u)
      , g = [];
    for (g[0] = 0,
    g = g.concat(p, f),
    n = 0; n < g.length; n++) {
        e[n] = g[n]
    }
}
function SHA1(e) {
    var t, o = e.slice(0);
    PadSHA1Input(o);
    var n = {
        "A": 1732584193,
        "B": 4023233417,
        "C": 2562383102,
        "D": 271733878,
        "E": 3285377520
    };
    for (t = 0; t < o.length; t += 64) {
        SHA1RoundFunction(n, o, t)
    }
    var r = [];
    return wordToBytes(n.A, r, 0),
    wordToBytes(n.B, r, 4),
    wordToBytes(n.C, r, 8),
    wordToBytes(n.D, r, 12),
    wordToBytes(n.E, r, 16),
    r
}
function PadSHA1Input(e) {
    var t, o = e.length, n = o, r = o % 64, a = 55 > r ? 56 : 120;
    for (e[n++] = 128,
    t = r + 1; a > t; t++) {
        e[n++] = 0
    }
    var i = 8 * o;
    for (t = 1; 8 > t; t++) {
        e[n + 8 - t] = 255 & i,
        i >>>= 8
    }
}
function SHA1RoundFunction(e, t, o) {
    var n, r, a, i = 1518500249, l = 1859775393, s = 2400959708, c = 3395469782, d = [], f = e.A, u = e.B, p = e.C, g = e.D, v = e.E;
    for (r = 0,
    a = o; 16 > r; r++,
    a += 4) {
        d[r] = t[a] << 24 | t[a + 1] << 16 | t[a + 2] << 8 | t[a + 3] << 0
    }
    for (r = 16; 80 > r; r++) {
        d[r] = rotateLeft(d[r - 3] ^ d[r - 8] ^ d[r - 14] ^ d[r - 16], 1)
    }
    var P;
    for (n = 0; 20 > n; n++) {
        P = rotateLeft(f, 5) + (u & p | ~u & g) + v + d[n] + i & 4294967295,
        v = g,
        g = p,
        p = rotateLeft(u, 30),
        u = f,
        f = P
    }
    for (n = 20; 40 > n; n++) {
        P = rotateLeft(f, 5) + (u ^ p ^ g) + v + d[n] + l & 4294967295,
        v = g,
        g = p,
        p = rotateLeft(u, 30),
        u = f,
        f = P
    }
    for (n = 40; 60 > n; n++) {
        P = rotateLeft(f, 5) + (u & p | u & g | p & g) + v + d[n] + s & 4294967295,
        v = g,
        g = p,
        p = rotateLeft(u, 30),
        u = f,
        f = P
    }
    for (n = 60; 80 > n; n++) {
        P = rotateLeft(f, 5) + (u ^ p ^ g) + v + d[n] + c & 4294967295,
        v = g,
        g = p,
        p = rotateLeft(u, 30),
        u = f,
        f = P
    }
    e.A = e.A + f & 4294967295,
    e.B = e.B + u & 4294967295,
    e.C = e.C + p & 4294967295,
    e.D = e.D + g & 4294967295,
    e.E = e.E + v & 4294967295
}
function rotateLeft(e, t) {
    var o = e >>> 32 - t
      , n = (1 << 32 - t) - 1
      , r = e & n;
    return r << t | o
}
function wordToBytes(e, t, o) {
    var n;
    for (n = 3; n >= 0; n--) {
        t[o + n] = 255 & e,
        e >>>= 8
    }
}
function MGF(e, t) {
    if (t > 4096) {
        return null
    }
    var o = e.slice(0)
      , n = o.length;
    o[n++] = 0,
    o[n++] = 0,
    o[n++] = 0,
    o[n] = 0;
    for (var r = 0, a = []; a.length < t; ) {
        o[n] = r++,
        a = a.concat(SHA1(o))
    }
    return a.slice(0, t)
}
function duplicateMP(e) {
    var t = new JSMPnumber;
    return t.size = e.size,
    t.data = e.data.slice(0),
    t
}
function modularMultiply(e, t, o) {
    var n = multiplyMP(e, t)
      , r = divideMP(n, o);
    return r.r
}
function multiplyMP(e, t) {
    var o = new JSMPnumber;
    o.size = e.size + t.size;
    var n, r;
    for (n = 0; n < o.size; n++) {
        o.data[n] = 0
    }
    var a = e.data
      , i = t.data
      , l = o.data;
    if (e == t) {
        for (n = 0; n < e.size; n++) {
            l[2 * n] += a[n] * a[n]
        }
        for (n = 1; n < e.size; n++) {
            for (r = 0; n > r; r++) {
                l[n + r] += 2 * a[n] * a[r]
            }
        }
    } else {
        for (n = 0; n < e.size; n++) {
            for (r = 0; r < t.size; r++) {
                l[n + r] += a[n] * i[r]
            }
        }
    }
    return normalizeJSMP(o),
    o
}
function removeLeadingZeroes(e) {
    for (var t = e.size - 1; t > 0 && 0 == e.data[t--]; ) {
        e.size--
    }
}
function mpToByteArray(e) {
    var t = []
      , o = 0
      , n = e.size;
    for (o = 0; n > o; o++) {
        t[2 * o] = 255 & e.data[o];
        var r = e.data[o] >>> 8;
        t[2 * o + 1] = r
    }
    return t
}
function multiplyAndSubtract(e, t, o, n) {
    var r, a = e.data.slice(0), i = 0, l = e.data;
    for (r = 0; r < o.size; r++) {
        var s = i + o.data[r] * t;
        i = s >>> 16,
        s -= 65536 * i,
        s > l[r + n] ? (l[r + n] += 65536 - s,
        i++) : l[r + n] -= s
    }
    return i > 0 && (l[r + n] -= i),
    l[r + n] < 0 ? (e.data = a.slice(0),
    -1) : 1
}
function normalizeJSMP(e) {
    var t, o, n, r, a;
    for (n = e.size,
    o = 0,
    t = 0; n > t; t++) {
        r = e.data[t],
        r += o,
        a = r,
        o = Math.floor(r / 65536),
        r -= 65536 * o,
        e.data[t] = r
    }
}
function divideMP(e, t) {
    var o = e.size
      , n = t.size
      , r = t.data[n - 1]
      , a = t.data[n - 1] + t.data[n - 2] / 65536
      , i = new JSMPnumber;
    i.size = o - n + 1,
    e.data[o] = 0;
    for (var l = o - 1; l >= n - 1; l--) {
        var s = l - n + 1
          , c = Math.floor((65536 * e.data[l + 1] + e.data[l]) / a);
        if (c > 0) {
            var d = multiplyAndSubtract(e, c, t, s);
            for (0 > d && (c--,
            multiplyAndSubtract(e, c, t, s)); d > 0 && e.data[l] >= r; ) {
                d = multiplyAndSubtract(e, 1, t, s),
                d > 0 && c++
            }
        }
        i.data[s] = c
    }
    removeLeadingZeroes(e);
    var f = {
        "q": i,
        "r": e
    };
    return f
}
function modularExp(e, t, o) {
    for (var n = [], r = 0; t > 0; ) {
        n[r] = 1 & t,
        t >>>= 1,
        r++
    }
    for (var a = duplicateMP(e), i = r - 2; i >= 0; i--) {
        a = modularMultiply(a, a, o),
        1 == n[i] && (a = modularMultiply(a, e, o))
    }
    return a
}
function byteArrayToMP(e) {
    var t = new JSMPnumber
      , o = 0
      , n = e.length
      , r = n >> 1;
    for (o = 0; r > o; o++) {
        t.data[o] = e[2 * o] + (e[1 + 2 * o] << 8)
    }
    return n % 2 && (t.data[o++] = e[n - 1]),
    t.size = o,
    t
}
function XORarrays(e, t) {
    if (e.length != t.length) {
        return null
    }
    for (var o = [], n = e.length, r = 0; n > r; r++) {
        o[r] = e[r] ^ t[r]
    }
    return o
}
function RSAEncrypt(e, t) {
    for (var o = [], n = 42, r = 2 * t.n.size - n, a = 0; a < e.length; a += r) {
        if (a + r >= e.length) {
            var i = RSAEncryptBlock(e.slice(a), t, randomNum);
            i && (o = i.concat(o))
        } else {
            var i = RSAEncryptBlock(e.slice(a, a + r), t, randomNum);
            i && (o = i.concat(o))
        }
    }
    var l = byteArrayToBase64(o);
    return l
}
function mapByteToBase64(e) {
    return e >= 0 && 26 > e ? String.fromCharCode(65 + e) : e >= 26 && 52 > e ? String.fromCharCode(97 + e - 26) : e >= 52 && 62 > e ? String.fromCharCode(48 + e - 52) : 62 == e ? "+" : "/"
}
function base64Encode(e, t) {
    var o, n = "";
    for (o = t; 4 > o; o++) {
        e >>= 6
    }
    for (o = 0; t > o; o++) {
        n = mapByteToBase64(63 & e) + n,
        e >>= 6
    }
    return n
}
function byteArrayToBase64(e) {
    var t, o, n = e.length, r = "";
    for (t = n - 3; t >= 0; t -= 3) {
        o = e[t] | e[t + 1] << 8 | e[t + 2] << 16,
        r += base64Encode(o, 4)
    }
    var a = n % 3;
    for (o = 0,
    t += 2; t >= 0; t--) {
        o = o << 8 | e[t]
    }
    return 1 == a ? r = r + base64Encode(o << 16, 2) + "==" : 2 == a && (r = r + base64Encode(o << 8, 3) + "="),
    r
}
function RSAEncryptBlock(e, t, o) {
    var n = t.n
      , r = t.e
      , a = e.length
      , i = 2 * n.size
      , l = 42;
    if (a + l > i) {
        return null
    }
    applyPKCSv2Padding(e, i, o),
    e = e.reverse();
    var s = byteArrayToMP(e)
      , c = modularExp(s, r, n);
    c.size = n.size;
    var d = mpToByteArray(c);
    return d = d.reverse()
}
