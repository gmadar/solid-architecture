const { statuses } = require('../../../../domain/order/Order')
const provideShipmentDetailsFactory = require('../provideShipmentDetails')

test('USE-CASE provideShipmentDetails: order is updated with all shipment fields', async () => {
  const currentOrder = { status: statuses.pendingForShipmentDetails }
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(currentOrder)
  }
  const updateOrder = jest.fn().mockResolvedValue()
  const provideShipmentDetails = provideShipmentDetailsFactory({ ordersRepository, updateOrder })

  const orderId = 'order-id'
  const shipmentData = {
    'shipmentReceiver': 'boris',
    'shipmentPhone': '052-123456',
    'shipmentAddress': 'maze meshane street',
    'shipmentCityId': 1,
    'isLeaveShipmentNextDoor': true,
    'shipmentFloor': '1st floor'
  }
  await provideShipmentDetails(orderId, shipmentData)
  expect(updateOrder.mock.calls[0][0]).toMatchObject(
    expect.objectContaining(shipmentData)
  )
})

test('USE-CASE provideShipmentDetails: order status is changed to "supplier handling" status', async () => {
  const currentOrder = { status: statuses.pendingForShipmentDetails }
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(currentOrder)
  }
  const updateOrder = jest.fn().mockResolvedValue()
  const provideShipmentDetails = provideShipmentDetailsFactory({ ordersRepository, updateOrder })

  const orderId = 'order-id'
  const shipmentData = {
    'shipmentReceiver': 'boris',
    'shipmentPhone': '052-123456',
    'shipmentAddress': 'maze meshane street',
    'shipmentCityId': 1,
    'isLeaveShipmentNextDoor': true,
    'shipmentFloor': '1st floor'
  }
  await provideShipmentDetails(orderId, shipmentData)
  expect(updateOrder.mock.calls[0][0]).toMatchObject(
    expect.objectContaining({ 'status': statuses.supplierHandling })
  )
})

test('USE-CASE provideShipmentDetails: reject unauthorized fields', async () => {
  const currentOrder = { status: statuses.pendingForShipmentDetails }
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(currentOrder)
  }
  const updateOrder = jest.fn().mockResolvedValue()
  const provideShipmentDetails = provideShipmentDetailsFactory({ ordersRepository, updateOrder })

  const orderId = 'order-id'
  const shipmentData = {
    singleUnitPrice: 1
  }
  expect(provideShipmentDetails(orderId, shipmentData))
    .rejects.toThrow('received invalid input fields')
})

test('USE-CASE provideShipmentDetails: reject when not in "pending for shipment details" status', async () => {
  const currentOrder = { status: statuses.pendingForJoiners }
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(currentOrder)
  }
  const updateOrder = jest.fn().mockResolvedValue()
  const provideShipmentDetails = provideShipmentDetailsFactory({ ordersRepository, updateOrder })

  const orderId = 'order-id'
  const shipmentData = {
    'shipmentReceiver': 'boris',
    'shipmentPhone': '052-123456',
    'shipmentAddress': 'maze meshane street',
    'shipmentCityId': 1,
    'isLeaveShipmentNextDoor': true,
    'shipmentFloor': '1st floor'
  }
  expect(provideShipmentDetails(orderId, shipmentData))
    .rejects.toThrow('shipment details can be provided only in \'pending for shipment details\' status')
})

test('USE-CASE provideShipmentDetails: reject when missing required shipment fields', async () => {
  const currentOrder = { status: statuses.pendingForShipmentDetails }
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(currentOrder)
  }
  const updateOrder = jest.fn().mockResolvedValue()
  const provideShipmentDetails = provideShipmentDetailsFactory({ ordersRepository, updateOrder })

  const orderId = 'order-id'
  const shipmentData = {
    'shipmentReceiver': 'boris'
  }
  expect(provideShipmentDetails(orderId, shipmentData))
    .rejects.toThrow(/all shipment fields .* are required/)
})

test('USE-CASE provideShipmentDetails: reject when order not exists', async () => {
  const ordersRepository = {
    getById: jest.fn().mockResolvedValue(null)
  }
  const updateOrder = jest.fn().mockResolvedValue()
  const provideShipmentDetails = provideShipmentDetailsFactory({ ordersRepository, updateOrder })

  const orderId = 'order-id'
  const shipmentData = {}
  expect(provideShipmentDetails(orderId, shipmentData))
    .rejects.toThrow(/order .* not exists/)
})
