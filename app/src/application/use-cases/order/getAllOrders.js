const { roles } = require('../../../domain/user/User')

const codes = {}

module.exports = ({ ordersRepository, getDesiredProduct, currentUser }) => {
  const res = async function getAllOrders ({ includeDesiredProduct = false, groupId } = {}) {
    const isAdmin = (currentUser.role === roles.admin)

    const orders = await ordersRepository.getAll({ currentUserOnly: !isAdmin, groupId })

    if (includeDesiredProduct) {
      await Promise.all(
        orders
          .filter(order => !!order.desiredProductId)
          .map(async (order) => {
            order.desiredProduct = await getDesiredProduct(order.desiredProductId)
          })
      )
    }

    return orders
  }
  res.codes = codes
  return res
}
