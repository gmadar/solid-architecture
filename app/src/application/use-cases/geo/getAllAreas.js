const codes = {}

module.exports = ({ geoRepository }) => {
  const res = async function getAllAreas () {
    const areas = await geoRepository.getAllAreas()
    return areas
  }
  res.codes = codes
  return res
}
