var amqp = require("amqplib");

class Rabbit {
  constructor(host, queue) {
    this.host = host;
    this.connection = amqp.connect(`amqp://${host}`);

    this.queue = queue;
    this.channel = null;
  }

  async createChannel() {
    this.channel = await this.connection
      .then(conn => {
        return conn.createChannel();
      })
      .then(channel => {
        return channel
          .assertQueue(this.queue, {
            durable: true,
            autoDelete: true,
          })
          .then(() => {
            return channel;
          });
      });
  }

  async get() {
    return this.channel.get(this.queue, { noAck: true }).then(message => {
      if (message.content) {
        return message.content.toString();
      }
    });
  }

  async poll() {
    let message = undefined;
    while (message === undefined) {
      message = await this.get();
    }

    return message;
  }

  async send(message) {
    return this.channel.sendToQueue(this.queue, Buffer.from(message));
  }
}

module.exports = Rabbit;
