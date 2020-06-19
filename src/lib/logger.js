function logger(logLevel) {
  const levels = {
    debug: 100,
    info: 200,
    error: 300,
  };
  const currentLevel = levels[logLevel] || levels.error;

  function debug(msg) {
    if (currentLevel <= levels.debug) {
      console.log(msg);
    }
  }
  function info(msg) {
    if (currentLevel <= levels.info) {
      console.log(msg);
    }
  }

  function error(msg) {
    if (currentLevel <= levels.error) {
      console.log(msg);
    }
  }
  return {
    debug,
    info,
    error,
  };
}

module.exports = logger;
