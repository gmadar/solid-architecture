const codes = {}

module.exports = ({ productsRepository }) => {
  const res = async function getAllPropertyValueOptions () {
    const options = await productsRepository.getAllPropertyValueOptions()
    return options
  }
  res.codes = codes
  return res
}
