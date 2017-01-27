var Buffer = require("buffer/").Buffer;
var should = require("should");
var ark = require("../index.js");

describe("Ark JS", function () {

	it("should be ok", function () {
		(ark).should.be.ok;
	});

	it("should be object", function () {
		(ark).should.be.type("object");
	});

	it("should have properties", function () {
		var properties = ["transaction", "signature", "vote", "delegate", "crypto"];

		properties.forEach(function (property) {
			(ark).should.have.property(property);
		});
	});

});
