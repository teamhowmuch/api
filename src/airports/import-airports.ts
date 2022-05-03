import axios from 'axios'

const URL = 'https://datahub.io/core/airport-codes/r/airport-codes.json'

interface Airport {
  continent: string
  coordinates: string
  elevation_ft: string
  gps_code: string
  iata_code: string | null
  ident: string
  iso_country: string
  iso_region: string
  local_code: string
  municipality: string
  name: string
  type: string
}

export class ImportAirports {
  public static async download() {
    const res = await axios.get<Airport[]>(URL)
    return res.data
  }
}
