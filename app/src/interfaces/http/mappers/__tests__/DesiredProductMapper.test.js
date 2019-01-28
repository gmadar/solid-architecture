const mockPropertiesMapper = {
  fromClient: jest.fn(),
  toClient: jest.fn()
}
jest.mock('../PropertiesMapper', () => mockPropertiesMapper)

const DesiredProductMapper = require('../DesiredProductMapper')

test('HTTP MAPPER: DesiredProductMapper: from client - regular fields mapped', async () => {
  const clientData = { notes: 'comment' }
  const response = DesiredProductMapper.fromClient(clientData)

  const expectedResponse = {
    notes: clientData.notes
  }
  expect(response).toEqual(expectedResponse)
})

test('HTTP MAPPER: DesiredProductMapper: from client - product properties mapped', async () => {
  const clientData = { notes: 'comment', properties: [] }
  DesiredProductMapper.fromClient(clientData)
  expect(mockPropertiesMapper.fromClient).toBeCalledWith(clientData.properties)
})

test('HTTP MAPPER: DesiredProductMapper: to client - regular fields mapped', async () => {
  const domainData = { toJSON: () => ({ notes: 'comment' }) }
  const response = DesiredProductMapper.toClient(domainData)
  expect(response).toEqual(domainData.toJSON())
})

test('HTTP MAPPER: DesiredProductMapper: to client - product properties mapped', async () => {
  const domainData = { toJSON: () => ({ notes: 'comment', properties: [] }) }
  DesiredProductMapper.toClient(domainData)
  expect(mockPropertiesMapper.toClient).toBeCalledWith(domainData.properties)
})
