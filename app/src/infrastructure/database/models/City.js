const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const City = sequelize.define('City',
    {
      cityId: {
        field: 'city_id',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cityName: { field: 'city_name', type: DataTypes.STRING },
      displayName: { field: 'display_name', type: DataTypes.STRING }
    }, {
      tableName: 'city'
    }
  )

  City.associate = function (models) {
    City.belongsTo(models.Area, { foreignKey: 'area_id' })
  }

  return City
}
