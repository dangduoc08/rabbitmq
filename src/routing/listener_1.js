const amqp = require('amqplib')
const {
  rabbitmqURL
} = require('../index')

const runListener = async () => {
  try {
    const connection = await amqp.connect(rabbitmqURL)
    const channel = await connection.createChannel()
    await channel.assertExchange(process.env.RABBITMQ_EXCHANGE, 'direct', {
      durable: true
    })
    await channel.assertQueue(process.env.RABBITMQ_WORKER_QUEUE + '_1')
    await channel.bindQueue(
      process.env.RABBITMQ_WORKER_QUEUE + '_1',
      process.env.RABBITMQ_EXCHANGE,
      'info'
    )
    channel.prefetch(1)
    channel.consume(process.env.RABBITMQ_WORKER_QUEUE + '_1', msg => {
      console.log(JSON.parse(msg.content.toString()))

      channel.ack(msg)
    }, {
      noAck: false
    })
  } catch (error) {
    console.error('Error in consumer')
    throw error
  }
}

runListener()