let c1 = {
	solution: 'ali the kebab seller',
	location: 'pollnivneach',
	challenge: '399'
};

let c2 = {
	solution: 'capatain khaled',
	location: 'large eastern building piscarillius',
	challenge: '5'
};

let c3 = {
	solution: 'fairy queen',
	location: 'fairy hideout (certificate)',
	challenge: 'puzzle'
};

let c4 = {
	solution: 'drezel',
	location: 'paterdomus (cks)',
	challenge: '7'
};

let c5 = {
	solution: 'fairy godfather',
	location: 'zanaris throne room',
	challenge: '64'
};

let c6 = {
	solution: 'eluned',
	location: 'NE tyras camp/outside lleyta',
	challenge: '53000'
};

let c7 = {
	solution: 'prof. gracklebone',
	location: 'arceuus library (cis)',
	challenge: '9'
};

let c8 = {
	solution: 'traiborn',
	location: 'wizzy tower 2nd floor (dis)',
	challenge: '3150'
};

let c9 = {
	solution: 'otto godblessed',
	location: 'otto grotto',
	challenge: '3'
};

let c10 = {
	solution: 'king percival',
	location: 'fisher realm (bjr)',
	challenge: '5'
};

let c11 = {
	solution: 'adam',
	location: 'ironman tutor lumby castle',
	challenge: '666'
};

let c12 = {
	solution: 'weird old man',
	location: 'kalphite lair (biq)',
	challenge: '150'
};

let c13 = {
	solution: 'priate pete',
	location: 'dock NE ectofunctus',
	challenge: 'puzzle'
};

let valid_cipher_starts = ['b','e','g','h','o','q','u','v','z'];

const cipher = {
	'bmj uif lfcbc tfmmfs': c1,
	'ecrvckp mjcngf': c2,
	'gbjsz rvffo': c3,
	'guhcho': c4,
	'hckta iqfhcvjgt': c5,
	'ovexon': c6,
	'qspgfttps hsbdlmfcpof': c7,
	'usbjcpso': c8,
	'uzzu mujhrkyykj': c9,
	'vtyr apcntglw': c10,
	'zczl': c11,
	'zhlug rog pdq': c12,
	'zsbkdo zodo': c13
};

module.exports.cipher = {
	cipher: cipher,
	valid_start: valid_cipher_starts
};