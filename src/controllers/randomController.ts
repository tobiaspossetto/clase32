
import { Request, Response } from 'express'
class RandomController {
  randoms (req:Request, res:Response) {
    const randoms = []

    for (let i = 0; i < 10000; i++) {
      const numero = Math.floor(Math.random() * (0 - 9 + 1)) + 9
      randoms.push(numero)
    }
    console.log(randoms)
    res.send(randoms)
  }
}

export default new RandomController()
