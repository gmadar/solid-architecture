const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Area = sequelize.define('Area',
    {
      areaId: {
        field: 'area_id',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      areaName: { field: 'area_name', type: DataTypes.STRING }
    }, {
      tableName: 'area'
    }
  )

  Area.associate = function (models) {
    Area.hasMany(models.City, { foreignKey: 'area_id' })
  }

  return Area
}
