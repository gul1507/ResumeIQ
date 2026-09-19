const crypto = require('node:crypto');
if (crypto.webcrypto) {
  if (!crypto.getRandomValues) {
    crypto.getRandomValues = crypto.webcrypto.getRandomValues.bind(crypto.webcrypto);
  }
}
const legacyCrypto = require('crypto');
if (legacyCrypto.webcrypto) {
  if (!legacyCrypto.getRandomValues) {
    legacyCrypto.getRandomValues = legacyCrypto.webcrypto.getRandomValues.bind(legacyCrypto.webcrypto);
  }
}
if (!globalThis.crypto) {
  globalThis.crypto = crypto.webcrypto || crypto;
}
if (globalThis.crypto && !globalThis.crypto.getRandomValues && crypto.webcrypto) {
  globalThis.crypto.getRandomValues = crypto.webcrypto.getRandomValues.bind(crypto.webcrypto);
}
