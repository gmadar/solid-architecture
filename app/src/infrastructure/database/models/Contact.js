const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Contact = sequelize.define('Contact',
    {
      contactId: {
        field: 'contact_id',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      phone: { field: 'phone_1', type: DataTypes.STRING },
      phone2: { field: 'phone_2', type: DataTypes.STRING },
      fax: DataTypes.STRING,
      address: DataTypes.STRING,
      doorCode: { field: 'door_code', type: DataTypes.STRING },
      floor: DataTypes.STRING,
      isLeaveShipmentNextDoor: { field: 'is_leave_shipment_next_door', type: DataTypes.BOOLEAN },
      isAgreedToCommercial: { field: 'is_agreed_to_commercial', type: DataTypes.BOOLEAN }
    }, {
      tableName: 'contact'
    }
  )

  Contact.associate = function (models) {
    Contact.belongsTo(models.City, { foreignKey: 'city_id' })
  }

  return Contact
}
