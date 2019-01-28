const OrderMapper = require('../../mappers/OrderMapper')

// TODO: make DesiredProductRepository an internal thing of OrdersRepository

class SequelizeOrdersRepository {
  constructor ({ database, currentUser }) {
    this.currentUser = currentUser
    this.OrderModel = database.Order
    this.SupplierModel = database.Supplier
  }

  async getAll ({ currentUserOnly = true, groupId } = {}) {
    const where = {}
    if (currentUserOnly) {
      if (!this.currentUser) { throw new Error('missing current user') } // TODO: throw operational error
      where.userId = this.currentUser.id
    }
    if (groupId) {
      where.groupId = groupId
    }

    const orders = await this.OrderModel.findAll({ where })
    return orders.map(OrderMapper.toDomain)
  }

  async getById (orderId, { currentUserOnly = true, includeSupplier = true } = {}) {
    const include = []
    if (includeSupplier) {
      include.push(this.SupplierModel)
    }
    const where = { orderId }

    if (currentUserOnly) {
      if (!this.currentUser) { throw new Error('missing current user') } // TODO: throw operational error
      where.userId = this.currentUser.id
    }

    const order = await this.OrderModel.findOne({ include, where })
    if (!order) return null

    return OrderMapper.toDomain(order)
  }

  async getLast ({ includeSupplier = true } = {}) {
    if (!this.currentUser) { throw new Error('missing current user') } // TODO: throw operational error

    const include = []
    if (includeSupplier) {
      include.push(this.SupplierModel)
    }
    const where = {
      userId: this.currentUser.id
    }
    const sort = [['createdAt', 'DESC'], ['orderId', 'DESC']]

    const lastOrder = await this.OrderModel.findOne({ include, where, order: sort })
    if (!lastOrder) return null

    return OrderMapper.toDomain(lastOrder)
  }

  async update (order) {
    const orderAsDb = OrderMapper.toDatabase(order)

    const orderInstance = await this.OrderModel.findByPk(order.id)
    await orderInstance.update(orderAsDb)
  }

  async create (order) {
    const orderAsDb = OrderMapper.toDatabase(order)
    const createdOrder = await this.OrderModel.create(orderAsDb)
    return OrderMapper.toDomain(createdOrder)
  }

  async deleteById (orderId) {
    const orderInstance = await this.OrderModel.findByPk(orderId)

    if (!orderInstance) {
      throw new Error(`could not find order with id "${orderId}"`) // TODO: throw operational error
    }

    const desiredProductInstance = await orderInstance.getDesiredProduct()

    await orderInstance.destroy()
    await desiredProductInstance.destroy()
  }
}

module.exports = SequelizeOrdersRepository
