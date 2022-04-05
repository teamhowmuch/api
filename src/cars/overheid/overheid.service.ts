import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { VoertuigGegevens } from './voertuigGegevens'

@Injectable()
export class OverheidService {
  private API_KEY = process.env.OVERHEID_API_KEY
  private HOST = 'https://api.overheid.io'

  constructor() {
    if (!this.API_KEY) {
      throw new Error('Missing env var OVERHEID_API_KEY')
    }
  }

  async lookupLicensePlate(licensePlate: string) {
    const res = await axios.get<VoertuigGegevens>(`${this.HOST}/voertuiggegevens/${licensePlate}`, {
      headers: { 'ovio-api-key': this.API_KEY },
    })
    return res.data
  }
}
