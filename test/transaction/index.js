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

    it("should fail if transaction with vendorField > 64 bytes", function () {
      var vf="z";
      for(i=0;i<6;i++){
        vf=vf+vf;
      }
      vf=vf+"z";
      try{
        trs = createTransaction("AJWRd23HNEhPLkK1ymMnwnDBX2a7QBZqff", 1000, vf, "secret");
      }	catch(e){
        return true;
      }
      return false;

    });

    it("should be ok if transaction with vendorField = 64 bytes", function () {
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
        (result).should.be.ok;
      });

      it("should not be signed correctly now", function () {
        trs.amount = 10000;
        var result = ark.crypto.verify(trs);
        (result).should.be.not.ok;
      });
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

      it("should be signed correctly", function () {
        var result = ark.crypto.verify(trs);
        (result).should.be.ok;
      });

      it("should be second signed correctly", function () {
        var result = ark.crypto.verifySecondSignature(trs, keys.publicKey);
        (result).should.be.ok;
      });

      it("should not be signed correctly now", function () {
        trs.amount = 10000;
        var result = ark.crypto.verify(trs);
        (result).should.be.not.ok;
      });

      it("should not be second signed correctly now", function () {
        trs.amount = 10000;
        var result = ark.crypto.verifySecondSignature(trs, keys.publicKey);
        (result).should.be.not.ok;
      });
    });
  });
  
});
