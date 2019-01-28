const codes = {}

module.exports = ({ paymentService, getOrderById, getProductById }) => {
  const res = async function beginPayment (orderId, endRedirectUrl) {
    const order = await getOrderById(orderId)

    const { quantity, singleUnitPrice, chosenProductId } = order

    const product = await getProductById(chosenProductId, { includePrices: false })
    const sackSizeProperty = product.properties.find(({ propertyTypeId }) => propertyTypeId === 'SACK_SIZE')
    const sackSize = sackSizeProperty.value

    const items = []
    items.push({
      id: `product_id-${product.id}`,
      name: product.nameHeb,
      description: `${sackSize} ק"ג`,
      unitPrice: singleUnitPrice,
      quantity
    })

    // TODO: implement discount mechanism
    const discount = 20
    if (discount) {
      items.push({
        id: 'discount',
        name: 'הנחה',
        description: `${discount} ש"ח`,
        unitPrice: discount * -1,
        quantity: 1
      })
    }

    const beginRedirectUrl = await paymentService.beginRedirect({ orderId, items, endRedirectUrl })
    return { beginRedirectUrl }
  }
  res.codes = codes
  return res
}
