import { getConnectionMongo } from './db/mongoDbConnection'
import { Server as WebSocketServer } from 'socket.io'
import http from 'http'
import app, { PORT, args } from './app'
import sockets from './socket/sockets'
import cluster from 'cluster'
const numCPUs = require('os').cpus().length

if (args._[1] === 'CLUSTER' && cluster.isMaster) {
  console.log(`I am a master ${process.pid}`)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died')
  })
} else {
  const server = http.createServer(app)

  const httpServer = server.listen(PORT || 3000)
  // @ts-ignore
  console.log('Server on http://localhost:', args._[0])

  getConnectionMongo()

  const io = new WebSocketServer(httpServer)

  sockets(io)
}
