const amqp = require('amqplib')
const {
  rabbitmqURL
} = require('../index')

const runSubcriber = async () => {
  try {
    const connection = await amqp.connect(rabbitmqURL)
    const channel = await connection.createChannel()
    await channel.assertExchange(process.env.RABBITMQ_EXCHANGE, 'fanout', {
      durable: true
    })
    await channel.assertQueue(process.env.RABBITMQ_WORKER_QUEUE + '_1')
    await channel.bindQueue(
      process.env.RABBITMQ_WORKER_QUEUE + '_1',
      process.env.RABBITMQ_EXCHANGE
    )
    channel.prefetch(1)
    channel.consume(process.env.RABBITMQ_WORKER_QUEUE + '_1', msg => {
      console.log(JSON.parse(msg.content.toString()))
    }, {
      noAck: false
    })
  } catch (error) {
    console.error('Error in consumer')
    throw error
  }
}

runSubcriber()