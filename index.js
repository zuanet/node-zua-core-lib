'use strict';


const secp256k1 = require('secp256k1-wasm');
const blake2b = require('blake2b-wasm');

var zuacore = module.exports;

zuacore.secp256k1 = secp256k1;

// module information
zuacore.version = 'v' + require('./package.json').version;
zuacore.versionGuard = function(version) {
	if (version !== undefined) {
		var message = 'More than one instance of zuacore-lib found. ' +
			'Please make sure to require zuacore-lib and check that submodules do' +
			' not also include their own zuacore-lib dependency.';
		throw new Error(message);
	}
};
zuacore.versionGuard(global._zuacoreLibVersion);
global._zuacoreLibVersion = zuacore.version;


const wasmModulesLoadStatus = new Map();
zuacore.wasmModulesLoadStatus = wasmModulesLoadStatus;
wasmModulesLoadStatus.set("blake2b", false);
wasmModulesLoadStatus.set("secp256k1", false);

const setWasmLoadStatus = (mod, loaded) => {
	//console.log("setWasmLoadStatus:", mod, loaded)
	wasmModulesLoadStatus.set(mod, loaded);
	let allLoaded = true;
	wasmModulesLoadStatus.forEach((loaded, mod) => {
		//console.log("wasmModulesLoadStatus:", mod, loaded)
		if (!loaded)
			allLoaded = false;
	})

	if (allLoaded)
		zuacore.ready();
}


blake2b.ready(() => {
	setWasmLoadStatus("blake2b", true);
})

secp256k1.onRuntimeInitialized = () => {
	//console.log("onRuntimeInitialized")
	setTimeout(() => {
		setWasmLoadStatus("secp256k1", true);
	}, 1);
}

secp256k1.onAbort = (error) => {
	console.log("secp256k1:onAbort:", error)
}
const deferred = ()=>{
	let methods = {};
	let promise = new Promise((resolve, reject)=>{
		methods = {resolve, reject};
	})
	Object.assign(promise, methods);
	return promise;
}
const readySignal = deferred();

zuacore.ready = ()=>{
	readySignal.resolve(true);
}
zuacore.initRuntime = ()=>{
	return readySignal;
}


// crypto
zuacore.crypto = {};
zuacore.crypto.BN = require('./lib/crypto/bn');
zuacore.crypto.ECDSA = require('./lib/crypto/ecdsa');
zuacore.crypto.Schnorr = require('./lib/crypto/schnorr');
zuacore.crypto.Hash = require('./lib/crypto/hash');
zuacore.crypto.Random = require('./lib/crypto/random');
zuacore.crypto.Point = require('./lib/crypto/point');
zuacore.crypto.Signature = require('./lib/crypto/signature');

// encoding
zuacore.encoding = {};
zuacore.encoding.Base58 = require('./lib/encoding/base58');
zuacore.encoding.Base58Check = require('./lib/encoding/base58check');
zuacore.encoding.BufferReader = require('./lib/encoding/bufferreader');
zuacore.encoding.BufferWriter = require('./lib/encoding/bufferwriter');
zuacore.encoding.Varint = require('./lib/encoding/varint');

// utilities
zuacore.util = {};
zuacore.util.buffer = require('./lib/util/buffer');
zuacore.util.js = require('./lib/util/js');
zuacore.util.preconditions = require('./lib/util/preconditions');
zuacore.util.base32 = require('./lib/util/base32');
zuacore.util.convertBits = require('./lib/util/convertBits');
zuacore.setDebugLevel = (level)=>{
	zuacore.util.js.debugLevel = level;
}

// errors thrown by the library
zuacore.errors = require('./lib/errors');

// main bitcoin library
zuacore.Address = require('./lib/address');
zuacore.Block = require('./lib/block');
zuacore.MerkleBlock = require('./lib/block/merkleblock');
zuacore.BlockHeader = require('./lib/block/blockheader');
zuacore.HDPrivateKey = require('./lib/hdprivatekey.js');
zuacore.HDPublicKey = require('./lib/hdpublickey.js');
zuacore.Networks = require('./lib/networks');
zuacore.Opcode = require('./lib/opcode');
zuacore.PrivateKey = require('./lib/privatekey');
zuacore.PublicKey = require('./lib/publickey');
zuacore.Script = require('./lib/script');
zuacore.Transaction = require('./lib/transaction');
zuacore.URI = require('./lib/uri');
zuacore.Unit = require('./lib/unit');

// dependencies, subject to change
zuacore.deps = {};
zuacore.deps.bnjs = require('bn.js');
zuacore.deps.bs58 = require('bs58');
zuacore.deps.Buffer = Buffer;
zuacore.deps.elliptic = require('elliptic');
zuacore.deps._ = require('lodash');

// Internal usage, exposed for testing/advanced tweaking
zuacore.Transaction.sighash = require('./lib/transaction/sighash');
