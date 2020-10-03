const {
  URLBuilder
} = require('./utils/url')

const rabbitURLBuilder = new URLBuilder()
const rabbitmqURL = rabbitURLBuilder
  .protocol('amqp')
  .username(process.env.RABBITMQ_USER)
  .password(process.env.RABBITMQ_PASSWORD)
  .host(process.env.RABBITMQ_HOST)
  .port(process.env.RABBITMQ_PORT)
  .pathname(process.env.RABBITMQ_VHOST)
  .build()
  .getURL()


module.exports = {
  rabbitmqURL
}