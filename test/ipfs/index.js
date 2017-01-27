var Buffer = require("buffer/").Buffer;
var should = require("should");
var ark = require("../../index.js");

describe("ipfs.js", function () {

  var ipfs = ark.ipfs;

  it("should be ok", function () {
    (ipfs).should.be.ok;
  });

  it("should be object", function () {
    (ipfs).should.be.type("object");
  });

  it("should have createHashRegistration property", function () {
    (ipfs).should.have.property("createHashRegistration");
  });

  it("should create transaction with hashid", function () {
    trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
    (trs).should.be.ok;
  });

  describe("returned transaction", function () {
    it("should be object", function () {
      (trs).should.be.type("object");
    });

    it("should have id as string", function () {
      (trs.id).should.be.type("string");
    });

    it("should have vendorField as string", function () {
      (trs.vendorField).should.be.type("string");
    });

    it("should have vendorField equal to 'QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg'", function () {
      (trs.vendorField).should.be.type("string").and.equal('QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg');
    });

    it("should have type as number and equal 5", function () {
      (trs.type).should.be.type("number").and.equal(5);
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

    it("should have amount as number and equal to 0", function () {
      (trs.amount).should.be.type("number").and.equal(0);
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

    it("should not be signed correctly now (changed amount)", function () {
      trs.amount = 10000;
      var result = ark.crypto.verify(trs);
      (result).should.be.not.ok;
    });

    it("should not be signed correctly now (changed vendorField)", function () {
      trs.vendorField = "bouloup";
      var result = ark.crypto.verify(trs);
      (result).should.be.not.ok;
    });
  });

});
