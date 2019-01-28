const { attributes } = require('structure')

const STATUSES = {
  open: 'OPEN',
  close: 'CLOSE',
  canceled: 'CANCELED'
}

const Group = attributes({
  id: Number,
  name: String,
  description: { type: String, empty: true },
  endDate: { type: String, required: true },
  status: { type: String, equal: Object.values(STATUSES), required: true },
  fakeAmount: Number,
  areaIds: { type: Array, itemType: Number },
  cityIds: { type: Array, itemType: Number },
  orderIds: { type: Array, itemType: Number }
})(class Group {
  /**
   * returns the total amount of desired products registered to the group + fake amount
   * @returns {Number}
   */
  getTotalOrders () {
    let total = this.orderIds.length
    if (this.fakeAmount) {
      total += this.fakeAmount
    }
    return total
  }

  /***
   * checks whether a user can join the group based on his attributes + the group attributes
   * @param user
   */
  isJoinable (user) {
    if (!user.contact.city) {
      throw new Error('user must have a city to join a group')
    }

    // const userCity = user.contact.city
    // const isInCity = () => this.cityIds.includes(userCity.id)
    // const isInArea = () => this.areaIds.includes(userCity.areaId)
    const isJoinableStatus = () => this.status === STATUSES.open

    return isJoinableStatus() // && (isInCity() || isInArea())
  }
})

Group.statuses = STATUSES
module.exports = Group
