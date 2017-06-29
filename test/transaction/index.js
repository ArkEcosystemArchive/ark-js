var Buffer = require("buffer/").Buffer;
var should = require("should");
var ark = require("../../index.js");

describe("transaction.js", function () {

  var transaction = ark.transaction;

  it("should be object", function () {
    (transaction).should.be.type("object");
  });

  it("should have properties", function () {
    (transaction).should.have.property("createTransaction");
  })

  describe("#createTransaction", function () {
    var createTransaction = transaction.createTransaction;
    var trs = null;

    it("should be a function", function () {
      (createTransaction).should.be.type("function");
    });

    it("should create transaction without second signature", function () {
      trs = createTransaction("AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff", 1000, null, "secret");
      (trs).should.be.ok;
    });

    it("should create transaction with vendorField", function () {
      trs = createTransaction("AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff", 1000, "this is a test vendorfield", "secret");
      (trs).should.be.ok;
    });

    it("should fail if transaction with vendorField length > 64", function () {
      var vf="z";
      for(i=0;i<6;i++){
        vf=vf+vf;
      }
      vf=vf+"z";
      trs = createTransaction("AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff", 1000, vf, "secret");
      return (trs===null).should.equal(true);

    });

    it("should be ok if transaction with vendorField length = 64", function () {
      var vf="z";
      for(i=0;i<6;i++){
        vf=vf+vf;
      }
      trs = createTransaction("AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff", 1000, vf, "secret");
      (trs).should.be.ok;
    });

    describe("returned transaction", function () {
      it("should be object", function () {
        (trs).should.be.type("object");
      });

      it("should have id as string", function () {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and eqaul 0", function () {
        (trs.type).should.be.type("number").and.equal(0);
      });

      it("should have timestamp as number", function () {
        (trs.timestamp).should.be.type("number").and.not.NaN;
      });

      it("should have senderPublicKey as hex string", function () {
        (trs.senderPublicKey).should.be.type("string").and.match(function () {
          try {
            new Buffer(trs.senderPublicKey, "hex")
          } catch (e) {
            return false;
          }

          return true;
        })
      });

      it("should have recipientId as string and to be equal AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff", function () {
        (trs.recipientId).should.be.type("string").and.equal("AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff");
      });

      it("should have amount as number and eqaul to 1000", function () {
        (trs.amount).should.be.type("number").and.equal(1000);
      });

      it("should have empty asset object", function () {
        (trs.asset).should.be.type("object").and.empty;
      });

      it("should does not have second signature", function () {
        (trs).should.not.have.property("signSignature");
      });

      it("should have signature as hex string", function () {
        (trs.signature).should.be.type("string").and.match(function () {
          try {
            new Buffer(trs.signature, "hex")
          } catch (e) {
            return false;
          }

          return true;
        })
      });

      it("should be signed correctly", function () {
        var result = ark.crypto.verify(trs);
        result.should.equal(true);
      });

      it("should be deserialised correctly", function () {
        var deserialisedTx = ark.crypto.fromBytes(ark.crypto.getBytes(trs).toString("hex"));
        deserialisedTx.vendorField = new Buffer(deserialisedTx.vendorFieldHex, "hex").toString("utf8")
        delete deserialisedTx.vendorFieldHex;
        var keys = Object.keys(deserialisedTx)
        for(key in keys){
          if(keys[key] != "vendorFieldHex"){
            deserialisedTx[keys[key]].should.equal(trs[keys[key]]);
          }
        }

      });

      it("should not be signed correctly now", function () {
        trs.amount = 10000;
        var result = ark.crypto.verify(trs);
        result.should.equal(false);
      });
    });
  });

  describe("createTransaction and try to tamper signature", function(){

    it("should not validate overflown signatures", function(){
      var BigInteger = require('bigi')
      var bip66 = require('bip66')

      // custom bip66 encode for hacking away signature
      function BIP66_encode (r, s) {
        var lenR = r.length;
        var lenS = s.length;
        var signature = new Buffer(6 + lenR + lenS);

        // 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
        signature[0] = 0x30;
        signature[1] = signature.length - 2;
        signature[2] = 0x02;
        signature[3] = r.length;
        r.copy(signature, 4);
        signature[4 + lenR] = 0x02;
        signature[5 + lenR] = s.length;
        s.copy(signature, 6 + lenR);

        return signature;
      }

      // The transaction to replay
      var old_transaction = ark.transaction.createTransaction('AacRfTLtxAkR3Mind1XdPCddj1uDkHtwzD', 1, null, 'randomstring');

      // Decode signature
      var decode = bip66.decode(Buffer(old_transaction.signature, "hex"));

      var r = BigInteger.fromDERInteger(decode.r);
      var s = BigInteger.fromDERInteger(decode.s);

      // Transform the signature
      /*
      result = r|00
      result = result - r
      r = r + result
      */

      result = BigInteger.fromBuffer(Buffer(r.toBuffer(r.toDERInteger().length).toString('hex') + '06', 'hex'));
      result = result.subtract(r);
      r = r.add(result);

      new_signature = BIP66_encode(r.toBuffer(r.toDERInteger().length), s.toBuffer(s.toDERInteger().length)).toString('hex');
      //
      // console.log("OLD TRANSACTION : ");
      // console.log("TXID " + ark.crypto.getId(old_transaction));
      // console.log("VERIFY " + ark.crypto.verify(old_transaction));
      // console.log("SIG " + old_transaction.signature + "\n");

      ark.crypto.verify(old_transaction).should.equal(true);

      old_transaction.signature = new_signature;
      //
      // console.log("NEW TRANSACTION : ");
      // console.log("TXID " + ark.crypto.getId(old_transaction));
      // console.log("VERIFY " + ark.crypto.verify(old_transaction));
      // console.log("SIG " + old_transaction.signature);

      ark.crypto.verify(old_transaction).should.equal(false);

    });

  });

  describe("#createTransaction with second secret", function () {
    var createTransaction = transaction.createTransaction;
    var trs = null;
    var secondSecret = "second secret";
    var keys = ark.crypto.getKeys(secondSecret);

    it("should be a function", function () {
      (createTransaction).should.be.type("function");
    });

    it("should not accept bitcoin address", function(){
      try {
        trs = createTransaction("14owCmVDn8SaAFZcLbZfCVu5jvc4Lq7Tm1", 1000, null, "secret", secondSecret);
      } catch(error){
        return (error).should.have.property("message").and.equal("Wrong recipientId")
      }
      true.should.equal(false);
    });

    it("should create transaction without second signature", function () {
      trs = createTransaction("AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff", 1000, null, "secret", secondSecret);
      (trs).should.be.ok;
    });

    describe("returned transaction", function () {
      it("should be object", function () {
        (trs).should.be.type("object");
      });

      it("should have id as string", function () {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and eqaul 0", function () {
        (trs.type).should.be.type("number").and.equal(0);
      });

      it("should have timestamp as number", function () {
        (trs.timestamp).should.be.type("number").and.not.NaN;
      });

      it("should have senderPublicKey as hex string", function () {
        (trs.senderPublicKey).should.be.type("string").and.match(function () {
          try {
            new Buffer(trs.senderPublicKey, "hex")
          } catch (e) {
            return false;
          }

          return true;
        })
      });

      it("should have recipientId as string and to be equal AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff", function () {
        (trs.recipientId).should.be.type("string").and.equal("AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff");
      });

      it("should have amount as number and eqaul to 1000", function () {
        (trs.amount).should.be.type("number").and.equal(1000);
      });

      it("should have empty asset object", function () {
        (trs.asset).should.be.type("object").and.empty;
      });

      it("should have second signature", function () {
        (trs).should.have.property("signSignature");
      });

      it("should have signature as hex string", function () {
        (trs.signature).should.be.type("string").and.match(function () {
          try {
            new Buffer(trs.signature, "hex")
          } catch (e) {
            return false;
          }

          return true;
        })
      });

      it("should have signSignature as hex string", function () {
        (trs.signSignature).should.be.type("string").and.match(function () {
          try {
            new Buffer(trs.signSignature, "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should be deserialised correctly", function () {
        var deserialisedTx = ark.crypto.fromBytes(ark.crypto.getBytes(trs).toString("hex"));
        delete deserialisedTx.vendorFieldHex;
        var keys = Object.keys(deserialisedTx)
        for(key in keys){
          deserialisedTx[keys[key]].should.equal(trs[keys[key]]);
        }

      });

      it("should be signed correctly", function () {
        var result = ark.crypto.verify(trs);
        (result).should.equal(true);
      });

      it("should be second signed correctly", function () {
        var result = ark.crypto.verifySecondSignature(trs, keys.publicKey);
        (result).should.equal(true);
      });

      it("should not be signed correctly now", function () {
        trs.amount = 10000;
        var result = ark.crypto.verify(trs);
        (result).should.equal(false);
      });

      it("should not be second signed correctly now", function () {
        trs.amount = 10000;
        var result = ark.crypto.verifySecondSignature(trs, keys.publicKey);
        (result).should.equal(false);
      });
    });
  });

});
