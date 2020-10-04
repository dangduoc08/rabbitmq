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
    await channel.assertQueue(process.env.RABBITMQ_WORKER_QUEUE + '_2')
    await channel.bindQueue(
      process.env.RABBITMQ_WORKER_QUEUE + '_2',
      process.env.RABBITMQ_EXCHANGE,
      'error'
    )
    channel.prefetch(1)
    channel.consume(process.env.RABBITMQ_WORKER_QUEUE + '_2', msg => {
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