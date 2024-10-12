declare module '@zua/core-lib' {

	function initRuntime(): Promise;
	function setDebugLevel(level:number):void;

	export namespace encoding {
		export class BufferReader {
			constructor(buf: Buffer);
			readReverse(): Buffer;
		}
		export class BufferWriter {
			write(buf: Buffer): BufferWriter;
			writeInt32LE(n: number): BufferWriter;
			toBuffer(): Buffer;
		}
	}

	export namespace util {
		export namespace preconditions {
			function checkArgument(condition: boolean, argumentName ? : string, message ? : string, docsPath ? : any): boolean;
		}
	}

	export namespace crypto {
		class BN {
			static fromNumber(n: number): BN;
			static fromBuffer(buf: Buffer): BN;
		}

		namespace ECDSA {
			function sign(message: Buffer, key: PrivateKey): Signature;

			function verify(
				hashbuf: Buffer,
				sig: Signature,
				pubkey: PublicKey,
				endian ? : 'little'
			): boolean;
		}

		namespace Hash {
			function sha1(buffer: Buffer): Buffer;

			function sha256(buffer: Buffer): Buffer;

			function sha256sha256(buffer: Buffer): Buffer;

			function sha256ripemd160(buffer: Buffer): Buffer;

			function sha512(buffer: Buffer): Buffer;

			function ripemd160(buffer: Buffer): Buffer;

			function sha256hmac(data: Buffer, key: Buffer): Buffer;

			function sha512hmac(data: Buffer, key: Buffer): Buffer;
		}

		namespace Random {
			function getRandomBuffer(size: number): Buffer;
		}

		namespace Point {}

		class Signature {
			static fromDER(sig: Buffer): Signature;
			static fromString(data: string): Signature;
			SIGHASH_ALL: number;
			static SIGHASH_ALL: number;
			static SIGHASH_NONE: number;
			static SIGHASH_SINGLE: number;
			static SIGHASH_FORKID: number;
			static SIGHASH_ANYONECANPAY: number;
			toString(): string;
			compressed: boolean;
			toBuffer(): Buffer;
		}

		namespace Schnorr {
			function sign(hashbuf: Buffer, privateKey: PrivateKey): Signature;
		}
	}

	export class Script {
		constructor(script ? : Script);
		static buildPublicKeyHashIn(publicKey: PublicKey, signature: Signature, sigtype): Script;
		static empty(): Script;
		inspect():string;
		toBuffer():Buffer;
		getSignatureOperationsCount():number
	}

	export namespace Transaction {
		
		static class sighash {
			static sign(transaction, privateKey, sighashType, inputIndex, subscript, satoshisBN, flags, signingMethod);
			static sighash(transaction, sighashType, inputNumber, subscript, satoshisBN, flags): Buffer;
		}
		class UnspentOutput {
			static fromObject(o: object): UnspentOutput;

			readonly address: Address;
			readonly txId: string;
			readonly outputIndex: number;
			readonly script: Script;
			readonly satoshis: number;

			constructor(data: object);

			inspect(): string;
			toObject(): this;
			toString(): string;
		}

		class Output {
			readonly script: Script;
			readonly satoshis: number;

			constructor(data: object);

			setScript(script: Script | string | Buffer): this;
			inspect(): string;
			toObject(): object;
		}

		class Input {
			readonly prevTxId: Buffer;
			readonly outputIndex: number;
			sequenceNumber: number;
			readonly script: Script;
			readonly output ? : Output;
		}

		class Signature {

		}
	}

	export class Transaction {
		static MassPerSigOp:number;
		static EstimatedStandaloneMassWithoutInputs:number;
		static MassPerTxByte:number;
		inputs: Transaction.Input[];
		outputs: Transaction.Output[];
		readonly id: string;
		readonly hash: string;
		nid: string;

		constructor(serialized ? : any);

		from(utxos: Transaction.UnspentOutput[]): this;
		to(address: Address[] | Address | string, amount: number): this;
		change(address: Address | string): this;
		fee(amount: number): this;
		setVersion(version: number): this;
		feePerKb(amount: number): this;
		sign(privateKey: PrivateKey|PrivateKey[] | string|string[], sigtype:number, signingMethod:string|undefined): this;
		applySignature(sig: crypto.Signature): this;
		addInput(input: Transaction.Input): this;
		addOutput(output: Transaction.Output): this;
		addData(value: Buffer): this;
		lockUntilDate(time: Date | number): this;
		lockUntilBlockHeight(height: number): this;

		getMassAndSize():{txSize:number, mass:number};

		hasWitnesses(): boolean;
		getFee(): number;
		getChangeOutput(): Transaction.Output | null;
		getLockTime(): Date | number;
		getMass(): number;

		verify(): string | boolean;
		isCoinbase(): boolean;

		enableRBF(): this;
		isRBF(): boolean;

		inspect(): string;
		serialize(): string;
		version: number;
		nLockTime: number;
		fromBufferReader(reader: BufferReader): Transaction;
		toBuffer(skipInputs?:boolean): Buffer;
		static shallowCopy(tx: Transaction): Transaction;
	}

	export class Block {
		hash: string;
		height: number;
		transactions: Transaction[];
		header: {
			time: number;
			prevHash: string;
		};

		constructor(data: Buffer | object);
	}

	export class PrivateKey {
		readonly publicKey: PublicKey;
		readonly network: Networks.Network;

		toAddress(): Address;
		toAddress(network: string): Address;
		toPublicKey(): PublicKey;
		toString(): string;
		toObject(): object;
		toJSON(): object;
		toWIF(): string;
		_pubkey: PublicKey;

		constructor(key ? : string, network ? : Networks.Network);
	}

	export class PublicKey {
		constructor(source: string, extra ? : {
			compressed ? : boolean,
			network ? : string
		});

		static fromPrivateKey(privateKey: PrivateKey): PublicKey;
		toAddress(network ? : string): Address;

		toBuffer(): Buffer;
		toDER(): Buffer;
	}

	export class HDPrivateKey {
		readonly hdPublicKey: HDPublicKey;

		constructor(data ? : string | Buffer | object);

		derive(arg: string | number, hardened ? : boolean): HDPrivateKey;
		deriveChild(arg: string | number, hardened ? : boolean): HDPrivateKey;
		deriveNonCompliantChild(arg: string | number, hardened ? : boolean): HDPrivateKey;
		privateKey: PrivateKey;

		toString(): string;
		toObject(): object;
		toJSON(): object;
	}

	export class HDPublicKey {
		readonly xpubkey: Buffer;
		readonly network: Networks.Network;
		readonly depth: number;
		readonly publicKey: PublicKey;
		readonly fingerPrint: Buffer;

		constructor(arg: string | Buffer | object);

		derive(arg: string | number, hardened ? : boolean): HDPublicKey;
		deriveChild(arg: string | number, hardened ? : boolean): HDPublicKey;

		toString(): string;
	}

	//   export namespace Script {
	//     const types: {
	//       DATA_OUT: string;
	//     };
	//     function buildMultisigOut(publicKeys: PublicKey[], threshold: number, opts: object): Script;
	//     function buildWitnessMultisigOutFromScript(script: Script): Script;
	//     function buildMultisigIn(
	//       pubkeys: PublicKey[],
	//       threshold: number,
	//       signatures: Buffer[],
	//       opts: object
	//     ): Script;
	//     function buildP2SHMultisigIn(
	//       pubkeys: PublicKey[],
	//       threshold: number,
	//       signatures: Buffer[],
	//       opts: object
	//     ): Script;
	//     function buildPublicKeyHashOut(address: Address): Script;
	//     function buildPublicKeyOut(pubkey: PublicKey): Script;
	//     function buildDataOut(data: string | Buffer, encoding?: string): Script;
	//     function buildScriptHashOut(script: Script): Script;
	//     function buildPublicKeyIn(signature: crypto.Signature | Buffer, sigtype: number): Script;
	//     function buildPublicKeyHashIn(
	//       publicKey: PublicKey,
	//       signature: crypto.Signature | Buffer,
	//       sigtype: number
	//     ): Script;

	//     function fromAddress(address: string | Address): Script;

	//     function empty(): Script;
	//   }

	//   export class Script {
	//     constructor(data: string | object);

	//     set(obj: object): this;

	//     toBuffer(): Buffer;
	//     toASM(): string;
	//     toString(): string;
	//     toHex(): string;

	//     isPublicKeyHashOut(): boolean;
	//     isPublicKeyHashIn(): boolean;

	//     getPublicKey(): Buffer;
	//     getPublicKeyHash(): Buffer;

	//     isPublicKeyOut(): boolean;
	//     isPublicKeyIn(): boolean;

	//     isScriptHashOut(): boolean;
	//     isWitnessScriptHashOut(): boolean;
	//     isWitnessPublicKeyHashOut(): boolean;
	//     isWitnessProgram(): boolean;
	//     isScriptHashIn(): boolean;
	//     isMultisigOut(): boolean;
	//     isMultisigIn(): boolean;
	//     isDataOut(): boolean;

	//     getData(): Buffer;
	//     isPushOnly(): boolean;

	//     classify(): string;
	//     classifyInput(): string;
	//     classifyOutput(): string;

	//     isStandard(): boolean;

	//     prepend(obj: any): this;
	//     add(obj: any): this;

	//     hasCodeseparators(): boolean;
	//     removeCodeseparators(): this;

	//     equals(script: Script): boolean;

	//     getAddressInfo(): Address | boolean;
	//     findAndDelete(script: Script): this;
	//     checkMinimalPush(i: number): boolean;
	//     getSignatureOperationsCount(accurate: boolean): number;

	//     toAddress(): Address;
	//   }

	//   export class Message {
	//     constructor(message: string);

	//     magicHash(): Buffer;
	//     sign(privateKey: PrivateKey): string;
	//     verify(bitcoinAddress: Address | string, signatureString: string): boolean;
	//     fromString(str: string): Message;
	//     fromJSON(json: string): Message;
	//     toObject(): { message: string };
	//     toJSON(): string;
	//     toString(): string;
	//     inspect(): string;
	//   }

	//   export interface Util {
	//     readonly buffer: {
	//       reverse(a: any): any;
	//     };
	//   }

	export namespace Networks {
		interface Network {
			readonly name: string;
			readonly alias: string;
		}

		const livenet: Network;
		const mainnet: Network;
		const testnet: Network;

		function add(data: any): Network;

		function remove(network: Network): void;

		function get(args: string | number | Network, keys: string | string[]): Network;
	}

	export class Address {
		readonly hashBuffer: Buffer;
		readonly network: Networks.Network;
		readonly type: string;

		constructor(
			data: Buffer | Uint8Array | string | object,
			network ? : Networks.Network,
			type ? : string
		);
	}

	//   export class Unit {
	//     static fromBTC(amount: number): Unit;
	//     static fromMilis(amount: number): Unit;
	//     static fromBits(amount: number): Unit;
	//     static fromSatoshis(amount: number): Unit;

	//     constructor(amount: number, unitPreference: string);

	//     toBTC(): number;
	//     toMilis(): number;
	//     toBits(): number;
	//     toSatoshis(): number;
	//   }
	// }
}