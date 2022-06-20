import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import routes from './routes/routes'

import minimist from 'minimist'
import cookieParser from 'cookie-parser'
import './middleware/passport/local-auth'
import passport from 'passport'
import compression from 'compression'

import log4js from 'log4js'
import { myMorgan } from './middleware/myMorgan'
export const logger = log4js.getLogger('default')
export const args = minimist(process.argv.slice(2))
const app = express()
export const PORT = args._[0] || process.env.PORT || 4000

console.log(args._[0])
dotenv.config()
log4js.configure({
  appenders: {
    // defino dos soportes de salida de datos
    consola: { type: 'console' },
    warningFile: { type: 'file', filename: 'warning.log' },
    errorFile: { type: 'file', filename: 'error.log' },
    // defino sus niveles de logueo
    loggerConsola: { type: 'logLevelFilter', appender: 'consola', level: 'info' },
    loggerWarning: { type: 'logLevelFilter', appender: 'warningFile', level: 'warn' },
    loggerError: { type: 'logLevelFilter', appender: 'errorFile', level: 'error' }
  },
  categories: {
    default: {
      appenders: ['loggerConsola', 'loggerWarning', 'loggerError'], level: 'all'
    }
  }

})

// app.use(morgan('dev'))

app.use(compression())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(session({
  // store: MongoStore.create({ mongoUrl: config.mongoLocal.cnxStr }),
  //  store: MongoStore.create({ mongoUrl: `mongodb+srv://tobias:${process.env.MONGODB_ATLAS_PASSWORD}@cluster0.ulmpx.mongodb.net/ecommerce?retryWrites=true&w=majority`, ttl: 60 }),
  secret: 'iosadyh23bu',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 600000
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())

app.set('views', './src/views')
app.set('view engine', 'pug')

app.use(myMorgan, routes)

logger.info('info')
logger.warn('warn')
logger.error('error')

export default app
