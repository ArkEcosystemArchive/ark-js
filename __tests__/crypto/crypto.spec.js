import { Buffer } from 'buffer/'
import should from 'should'
import ark from '@/'
import ECPair from '@/crypto/ecpair'
import ecdsa from '@/crypto/ecdsa'
import ecurve from 'ecurve'

const curve = ecdsa.__curve

test('crypto.js', () => {
  var crypto = ark.crypto

  it('should be ok', () => {
    (crypto).should.be.ok
  })

  it('should be object', () => {
    (crypto).should.be.type('object')
  })

  it('should has properties', () => {
    var properties = ['getBytes', 'getHash', 'getId', 'getFee', 'sign', 'secondSign', 'getKeys', 'getAddress', 'verify', 'verifySecondSignature', 'fixedPoint']
    properties.forEach(function (property) {
      (crypto).should.have.property(property)
    })
  })

  test('#getBytes', () => {
    var getBytes = crypto.getBytes
    var bytes = null

    it('should be ok', () => {
      (getBytes).should.be.ok
    })

    it('should be a function', () => {
      (getBytes).should.be.type('function')
    })

    it('should return Buffer of simply transaction and buffer must be 202 length', () => {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: 'AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff',
        timestamp: 141738,
        asset: {},
        senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
        signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a',
        id: '13987348420913138422'
      }

      bytes = getBytes(transaction);
      (bytes).should.be.ok;
      (bytes).should.be.type('object');
      (bytes.length).should.be.equal(202)
    })

    it('should return Buffer of transaction with second signature and buffer must be 266 length', () => {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: 'AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff',
        timestamp: 141738,
        asset: {},
        senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
        signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a',
        signSignature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a',
        id: '13987348420913138422'
      }

      bytes = getBytes(transaction);
      (bytes).should.be.ok;
      (bytes).should.be.type('object');
      (bytes.length).should.be.equal(266)
    })
  })

  test('#getHash', () => {
    var getHash = crypto.getHash

    it('should be ok', () => {
      (getHash).should.be.ok
    })

    it('should be a function', () => {
      (getHash).should.be.type('function')
    })

    it('should return Buffer and Buffer most be 32 bytes length', () => {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: 'AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff',
        timestamp: 141738,
        asset: {},
        senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
        signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a'
      }

      var result = getHash(transaction);
      (result).should.be.ok;
      (result).should.be.type('object');
      (result.length).should.be.equal(32)
    })
  })

  test('#getId', () => {
    var getId = crypto.getId

    it('should be ok', () => {
      (getId).should.be.ok
    })

    it('should be a function', () => {
      (getId).should.be.type('function')
    })

    it('should return string id and be equal to 619fd7971db6f317fdee3675c862291c976d072a0a1782410e3a6f5309022491', () => {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: 'AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff',
        timestamp: 141738,
        asset: {},
        senderPublicKey: '5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09',
        signature: '618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a'
      }

      var id = getId(transaction);
      (id).should.be.type('string').and.equal('952e33b66c35a3805015657c008e73a0dee1efefd9af8c41adb59fe79745ccea')
    })
  })

  test('#getFee', () => {
    var getFee = crypto.getFee

    it('should be ok', () => {
      (getFee).should.be.ok
    })

    it('should be a function', () => {
      (getFee).should.be.type('function')
    })

    it('should return number', () => {
      var fee = getFee({amount: 100000, type: 0});
      (fee).should.be.type('number');
      (fee).should.be.not.NaN
    })

    it('should return 10000000', () => {
      var fee = getFee({amount: 100000, type: 0});
      (fee).should.be.type('number').and.equal(10000000)
    })

    it('should return 10000000000', () => {
      var fee = getFee({type: 1});
      (fee).should.be.type('number').and.equal(10000000000)
    })

    it('should be equal 1000000000000', () => {
      var fee = getFee({type: 2});
      (fee).should.be.type('number').and.equal(1000000000000)
    })

    it('should be equal 100000000', () => {
      var fee = getFee({type: 3});
      (fee).should.be.type('number').and.equal(100000000)
    })
  })

  test('fixedPoint', () => {
    var fixedPoint = crypto.fixedPoint

    it('should be ok', () => {
      (fixedPoint).should.be.ok
    })

    it('should be number', () => {
      (fixedPoint).should.be.type('number').and.not.NaN
    })

    it('should be equal 100000000', () => {
      (fixedPoint).should.be.equal(100000000)
    })
  })

  test('#sign', () => {
    var sign = crypto.sign

    it('should be ok', () => {
      (sign).should.be.ok
    })

    it('should be a function', () => {
      (sign).should.be.type('function')
    })
  })

  test('#secondSign', () => {
    var secondSign = crypto.secondSign

    it('should be ok', () => {
      (secondSign).should.be.ok
    })

    it('should be a function', () => {
      (secondSign).should.be.type('function')
    })
  })

  test('#getKeys', () => {
    var getKeys = crypto.getKeys

    it('should be ok', () => {
      (getKeys).should.be.ok
    })

    it('should be a function', () => {
      (getKeys).should.be.type('function')
    })

    it('should return two keys in hex', () => {
      var keys = getKeys('secret');

      (keys).should.be.ok;
      (keys).should.be.type('object');
      (keys).should.have.property('publicKey');
      (keys).should.have.property('privateKey');
      (keys.publicKey).should.be.type('string').and.match(() => {
        try {
          new Buffer(keys.publicKey, 'hex')
        } catch (e) {
          return false
        }

        return true
      });
      (keys.privateKey).should.be.type('string').and.match(() => {
        try {
          new Buffer(keys.privateKey, 'hex')
        } catch (e) {
          return false
        }

        return true
      })
    })
  })

  test('#getAddress', () => {
    var getAddress = crypto.getAddress

    it('should be ok', () => {
      (getAddress).should.be.ok
    })

    it('should be a function', () => {
      (getAddress).should.be.type('function')
    })

    it('should generate address by publicKey', () => {
      var keys = crypto.getKeys('secret')
      var address = getAddress(keys.publicKey);

      (address).should.be.ok;
      (address).should.be.type('string');
      (address).should.be.equal('AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff')
    })

    it('should generate address by publicKey - second test', () => {
      var keys = crypto.getKeys('secret second test to be sure it works correctly')
      var address = getAddress(keys.publicKey);

      (address).should.be.ok;
      (address).should.be.type('string');
      (address).should.be.equal('AQSqYnjmwj1GBL5twD4K9EBXDaTHZognox')
    })

    it('should generate the same address as ECPair.getAddress()', () => {
      var keys = crypto.getKeys('secret second test to be sure it works correctly')
      var address = getAddress(keys.publicKey)

      var Q = ecurve.Point.decodeFrom(curve, new Buffer(keys.publicKey, 'hex'))
      var keyPair = new ECPair(null, Q);

      (address).should.be.equal(keyPair.getAddress())
    })
  })

  test('#verify', () => {
    var verify = crypto.verify

    it('should be ok', () => {
      (verify).should.be.ok
    })

    it('should be function', () => {
      (verify).should.be.type('function')
    })
  })

  test('#verifySecondSignature', () => {
    var verifySecondSignature = crypto.verifySecondSignature

    it('should be ok', () => {
      (verifySecondSignature).should.be.ok
    })

    it('should be function', () => {
      (verifySecondSignature).should.be.type('function')
    })
  })
})

