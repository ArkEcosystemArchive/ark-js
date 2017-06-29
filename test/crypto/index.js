var Buffer = require("buffer/").Buffer;
var should = require("should");
var ark = require("../../index.js");
var ECPair = require('../../lib/ecpair');

var ecdsa = require('../../lib/ecdsa')
var ecurve = require('ecurve')
var curve = ecdsa.__curve

describe("crypto.js", function () {

  var crypto = ark.crypto;

  it("should be ok", function () {
    (crypto).should.be.ok;
  });

  it("should be object", function () {
    (crypto).should.be.type("object");
  });

  it("should has properties", function () {
    var properties = ["getBytes", "getHash", "getId", "getFee", "sign", "secondSign", "getKeys", "getAddress", "verify", "verifySecondSignature", "fixedPoint"];
    properties.forEach(function (property) {
      (crypto).should.have.property(property);
    });
  });

  describe("#getBytes", function () {
    var getBytes = crypto.getBytes;
    var bytes = null;

    it("should be ok", function () {
      (getBytes).should.be.ok;
    });

    it("should be a function", function () {
      (getBytes).should.be.type("function");
    });

    it("should return Buffer of simply transaction and buffer must be 202 length", function () {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: "AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff",
        timestamp: 141738,
        asset: {},
        senderPublicKey: "5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09",
        signature: "618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a",
        id: "13987348420913138422"
      };

      bytes = getBytes(transaction);
      (bytes).should.be.ok;
      (bytes).should.be.type("object");
      (bytes.length).should.be.equal(202);
    });

    it("should return Buffer of transaction with second signature and buffer most be 266 length", function () {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: "AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff",
        timestamp: 141738,
        asset: {},
        senderPublicKey: "5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09",
        signature: "618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a",
        signSignature: "618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a",
        id: "13987348420913138422"
      };

      bytes = getBytes(transaction);
      (bytes).should.be.ok;
      (bytes).should.be.type("object");
      (bytes.length).should.be.equal(266);
    });
  });

  describe("#getHash", function () {
    var getHash = crypto.getHash;

    it("should be ok", function () {
      (getHash).should.be.ok;
    });

    it("should be a function", function () {
      (getHash).should.be.type("function");
    })

    it("should return Buffer and Buffer most be 32 bytes length", function () {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: "AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff",
        timestamp: 141738,
        asset: {},
        senderPublicKey: "5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09",
        signature: "618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a",
      };

      var result = getHash(transaction);
      (result).should.be.ok;
      (result).should.be.type("object");
      (result.length).should.be.equal(32);
    });
  });

  describe("#getId", function () {
    var getId = crypto.getId;

    it("should be ok", function () {
      (getId).should.be.ok;
    });

    it("should be a function", function () {
      (getId).should.be.type("function");
    });

    it("should return string id and be equal to 619fd7971db6f317fdee3675c862291c976d072a0a1782410e3a6f5309022491", function () {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: "AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff",
        timestamp: 141738,
        asset: {},
        senderPublicKey: "5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09",
        signature: "618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a"
      };

      var id = getId(transaction);
      (id).should.be.type("string").and.equal("952e33b66c35a3805015657c008e73a0dee1efefd9af8c41adb59fe79745ccea");
    });
  });

  describe("#getFee", function () {
    var getFee = crypto.getFee;

    it("should be ok", function () {
      (getFee).should.be.ok;
    })

    it("should be a function", function () {
      (getFee).should.be.type("function");
    });

    it("should return number", function () {
      var fee = getFee({amount: 100000, type: 0});
      (fee).should.be.type("number");
      (fee).should.be.not.NaN;
    });

    it("should return 10000000", function () {
      var fee = getFee({amount: 100000, type: 0});
      (fee).should.be.type("number").and.equal(10000000);
    });

    it("should return 10000000000", function () {
      var fee = getFee({type: 1});
      (fee).should.be.type("number").and.equal(10000000000);
    });

    it("should be equal 1000000000000", function () {
      var fee = getFee({type: 2});
      (fee).should.be.type("number").and.equal(1000000000000);
    });

    it("should be equal 100000000", function () {
      var fee = getFee({type: 3});
      (fee).should.be.type("number").and.equal(100000000);
    });
  });

  describe("fixedPoint", function () {
    var fixedPoint = crypto.fixedPoint;

    it("should be ok", function () {
      (fixedPoint).should.be.ok;
    })

    it("should be number", function () {
      (fixedPoint).should.be.type("number").and.not.NaN;
    });

    it("should be equal 100000000", function () {
      (fixedPoint).should.be.equal(100000000);
    });
  });

  describe("#sign", function () {
    var sign = crypto.sign;

    it("should be ok", function () {
      (sign).should.be.ok;
    });

    it("should be a function", function () {
      (sign).should.be.type("function");
    });
  });

  describe("#secondSign", function () {
    var secondSign = crypto.secondSign;

    it("should be ok", function () {
      (secondSign).should.be.ok;
    });

    it("should be a function", function () {
      (secondSign).should.be.type("function");
    });
  });

  describe("#getKeys", function () {
    var getKeys = crypto.getKeys;

    it("should be ok", function () {
      (getKeys).should.be.ok;
    });

    it("should be a function", function () {
      (getKeys).should.be.type("function");
    });

    it("should return two keys in hex", function () {
      var keys = getKeys("secret");

      (keys).should.be.ok;
      (keys).should.be.type("object");
      (keys).should.have.property("publicKey");
      (keys).should.have.property("privateKey");
      (keys.publicKey).should.be.type("string").and.match(function () {
        try {
          new Buffer(keys.publicKey, "hex");
        } catch (e) {
          return false;
        }

        return true;
      });
      (keys.privateKey).should.be.type("string").and.match(function () {
        try {
          new Buffer(keys.privateKey, "hex");
        } catch (e) {
          return false;
        }

        return true;
      });
    });
  });

  describe("#getAddress", function () {
    var getAddress = crypto.getAddress;

    it("should be ok", function () {
      (getAddress).should.be.ok;
    })

    it("should be a function", function () {
      (getAddress).should.be.type("function");
    });

    it("should generate address by publicKey", function () {
      var keys = crypto.getKeys("secret");
      var address = getAddress(keys.publicKey);

      (address).should.be.ok;
      (address).should.be.type("string");
      (address).should.be.equal("AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff");
    });

    it("should generate address by publicKey - second test", function () {
      var keys = crypto.getKeys("secret second test to be sure it works correctly");
      var address = getAddress(keys.publicKey);

      (address).should.be.ok;
      (address).should.be.type("string");
      (address).should.be.equal("AQSqYnjmwj1GBL5twD4K9EBXDaTHZognox");
    });

    it("should generate the same address as ECPair.getAddress()", function () {
      var keys = crypto.getKeys("secret second test to be sure it works correctly");
      var address = getAddress(keys.publicKey);

      var Q = ecurve.Point.decodeFrom(curve, new Buffer(keys.publicKey, 'hex'))
      var keyPair = new ECPair(null, Q);

      (address).should.be.equal(keyPair.getAddress());
    });
  });

  describe("#verify", function () {
    var verify = crypto.verify;

    it("should be ok", function () {
      (verify).should.be.ok;
    })

    it("should be function", function () {
      (verify).should.be.type("function");
    });
  });

  describe("#verifySecondSignature", function () {
    var verifySecondSignature = crypto.verifySecondSignature;

    it("should be ok", function () {
      (verifySecondSignature).should.be.ok;
    });

    it("should be function", function () {
      (verifySecondSignature).should.be.type("function");
    });
  });
});

