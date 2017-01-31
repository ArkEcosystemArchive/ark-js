module.exports = {
  ark: {
    messagePrefix: '\x18Ark Signed Message:\n',
    bip32: {
      public: 0x2bf4968, // base58 will have a prefix 'apub'
      private: 0x2bf4530 // base58Priv will have a prefix 'apriv'
    },
    pubKeyHash: 0x17, // Addresses will begin with 'A'
    wif: 0xaa // Network prefix for wif generation
  },
  testnet: {
    messagePrefix: '\x18Ark Testnet Signed Message:\n',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x52, // Addresses will begin with 'a'
    wif: 0xba // Network prefix for wif generation
  },
  bitcoin: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    wif: 0x80
  }
}
