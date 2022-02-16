import { randomInt } from 'crypto';
import { hash } from 'bcrypt';

const SALT_ROUNDS = 10;

export async function generatePin(): Promise<{ pin: string; hashed: string }> {
  let length = 5;
  let pin = '';

  while (length) {
    const int = await randomInt(0, 9);
    pin = pin + int;
    length--;
  }

  const hashed = await hashOtp(pin);

  return { pin, hashed };
}

export async function hashOtp(pin: string) {
  return hash(pin, 10);
}

export function verifyPinHash() {}
