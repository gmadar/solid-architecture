const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    orderId: {
      field: 'order_id',
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    baseOrderId: { type: DataTypes.INTEGER, field: 'base_order_id' },
    groupId: { type: DataTypes.INTEGER, field: 'group_id' },
    userId: { type: DataTypes.INTEGER, field: 'user_id' },
    petId: { type: DataTypes.INTEGER, field: 'pet_id' },
    desiredProductId: { type: DataTypes.INTEGER, field: 'desired_product_id' },
    chosenProductId: { type: DataTypes.INTEGER, field: 'chosen_product_id' },
    chosenSupplierId: { type: DataTypes.INTEGER, field: 'chosen_supplier_id' },
    status: DataTypes.STRING,
    quantity: { type: DataTypes.INTEGER, field: 'quantity' },
    singleUnitPrice: { type: DataTypes.FLOAT, field: 'single_unit_price' },
    estimatedPriceBest: { type: DataTypes.FLOAT, field: 'estimated_price_best' },
    estimatedPriceWorst: { type: DataTypes.FLOAT, field: 'estimated_price_worst' },
    notes: DataTypes.TEXT,
    cancellationReason: { type: DataTypes.STRING, field: 'cancellation_reason' },
    shipmentDate: { type: DataTypes.DATE, field: 'shipment_date' },
    shipmentReceiver: { type: DataTypes.TEXT, field: 'shipment_receiver' },
    shipmentPhone: { type: DataTypes.TEXT, field: 'shipment_phone' },
    shipmentAddress: { type: DataTypes.TEXT, field: 'shipment_address' },
    shipmentCityId: { type: DataTypes.INTEGER, field: 'shipment_city_id' },
    shipmentFloor: { type: DataTypes.TEXT, field: 'shipment_floor' },
    shipmentDoorCode: { type: DataTypes.TEXT, field: 'shipment_door_code' },
    isLeaveShipmentNextDoor: { type: DataTypes.BOOLEAN, field: 'shipment_leave_next_door' },
    paymentPaymentId: { type: DataTypes.STRING, field: 'payment_payment_id' },
    paymentIsValid: { type: DataTypes.STRING, field: 'payment_is_valid' },
    paymentInvalidReason: { type: DataTypes.STRING, field: 'payment_invalid_reason' },
    paymentCustomerId: { type: DataTypes.STRING, field: 'payment_customer_id' },
    paymentDocumentNumber: { type: DataTypes.STRING, field: 'payment_document_number' },
    paymentDate: { type: DataTypes.STRING, field: 'payment_date' },
    paymentAmount: { type: DataTypes.STRING, field: 'payment_amount' },
    paymentStatus: { type: DataTypes.STRING, field: 'payment_status' },
    paymentStatusDescription: { type: DataTypes.STRING, field: 'payment_status_description' },
    paymentLastDigits: { type: DataTypes.STRING, field: 'payment_last_digits' },
    paymentToken: { type: DataTypes.STRING, field: 'payment_token' }
  }, {
    tableName: 'order'
  })

  Order.associate = function (models) {
    Order.hasOne(models.Order, { as: 'BaseOrder', foreignKey: 'base_order_id' })
    Order.belongsTo(models.Group, { foreignKey: 'group_id' })
    Order.belongsTo(models.DesiredProduct, { foreignKey: 'desired_product_id' })
    Order.belongsTo(models.Pet, { foreignKey: 'pet_id' })
    Order.belongsTo(models.Supplier, { foreignKey: 'chosen_supplier_id' })
    Order.belongsToMany(models.Product, { as: 'PotentialProducts', through: 'order__potential_product', foreignKey: 'order_id' })
  }

  return Order
}
