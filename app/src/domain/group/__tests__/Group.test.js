const Group = require('../Group')

test('DOMAIN Group: getTotalOrders - without fake amount', async () => {
  const instance = new Group({
    orderIds: ['id-1', 'id-2']
  })
  expect(instance.getTotalOrders()).toBe(2)
})

test('DOMAIN Group: getTotalOrders - with fake amount', async () => {
  const instance = new Group({
    orderIds: ['id-1', 'id-2'],
    fakeAmount: 100
  })
  expect(instance.getTotalOrders()).toBe(100 + 2)
})

test('DOMAIN Group: isJoinable - not joinable by status', async () => {
  const instance = new Group({
    cityIds: [1],
    areaIds: [],
    status: 'NOT-OPEN' // anything which is not OPEN_STATUS should make group not joinable
  })
  const user = {
    contact: {
      city: {
        id: 1
      }
    }
  }
  expect(instance.isJoinable(user)).toBe(false)
})

/**
 it was decided to disable groups per area/city in the MVP, so tests are disabled until feature will be enabled
 **/
// const OPEN_STATUS = 'OPEN' // move to top of file
// test('DOMAIN Group: isJoinable - joinable by city', async () => {
//   const instance = new Group({
//     cityIds: [1],
//     areaIds: [],
//     status: OPEN_STATUS
//   })
//   const user = {
//     contact: {
//       city: {
//         id: 1
//       }
//     }
//   }
//   expect(instance.isJoinable(user)).toBe(true)
// })
//
// test('DOMAIN Group: isJoinable - not joinable by city', async () => {
//   const instance = new Group({
//     cityIds: [1],
//     areaIds: [],
//     status: OPEN_STATUS
//   })
//   const user = {
//     contact: {
//       city: {
//         id: 2
//       }
//     }
//   }
//   expect(instance.isJoinable(user)).toBe(false)
// })
//
// test('DOMAIN Group: isJoinable - joinable by area', async () => {
//   const instance = new Group({
//     cityIds: [],
//     areaIds: [100],
//     status: OPEN_STATUS
//   })
//   const user = {
//     contact: {
//       city: {
//         id: 1,
//         areaId: 100
//       }
//     }
//   }
//   expect(instance.isJoinable(user)).toBe(true)
// })
//
// test('DOMAIN Group: isJoinable - not joinable by area', async () => {
//   const instance = new Group({
//     cityIds: [],
//     areaIds: [100],
//     status: OPEN_STATUS
//   })
//   const user = {
//     contact: {
//       city: {
//         id: 1,
//         areaId: 200
//       }
//     }
//   }
//   expect(instance.isJoinable(user)).toBe(false)
// })
//
// test('DOMAIN Group: isJoinable - joinable by area and by city', async () => {
//   const instance = new Group({
//     cityIds: [1],
//     areaIds: [100],
//     status: OPEN_STATUS
//   })
//   const user = {
//     contact: {
//       city: {
//         id: 1,
//         areaId: 100
//       }
//     }
//   }
//   expect(instance.isJoinable(user)).toBe(true)
// })
//
// test('DOMAIN Group: isJoinable - user without city', async () => {
//   const instance = new Group()
//   const user = {
//     contact: {
//       city: undefined
//     }
//   }
//   expect(
//     () => instance.isJoinable(user)
//   ).toThrow('user must have a city to join a group')
// })
