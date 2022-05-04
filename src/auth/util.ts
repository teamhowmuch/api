import { randomInt } from 'crypto'
import { hash } from 'bcrypt'

export async function generatePin(): Promise<{ pin: string; hashed: string }> {
  let length = 5
  let pin = ''

  while (length) {
    const int = await randomInt(0, 9)
    pin = pin + int
    length--
  }

  const hashed = await hashOtp(pin)

  return { pin, hashed }
}

export async function hashOtp(pin: string) {
  return hash(pin, 10)
}
