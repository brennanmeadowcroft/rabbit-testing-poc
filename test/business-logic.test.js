const { expect } = require("chai");
const Rabbit = require("./lib/Rabbit");

let responseRabbit, workRabbit;
const { RABBIT_HOST, WORK_QUEUE, RESPONSE_QUEUE } = process.env;

describe("Business Logic", function () {
  before(async function () {
    responseRabbit = new Rabbit(RABBIT_HOST, RESPONSE_QUEUE);
    await responseRabbit.createChannel();

    workRabbit = new Rabbit(RABBIT_HOST, WORK_QUEUE);
    await workRabbit.createChannel();
  });

  describe("when Luke Skywalker is passed", function () {
    it("should respond correctly", async function () {
      await workRabbit.send("Luke Skywalker");

      const message = await responseRabbit.poll();

      const businessLogicMessage = "Yoda";
      expect(message).to.eq(businessLogicMessage);
    });
  });

  describe("when Han Solo is passed", function () {
    it("should respond correctly", async function () {
      await workRabbit.send("Han Solo");

      const message = await responseRabbit.poll();

      const businessLogicMessage = "Princess Leia";
      expect(message).to.eq(businessLogicMessage);
    });
  });

  describe("when Darth Vader is passed", function () {
    it("should respond correctly", async function () {
      await workRabbit.send("Darth Vader");

      const message = await responseRabbit.poll();

      const businessLogicMessage = "Palpatine";
      expect(message).to.eq(businessLogicMessage);
    });
  });
});
