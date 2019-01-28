const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const PropertyValueOption = sequelize.define('PropertyValueOption',
    {
      propertyTypeId: { field: 'property_type_id', type: DataTypes.INTEGER, primaryKey: true },
      valueOptionId: { field: 'value_option_id', type: DataTypes.STRING, primaryKey: true },
      labelEng: { field: 'label_eng', type: DataTypes.STRING },
      labelHeb: { field: 'label_heb', type: DataTypes.STRING }
    }, {
      tableName: 'property_value_option'
    }
  )

  return PropertyValueOption
}
