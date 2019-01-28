const getAllAreasFactory = require('../getAllAreas')

test('USE-CASE getAllAreas: no areas', async () => {
  const geoRepository = {
    getAllAreas: jest.fn().mockResolvedValue([])
  }
  const getAllAreas = getAllAreasFactory({ geoRepository })

  const areas = await getAllAreas()
  expect(areas.length).toBe(0)
})

test('USE-CASE getAllAreas: get all areas', async () => {
  const mockareas = [
    { id: 'area-id-1' },
    { id: 'area-id-2' }
  ]
  const geoRepository = {
    getAllAreas: jest.fn().mockResolvedValue(mockareas)
  }
  const getDesiredProduct = jest.fn().mockResolvedValue(i => i)
  const getAllAreas = getAllAreasFactory({ geoRepository, getDesiredProduct })

  const response = await getAllAreas()
  expect(response.length).toBe(2)
  expect(response[0].id).toBe(mockareas[0].id)
  expect(response[1].id).toBe(mockareas[1].id)
})
