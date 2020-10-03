const amqp = require('amqplib')
const {
  rabbitmqURL
} = require('../index')

const runConsumer = async () => {
  try {
    const connection = await amqp.connect(rabbitmqURL)
    const channel = await connection.createChannel()
    const totalConsumer = 2
    for (let i = 0; i < totalConsumer; i++) {
      channel.assertQueue(process.env.RABBITMQ_WORKER_QUEUE, {
        durable: true
      })
      await channel.prefetch(1)
      channel.consume(
        process.env.RABBITMQ_WORKER_QUEUE,
        message => {
          console.log(JSON.parse(message.content))
          setTimeout(() => {
            console.log('Message acknowledge')
            channel.ack(message)
          }, 10000)
        },
        {
          noAck: false
        }
      )
    }
  } catch (error) {
    console.error('Error in consumer')
    throw error
  }
}

runConsumer()