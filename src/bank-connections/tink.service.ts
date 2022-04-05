import { Injectable } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class TinkService {
  private TINK_HOST = 'https://api.tink.com/api/v1' as const
  private authData: string
  private clientId = process.env.TINK_CLIENT_ID
  private clientSecret = process.env.TINK_CLIENT_SECRET

  constructor() {
    if (!this.clientId) {
      throw new Error('Missing env TINK_CLIENT_ID')
    }
    if (!this.clientSecret) {
      throw new Error('Missing env TINK_CLIENT_SECRET')
    }
  }

  async authenticate() {
    const res = await axios.post(this.TINK_HOST + '/oauth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
    })
    return res
  }
}
