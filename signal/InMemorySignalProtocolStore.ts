import util from "./helpers";

declare global {
  interface Window {
    libsignal: any;
  }
}

let libsignal: any;
if(typeof window !== "undefined") {
  libsignal = window.libsignal;
}

function SignalProtocolStore() {
  // @ts-ignore
  this.store = {};
}

SignalProtocolStore.prototype = {
  Direction: {
    SENDING: 1,
    RECEIVING: 2,
  },

  getIdentityKeyPair: function () {
    return Promise.resolve(this.get('identityKey'));
  },
  getLocalRegistrationId: function () {
    return Promise.resolve(this.get('registrationId'));
  },
  put: function (key: string | number | null | undefined, value: null | undefined) {
    if(key === undefined || value === undefined || key === null || value === null)
      throw new Error("Tried to store undefined/null");
    this.store[key] = value;
  },
  get: function (key: string | null | undefined, defaultValue: any) {
    if(key === null || key === undefined)
      throw new Error("Tried to get value for undefined/null key");
    if(key in this.store) {
      return this.store[key];
    } else {
      return defaultValue;
    }
  },
  remove: function (key: string | number | null | undefined) {
    if(key === null || key === undefined)
      throw new Error("Tried to remove value for undefined/null key");
    delete this.store[key];
  },

  isTrustedIdentity: function (identifier: string | null | undefined, identityKey: any, direction: any) {
    if(identifier === null || identifier === undefined) {
      throw new Error("tried to check identity key for undefined/null key");
    }
    if(!(identityKey instanceof ArrayBuffer)) {
      throw new Error("Expected identityKey to be an ArrayBuffer");
    }
    var trusted = this.get('identityKey' + identifier);
    if(trusted === undefined) {
      return Promise.resolve(true);
    }
    return Promise.resolve(util.toString(identityKey) === util.toString(trusted));
  },
  loadIdentityKey: function (identifier: string | null | undefined) {
    if(identifier === null || identifier === undefined)
      throw new Error("Tried to get identity key for undefined/null key");
    return Promise.resolve(this.get('identityKey' + identifier));
  },
  saveIdentity: function (identifier: null | undefined, identityKey: any) {
    if(identifier === null || identifier === undefined)
      throw new Error("Tried to put identity key for undefined/null key");

    var address = new libsignal.SignalProtocolAddress.fromString(identifier);

    var existing = this.get('identityKey' + address.getName());
    this.put('identityKey' + address.getName(), identityKey);

    if(existing && util.toString(identityKey) !== util.toString(existing)) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }

  },

  /* Returns a prekeypair object or undefined */
  loadPreKey: function (keyId: string) {
    var res = this.get('25519KeypreKey' + keyId);
    if(res !== undefined) {
      res = { pubKey: res.pubKey, privKey: res.privKey };
    }
    return Promise.resolve(res);
  },
  storePreKey: function (keyId: string, keyPair: any) {
    return Promise.resolve(this.put('25519KeypreKey' + keyId, keyPair));
  },
  removePreKey: function (keyId: string) {
    return Promise.resolve(this.remove('25519KeypreKey' + keyId));
  },

  /* Returns a signed keypair object or undefined */
  loadSignedPreKey: function (keyId: string) {
    var res = this.get('25519KeysignedKey' + keyId);
    if(res !== undefined) {
      res = { pubKey: res.pubKey, privKey: res.privKey };
    }
    return Promise.resolve(res);
  },
  storeSignedPreKey: function (keyId: string, keyPair: any) {
    return Promise.resolve(this.put('25519KeysignedKey' + keyId, keyPair));
  },
  removeSignedPreKey: function (keyId: string) {
    return Promise.resolve(this.remove('25519KeysignedKey' + keyId));
  },

  loadSession: function (identifier: string) {
    return Promise.resolve(this.get('session' + identifier));
  },
  storeSession: function (identifier: string, record: any) {
    return Promise.resolve(this.put('session' + identifier, record));
  },
  removeSession: function (identifier: string) {
    return Promise.resolve(this.remove('session' + identifier));
  },
  removeAllSessions: function (identifier: string) {
    for(var id in this.store) {
      if(id.startsWith('session' + identifier)) {
        delete this.store[id];
      }
    }
    return Promise.resolve();
  },

  /* Stores and loads a session cipher */
  storeSessionCipher(identifier: string, cipher: any) {
    this.put('cipher' + identifier, cipher);
  },
  loadSessionCipher(identifier: string) {
    var cipher = this.get('cipher' + identifier);

    if(cipher == undefined) {
      return null;
    } else {
      return cipher;
    }
  }
};

export default SignalProtocolStore;