describe("different networks", function () {

  it("validate address on tesnet should be ok", function () {
    ark.crypto.setNetworkVersion(0x52);
    ark.crypto.getNetworkVersion().should.equal(0x52);
    var validate = ark.crypto.validateAddress("a6fpb1BJZq4otWiVsBcuLG1ZGs5WsqqQtH");
    (validate).should.equal(true);
    ark.crypto.setNetworkVersion(0x17);
    ark.crypto.getNetworkVersion().should.equal(0x17);
  });
});

describe("delegate.js", function () {
  var delegate = ark.delegate;

  it("should be ok", function () {
    (delegate).should.be.ok;
  });

  it("should be function", function () {
    (delegate).should.be.type("object");
  });

  it("should have property createDelegate", function () {
    (delegate).should.have.property("createDelegate");
  });

  describe("#createDelegate", function () {
    var createDelegate = delegate.createDelegate;
    var trs = null;

    it("should be ok", function () {
      (createDelegate).should.be.ok;
    });

    it("should be function", function () {
      (createDelegate).should.be.type("function");
    });

    it("should create delegate", function () {
      trs = createDelegate("secret", "delegate", "secret 2");
    });

    it("should be deserialised correctly", function () {
      var deserialisedTx = ark.crypto.fromBytes(ark.crypto.getBytes(trs).toString("hex"));
      delete deserialisedTx.vendorFieldHex;
      var keys = Object.keys(deserialisedTx)
      for(key in keys){
        if(keys[key] == "asset"){
          deserialisedTx.asset.delegate.username.should.equal(trs.asset.delegate.username);
        }
        else {
          deserialisedTx[keys[key]].should.equal(trs[keys[key]]);
        }
      }
    });

    describe("returned delegate", function () {
      var keys = ark.crypto.getKeys("secret");
      var secondKeys = ark.crypto.getKeys("secret 2");

      it("should be ok", function () {
        (trs).should.be.ok;
      });

      it("should be object", function () {
        (trs).should.be.type("object");
      });

      it("should have recipientId equal null", function () {
        (trs).should.have.property("recipientId").and.type("object").and.be.empty;
      })

      it("shoud have amount equal 0", function () {
        (trs).should.have.property("amount").and.type("number").and.equal(0);
      })

      it("should have type equal 2", function () {
        (trs).should.have.property("type").and.type("number").and.equal(2);
      });

      // it("should have id equal 11636400490162225218", function () {
      // 	(trs).should.have.property("id").and.type("string").and.equal('11636400490162225218');
      // });

      it("should have timestamp number", function () {
        (trs).should.have.property("timestamp").and.type("number");
      });

      it("should have senderPublicKey in hex", function () {
        (trs).should.have.property("senderPublicKey").and.type("string").and.match(function () {
          try {
            new Buffer(trs.senderPublicKey, "hex");
          } catch (e) {
            return false;
          }

          return true;
        }).and.equal(keys.publicKey);
      });

      it("should have signature in hex", function () {
        (trs).should.have.property("signature").and.type("string").and.match(function () {
          try {
            new Buffer(trs.signature, "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should have second signature in hex", function () {
        (trs).should.have.property("signSignature").and.type("string").and.match(function () {
          try {
            new Buffer(trs.signSignature, "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should have delegate asset", function () {
        (trs).should.have.property("asset").and.type("object");
        (trs.asset).should.have.have.property("delegate");
      })

      it("should be signed correctly", function () {
        var result = ark.crypto.verify(trs);
        (result).should.be.ok;
      });

      it("should be second signed correctly", function () {
        var result = ark.crypto.verifySecondSignature(trs, secondKeys.publicKey);
        (result).should.be.ok;
      });

      it("should not be signed correctly now", function () {
        trs.amount = 100;
        var result = ark.crypto.verify(trs);
        (result).should.be.not.ok;
      });

      it("should not be second signed correctly now", function () {
        trs.amount = 100;
        var result = ark.crypto.verifySecondSignature(trs, secondKeys.publicKey);
        (result).should.be.not.ok;
      });

      describe("delegate asset", function () {
        it("should be ok", function () {
          (trs.asset.delegate).should.be.ok;
        });

        it("should be object", function () {
          (trs.asset.delegate).should.be.type("object");
        });

        it("should be have property username", function () {
          (trs.asset.delegate).should.have.property("username").and.be.type("string").and.equal("delegate");
        });
      });
    });
  });

});
