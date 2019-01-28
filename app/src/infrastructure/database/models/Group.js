const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Group = sequelize.define('Group',
    {
      groupId: {
        field: 'group_id',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      creatorUserId: { field: 'creator_user_id', type: DataTypes.INTEGER },
      status: DataTypes.STRING,
      endDate: { field: 'end_date', type: DataTypes.STRING },
      fakeAmount: { field: 'fake_amount', type: DataTypes.INTEGER }
    }, {
      tableName: 'group'
    }
  )

  Group.associate = function (models) {
    Group.belongsTo(models.User, { foreignKey: 'creator_user_id' })
    Group.hasMany(models.Order, { foreignKey: 'group_id' })
    Group.belongsToMany(
      models.Area,
      {
        through: 'group__area',
        foreignKey: 'group_id',
        otherKey: 'area_id'
      })
    Group.belongsToMany(
      models.City,
      {
        through: 'group__city',
        foreignKey: 'group_id',
        otherKey: 'city_id'
      })
  }

  return Group
}