test('different networks', () => {
  it('validate address on tesnet should be ok', () => {
    ark.crypto.setNetworkVersion(0x52)
    ark.crypto.getNetworkVersion().should.equal(0x52)
    var validate = ark.crypto.validateAddress('a6fpb1BJZq4otWiVsBcuLG1ZGs5WsqqQtH');
    (validate).should.equal(true)
    ark.crypto.setNetworkVersion(0x17)
    ark.crypto.getNetworkVersion().should.equal(0x17)
  })
})

test('delegate.js', () => {
  var delegate = ark.delegate

  it('should be ok', () => {
    (delegate).should.be.ok
  })

  it('should be function', () => {
    (delegate).should.be.type('object')
  })

  it('should have property createDelegate', () => {
    (delegate).should.have.property('createDelegate')
  })

  test('#createDelegate', () => {
    var createDelegate = delegate.createDelegate
    var trs = null

    it('should be ok', () => {
      (createDelegate).should.be.ok
    })

    it('should be function', () => {
      (createDelegate).should.be.type('function')
    })

    it('should create delegate', () => {
      trs = createDelegate('secret', 'delegate', 'secret 2')
    })

    it('should create transaction with fee override', () => {
      const feeOverride = 1000000
      trs = createDelegate('secret', 'delegate', 'second secret', feeOverride);
      (trs).should.be.ok;
      (trs.fee).should.equal(feeOverride)
    })

    it('should fail to create transaction with invalid fee override', function (done) {
      const feeOverride = '1000000'
      try {
        trs = createDelegate('secret', 'delegate', 'second secret', feeOverride)
        should.fail()
      } catch (error) {
        done()
      }
    })

    it('should be deserialised correctly', () => {
      var deserialisedTx = ark.crypto.fromBytes(ark.crypto.getBytes(trs).toString('hex'))
      delete deserialisedTx.vendorFieldHex
      var keys = Object.keys(deserialisedTx)
      for (key in keys) {
        if (keys[key] == 'asset') {
          deserialisedTx.asset.delegate.username.should.equal(trs.asset.delegate.username)
        } else {
          deserialisedTx[keys[key]].should.equal(trs[keys[key]])
        }
      }
    })

    test('returned delegate', () => {
      var keys = ark.crypto.getKeys('secret')
      var secondKeys = ark.crypto.getKeys('secret 2')

      it('should be ok', () => {
        (trs).should.be.ok
      })

      it('should be object', () => {
        (trs).should.be.type('object')
      })

      it('should have recipientId equal null', () => {
        (trs).should.have.property('recipientId').and.type('object').and.be.empty
      })

      it('shoud have amount equal 0', () => {
        (trs).should.have.property('amount').and.type('number').and.equal(0)
      })

      it('should have type equal 2', () => {
        (trs).should.have.property('type').and.type('number').and.equal(2)
      })

      // it("should have id equal 11636400490162225218", () => {
      // 	(trs).should.have.property("id").and.type("string").and.equal('11636400490162225218');
      // });

      it('should have timestamp number', () => {
        (trs).should.have.property('timestamp').and.type('number')
      })

      it('should have senderPublicKey in hex', () => {
        (trs).should.have.property('senderPublicKey').and.type('string').and.match(() => {
          try {
            new Buffer(trs.senderPublicKey, 'hex')
          } catch (e) {
            return false
          }

          return true
        }).and.equal(keys.publicKey)
      })

      it('should have signature in hex', () => {
        (trs).should.have.property('signature').and.type('string').and.match(() => {
          try {
            new Buffer(trs.signature, 'hex')
          } catch (e) {
            return false
          }

          return true
        })
      })

      it('should have second signature in hex', () => {
        (trs).should.have.property('signSignature').and.type('string').and.match(() => {
          try {
            new Buffer(trs.signSignature, 'hex')
          } catch (e) {
            return false
          }

          return true
        })
      })

      it('should have delegate asset', () => {
        (trs).should.have.property('asset').and.type('object');
        (trs.asset).should.have.have.property('delegate')
      })

      it('should be signed correctly', () => {
        var result = ark.crypto.verify(trs);
        (result).should.be.ok
      })

      it('should be second signed correctly', () => {
        var result = ark.crypto.verifySecondSignature(trs, secondKeys.publicKey);
        (result).should.be.ok
      })

      it('should not be signed correctly now', () => {
        trs.amount = 100
        var result = ark.crypto.verify(trs);
        (result).should.be.not.ok
      })

      it('should not be second signed correctly now', () => {
        trs.amount = 100
        var result = ark.crypto.verifySecondSignature(trs, secondKeys.publicKey);
        (result).should.be.not.ok
      })

      test('delegate asset', () => {
        it('should be ok', () => {
          (trs.asset.delegate).should.be.ok
        })

        it('should be object', () => {
          (trs.asset.delegate).should.be.type('object')
        })

        it('should be have property username', () => {
          (trs.asset.delegate).should.have.property('username').and.be.type('string').and.equal('delegate')
        })
      })
    })
  })
})
