require("should");

describe("slots.js", function () {

  const slots = require("../../lib/time/slots.js");

  it("should be ok", function () {
    (slots).should.be.ok;
  });

  it("should be object", function () {
    (slots).should.be.type("object");
  });

  it("should have properties", function () {
    const properties = ["interval", "delegates", "getTime", "getRealTime", "getSlotNumber", "getSlotTime", "getNextSlot", "getLastSlot"];
    properties.forEach(function (property) {
      (slots).should.have.property(property);
    });
  });

  describe(".interval", function () {
    const interval = slots.interval;

    it("should be ok", function () {
      (interval).should.be.ok;
    });

    it("should be number and not NaN", function () {
      (interval).should.be.type("number").and.not.NaN;
    });
  });

  describe(".delegates", function () {
    const delegates = slots.delegates;

    it("should be ok", function () {
      (delegates).should.be.ok;
    });

    it("should be number and not NaN", function () {
      (delegates).should.be.type("number").and.not.NaN;
    });
  });

  describe("#getTime", function () {
    const getTime = slots.getTime;

    it("should be ok", function () {
      (getTime).should.be.ok;
    });

    it("should be a function", function () {
      (getTime).should.be.type("function");
    });

    it("should return epoch time as number, equal to 10", function () {
      const d = 1490101210000;
      const time = getTime(d);
      (time).should.be.type("number").and.equal(10);
    });
  });

  describe("#getRealTime", function () {
    const getRealTime = slots.getRealTime;

    it("should be ok", function () {
      (getRealTime).should.be.ok;
    });

    it("should be a function", function () {
      (getRealTime).should.be.type("function");
    });

    it("should return return real time, convert 10 to 1490101210000", function () {
      const d = 10;
      const real = getRealTime(d);
      (real).should.be.ok;
      (real).should.be.type("number").and.equal(1490101210000);
    });
  });

  describe("#getSlotNumber", function () {
    const getSlotNumber = slots.getSlotNumber;

    it("should be ok", function () {
      (getSlotNumber).should.be.ok;
    });

    it("should be a function", function () {
      (getSlotNumber).should.be.type("function");
    });

    it("should return slot number, equal to 1", function () {
      const slot = getSlotNumber(10);
      (slot).should.be.type("number").and.equal(1);
    });
  });

  describe("#getSlotTime", function () {
    const getSlotTime = slots.getSlotTime;

    it("should be ok", function () {
      (getSlotTime).should.be.ok;
    });

    it("should be function", function () {
      (getSlotTime).should.be.type("function");
    });

    it("should return slot time number, equal to ", function () {
      const slotTime = getSlotTime(19614);
      (slotTime).should.be.ok;
      (slotTime).should.be.type("number").and.equal(156912);
    });
  });

  describe("#getNextSlot", function () {
    const getNextSlot = slots.getNextSlot;

    it("should be ok", function () {
      (getNextSlot).should.be.ok;
    });

    it("should be function", function () {
      (getNextSlot).should.be.type("function");
    });

    it("should return next slot number", function () {
      const nextSlot = getNextSlot();
      (nextSlot).should.be.ok;
      (nextSlot).should.be.type("number").and.not.NaN;
    });
  });

  describe("#getLastSlot", function () {
    const getLastSlot = slots.getLastSlot;

    it("should be ok", function () {
      (getLastSlot).should.be.ok;
    });

    it("should be function", function () {
      (getLastSlot).should.be.type("function");
    });

    it("should return last slot number", function () {
      const lastSlot = getLastSlot(slots.getNextSlot());
      (lastSlot).should.be.ok;
      (lastSlot).should.be.type("number").and.not.NaN;
    });
  });

});
