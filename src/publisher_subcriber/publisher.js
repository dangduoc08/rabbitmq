const express = require('express')
const bodyParser = require('body-parser')
const amqp = require('amqplib')
const {
  rabbitmqURL
} = require('../index')

const runPublisher = async () => {
  try {
    const connection = await amqp.connect(rabbitmqURL)
    const channel = await connection.createChannel()
    await channel.assertExchange(process.env.RABBITMQ_EXCHANGE, 'fanout', {
      durable: true
    })

    const app = express()
    app.use(
      bodyParser.json(),
      bodyParser.urlencoded({
        extended: false
      })
    )

    app.post('/publish', async (req, res) => {
      try {
        const hasPublished = channel.publish(
          process.env.RABBITMQ_EXCHANGE,
          '',
          Buffer.from(JSON.stringify(req.body)),
          {
            persistent: true
          }
        )
        hasPublished ? console.log('Message was published!') : undefined
        res.status(200).json({
          status: 200,
          message: 'Message was published!'
        })
      } catch (error) {
        res.status(500).json({
          ...error
        })
      }
    })

    app.listen(process.env.PUBLISHER_PORT, () =>
      console.log(`Publisher listening on port ${process.env.PUBLISHER_PORT}!`))
  } catch (error) {
    console.error('Error in publisher')
    throw error
  }
}

runPublisher()