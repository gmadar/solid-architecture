const deleteOrderFactory = require('../deleteOrder')

test('USE-CASE deleteOrder: delete order which not exists', async () => {
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(null)
  }
  const deleteOrder = deleteOrderFactory({ ordersRepository })

  const orderId = 'un-existent-id'
  await expect(
    deleteOrder(orderId)
  ).rejects.toMatchObject({ code: deleteOrder.codes.ORDER_NOT_EXISTS })
})

test('USE-CASE deleteOrder: deletes the order', async () => {
  const mockOrder = { id: 'order-id' }
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(mockOrder),
    deleteById: jest.fn().mockResolvedValue()
  }
  const deleteOrder = deleteOrderFactory({ ordersRepository })

  const orderId = 'order-id'
  await deleteOrder(orderId)
  expect(ordersRepository.deleteById).toBeCalledWith('order-id')
})
