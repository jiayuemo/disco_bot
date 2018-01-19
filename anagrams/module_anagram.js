const a = require('./anagram_a');
const b = require('./anagram_b');
const c = require('./anagram_c');
const d = require('./anagram_d');
const e = require('./anagram_e');
const f = require('./anagram_f');
const g = require('./anagram_g');
const h = require('./anagram_h');
const i = require('./anagram_i');
const k = require('./anagram_k');
const l = require('./anagram_l');
const m = require('./anagram_m');
const n = require('./anagram_n');
const o = require('./anagram_o');
const p = require('./anagram_p');
const q = require('./anagram_q');
const r = require('./anagram_r');
const s = require('./anagram_s');
const t = require('./anagram_t');
const u = require('./anagram_u');
const v = require('./anagram_v');
const w = require('./anagram_w');
const y = require('./anagram_y');

let valid_anagram_starts = ['a','b','c','d','e','f','g','h','i',
							'k','l','m','n','o','p','q','r','s','t','u','v','w','y'];

const anagram = {
	'a': a,
	'b': b,
	'c': c,
	'd': d,
	'e': e,
	'f': f,
	'g': g,
	'h': h,
	'i': i,
	'k': k,
	'l': l,
	'm': m,
	'o': o,
	'p': p,
	'q': q,
	'r': r,
	's': s,
	't': t,
	'u': u,
	'v': v,
	'w': w,
	'y': y
}

// modularity export the anagram so node can require it
module.exports.anagram = {
	anagram: anagram,
	valid_start: valid_anagram_starts
};