const express = require('express')
const bodyParser = require('body-parser')
const amqp = require('amqplib')
const {
  rabbitmqURL
} = require('../index')

const runProducer = async () => {
  try {
    const connection = await amqp.connect(rabbitmqURL)
    const channel = await connection.createChannel()
    channel.assertQueue(process.env.RABBITMQ_WORKER_QUEUE, {
      durable: true
    })

    const app = express()
    app.use(
      bodyParser.json(),
      bodyParser.urlencoded({
        extended: false
      })
    )

    app.post('/produce', async (req, res) => {
      try {
        const hasSent = channel.sendToQueue(
          process.env.RABBITMQ_WORKER_QUEUE,
          Buffer.from(JSON.stringify(req.body)),
          {
            persistent: true
          }
        )
        hasSent ? console.log('Message was sent!') : undefined
        res.status(200).json({
          status: 200,
          message: 'Message was sent!'
        })
      } catch (error) {
        res.status(500).json({
          ...error
        })
      }
    })

    app.listen(process.env.PRODUCER_PORT, () =>
      console.log(`Producer listening on port ${process.env.PRODUCER_PORT}!`))
  } catch (error) {
    console.error('Error in producer')
    throw error
  }
}

runProducer()