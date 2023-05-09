type Coordinate = {
  latitude: number
  longitude: number
}

type GetDistanceBetweenCoordinatesParams = {
  from: Coordinate
  to: Coordinate
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

export function getDistanceBetweenCoordinates({
  from,
  to,
}: GetDistanceBetweenCoordinatesParams) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  const earthRadius = 6371

  const fromLatitudeInRadians = toRadians(from.latitude)
  const toLatitudeInRadians = toRadians(to.latitude)

  const latitudeDifferenceInRadians = toRadians(to.latitude - from.latitude)
  const longitudeDifferenceInRadians = toRadians(to.longitude - from.longitude)

  const a =
    Math.sin(latitudeDifferenceInRadians / 2) *
      Math.sin(latitudeDifferenceInRadians / 2) +
    Math.cos(fromLatitudeInRadians) *
      Math.cos(toLatitudeInRadians) *
      Math.sin(longitudeDifferenceInRadians / 2) *
      Math.sin(longitudeDifferenceInRadians / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distanceInKilometers = earthRadius * c

  return distanceInKilometers
}
