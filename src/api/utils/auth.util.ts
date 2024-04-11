import crypto from 'crypto'
import * as OTPAuth from 'otpauth'
import { encode } from 'hi-base32'

const generateBase32Token = function () {
  const base32Token = encode(crypto.randomBytes(32))
    .replace(/=/g, (val) => '')
    .substring(0, 24)

  return base32Token
}

const generateTotp = function ({ secret, period = 30 }: { secret: string; period?: number }) {
  const totp = new OTPAuth.TOTP({
    issuer: 'BA',
    label: 'BookingApp',
    algorithm: 'SHA1',
    digits: 6,
    period,
    secret
  })
  return totp
}

export default { generateTotp, generateBase32Token }
