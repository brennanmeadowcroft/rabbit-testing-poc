const logger = require("./logger")(process.env.LOG_LEVEL);

async function doBusinessLogic(rabbit, message) {
  const msg = message.content.toString();
  logger.info(`Doing business logic: ${msg}`);
  const responses = {
    "Luke Skywalker": "Yoda",
    "Han Solo": "Princess Leia",
    "Darth Vader": "Palpatine",
  };

  const reply = responses[msg] || "Fubar";
  logger.debug(`Intended Reply: ${reply}`);
  await rabbit.send(reply);
}

module.exports = doBusinessLogic;
