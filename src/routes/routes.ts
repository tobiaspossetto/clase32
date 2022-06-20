import { Router, Request, Response } from 'express'
import { fakeProducts } from '../controllers/testController'
import { isAuth, apiAuth } from '../middleware/auth'
import passport from 'passport'
import randomController from '../controllers/randomController'
import { logger, PORT } from '../app'

import minimist from 'minimist'
const numCPUs = require('os').cpus().length
const router = Router()
export const args = minimist(process.argv.slice(2))
// VISTAS WEB
router.get('/signin', (req: Request, res: Response) => {
  res.render('signin.pug')
})
router.get('/signup', (req: Request, res: Response) => {
  res.render('signup.pug')
})

router.get('/', isAuth, (req:Request, res:Response) => {
  // @ts-ignore
  res.render('products.pug', { username: req.session.passport.user.email })
})

router.get('/test', (req:Request, res:Response) => {
  res.render('test.pug')
})

router.get('/logout', (req:Request, res:Response) => {
  res.render('logout.pug', { username: req.query.username })
})

// API
router.get('/api/productos-test', isAuth, (req:Request, res:Response) => {
  const result = fakeProducts()
  res.json(result)
})

router.post('/api/signin', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/signInError',
  passReqToCallback: true,
  failureMessage: true
}))

router.post('/api/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signUpError',
  passReqToCallback: true,
  failureMessage: true
}))

router.post('/api/logout', isAuth, (req, res, next) => {
  // @ts-ignore
  const username = req.session.passport.user.email
  // @ts-ignore
  req.logout(function (err) {
    if (err) { return next(err) }
    res.redirect('/logout?username=' + username)
  })
})

router.get('/signUpError', (req, res) => {
  // @ts-ignore
  console.log(req.session)
  // @ts-ignore
  res.render('failSignup.pug', { msg: req.session.messages[req.session.messages.length - 1] })
})

router.get('/signInError', (req, res) => {
  // @ts-ignore
  console.log(req.session)
  // @ts-ignore
  res.render('failSignin.pug', { msg: req.session.messages[req.session.messages.length - 1] })
})

router.get('/api/randoms', randomController.randoms)

router.get('/info', function (req: any, res: { send: (arg0: string) => void }) {
  res.send(args._[0] + `Procesadores=  ${numCPUs} Servidor express <span style="color:blueviolet;">(Nginx)</span> en ${PORT} - <b>PID ${process.pid}</b> - ${new Date().toLocaleString()} `)
})

router.get('*', function (req: any, res: any) {
  logger.warn(`404: ${req.url} method: ${req.method}`)
  res.send('<h1>404</h1>')
})

export default router
