var Buffer = require("buffer/").Buffer;
var should = require("should");
var ark = require("../../index.js");

describe("signature.js", function () {

  var signature = ark.signature;

  it("should be ok", function () {
    (signature).should.be.ok;
  });

  it("should be object", function () {
    (signature).should.be.type("object");
  });

  it("should have properties", function () {
    (signature).should.have.property("createSignature");
  });

  describe("#createSignature", function () {
    var createSignature = signature.createSignature;
    var sgn = null;

    it("should be function", function () {
      (createSignature).should.be.type("function");
    });

    it("should create signature transaction", function () {
      sgn = createSignature("secret", "second secret");
      (sgn).should.be.ok;
      (sgn).should.be.type("object");
    });

    it("should create signature transaction", function () {
      var secretKey = ark.ECPair.fromSeed("secret");
      secretKey.publicKey = secretKey.getPublicKeyBuffer().toString("hex");

      sgn = createSignature(secretKey, "second secret");
      (sgn).should.be.ok;
      (sgn).should.be.type("object");
    });

    it("should create transaction with fee override", function () {
      const feeOverride = 1000000
      trs = createSignature('secret', 'second secret', feeOverride);
      (trs).should.be.ok;
      (trs.fee).should.equal(feeOverride)
    });

    it("should fail to create transaction with invalid fee override", function (done) {
      const feeOverride = '1000000'
      try {
        trs = createSignature('secret', 'second secret', feeOverride);
        should.fail()
      } catch (error) {
        done()
      }
    });

    it("should be deserialised correctly", function () {
      var deserialisedTx = ark.crypto.fromBytes(ark.crypto.getBytes(sgn).toString("hex"));
      delete deserialisedTx.vendorFieldHex;
      var keys = Object.keys(deserialisedTx)
      for(key in keys){
        if(keys[key] == "asset"){
          deserialisedTx.asset.signature.publicKey.should.equal(sgn.asset.signature.publicKey);
        }
        else {
          deserialisedTx[keys[key]].should.equal(sgn[keys[key]]);
        }
      }
    });

    describe("returned signature transaction", function () {
      it("should have empty recipientId", function () {
        (sgn).should.have.property("recipientId").equal(null);
      });

      it("should have amount equal 0", function () {
        (sgn.amount).should.be.type("number").equal(0);
      });

      it("should have asset", function () {
        (sgn.asset).should.be.type("object");
        (sgn.asset).should.be.not.empty;
      });

      it("should have signature inside asset", function () {
        (sgn.asset).should.have.property("signature");
      });

      describe("signature asset", function () {
        it("should be ok", function () {
          (sgn.asset.signature).should.be.ok;
        })

        it("should be object", function () {
          (sgn.asset.signature).should.be.type("object");
        });

        it("should have publicKey property", function () {
          (sgn.asset.signature).should.have.property("publicKey");
        });

        it("should have publicKey in hex", function () {
          (sgn.asset.signature.publicKey).should.be.type("string").and.match(function () {
            try {
              new Buffer(sgn.asset.signature.publicKey);
            } catch (e) {
              return false;
            }

            return true;
          });
        });

        it("should have publicKey in 33 bytes", function () {
          var publicKey = new Buffer(sgn.asset.signature.publicKey, "hex");
          (publicKey.length).should.be.equal(33);
        });
      });
    });
  });

});
