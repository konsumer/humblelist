import express from 'express'
import fallback from 'express-history-api-fallback'
import cors from 'cors'
import humble from './humble'
import NodeCache from 'node-cache'

const root = `${__dirname}/pub`
const cache = new NodeCache()

const app = express()
app.use(cors())
app.use(express.static(root))


app.get('/keys', (req, res) => {
  cache.get('keys', (err, keys) => {
    if (err) {
      res.status(500)
      return res.send(err)
    }
    if (keys){
      return res.send(keys)
    }
    humble.gamekeys()
      .then(keys => {
        res.send(keys)
        cache.set('keys', keys)
      })
      .catch(err => { res.status(500); res.send(err) })
  })
})

app.get('/order/:id', (req, res) => {
  cache.get(`order/${req.params.id}`, (err, ord) => {
    if (err) {
      res.status(500)
      return res.send(err)
    }
    if (ord){
      return res.send(ord)
    }
    humble.order(req.params.id)
      .then(ord => {
        res.send(ord)
        cache.set(`order:${req.params.id}`, ord)
      })
      .catch(err => { res.status(500); res.send(err) })
  })
})

app.use(fallback('index.html', { root }))

// initial login to grab cookies
humble.login(process.env.HUMBLE_EMAIL, process.env.HUMBLE_PASSWORD)
  .then(() => {
    console.log(`Logged in as ${process.env.HUMBLE_EMAIL}`)
  })
  .catch(err => {
    throw err
  })

const port = process.env.PORT || 3000
console.log('Listening on http://localhost:' + port)
app.listen(port)