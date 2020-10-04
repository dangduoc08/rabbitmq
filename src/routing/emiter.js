const express = require('express')
const bodyParser = require('body-parser')
const amqp = require('amqplib')
const {
  rabbitmqURL
} = require('../index')

const runEmiter = async () => {
  try {
    const connection = await amqp.connect(rabbitmqURL)
    const channel = await connection.createChannel()
    await channel.assertExchange(process.env.RABBITMQ_EXCHANGE, 'direct', {
      durable: true
    })

    const app = express()
    app.use(
      bodyParser.json(),
      bodyParser.urlencoded({
        extended: false
      })
    )

    app.post('/emit', async (req, res) => {
      try {
        const hasPublished = channel.publish(
          process.env.RABBITMQ_EXCHANGE,
          req.body.routingKey,
          Buffer.from(JSON.stringify(req.body)),
          {
            persistent: true
          }
        )


        hasPublished ? console.log('Message was pubished!') : undefined
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

    app.listen(process.env.EMITER_PORT, () =>
      console.log(`Producer listening on port ${process.env.EMITER_PORT}!`))
  } catch (error) {
    console.error('Error in producer')
    throw error
  }
}

runEmiter()