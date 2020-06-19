const Rabbit = require("./lib/rabbit/createChannel");
const logger = require("./lib/logger")(process.env.LOG_LEVEL);
const doBusinessLogic = require("./lib/biz-logic");
const app = require("./httpApp");

async function start() {
  console.log("Starting HTTP service");

  const PORT = process.env.PORT;
  app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}`);

    const WORK_QUEUE = process.env.WORK_QUEUE;
    const RESPONSE_QUEUE = process.env.RESPONSE_QUEUE;
    const RABBIT_HOST = process.env.RABBIT_HOST;

    const workRabbit = new Rabbit(RABBIT_HOST, WORK_QUEUE);
    const responseRabbit = new Rabbit(RABBIT_HOST, RESPONSE_QUEUE);

    logger.debug("Creating response channel");
    await responseRabbit.createChannel();

    logger.debug("Creating worker channel");
    await workRabbit.createChannel();

    console.log("Starting Rabbit listener");
    workRabbit.listen(async message => {
      logger.debug(
        `Worker channel received a message ${message.content.toString()}`
      );

      await doBusinessLogic(responseRabbit, message);
    });
  });
}

start();
