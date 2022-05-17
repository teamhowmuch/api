//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
interface Coordinates {
  lat: number
  long: number
}

export function calcDistanceCrow(set1: Coordinates, set2: Coordinates) {
  const EARTH_RADIUS = 6371

  const deltaLat = toRad(set2.lat - set1.lat)
  const deltaLong = toRad(set2.long - set1.long)
  const lat1 = toRad(set1.lat)
  const lat2 = toRad(set2.lat)

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = EARTH_RADIUS * c
  return d
}

export function toRad(val: number) {
  return (val * Math.PI) / 180
}
