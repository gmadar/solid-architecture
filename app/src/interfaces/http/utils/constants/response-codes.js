module.exports = {
  general: {
    unexpectedError: 'ERR__UNEXPECTED_ERROR',
    endpointNotFound: 'FAIL__ENDPOINT_NOT_FOUND',
    createFailed: 'ERR__CREATE_FAILED',
    updateFailed: 'ERR__UPDATE_FAILED',
    deleteFailed: 'ERR__DELETE_FAILED',
    fetchFailed: 'ERR__FETCH_FAILED',
    invalidInput: 'FAIL__INVALID_INPUT',
    unauthorized: 'FAIL__UNAUTHORIZED'
  },
  products: {
    RecommendedPriceCalculationFailed: 'ERR__RECOMMENDED_PRICE_CALC_FAILED'
  },
  pets: {
    petNotExists: 'FAIL__PET_NOT_EXISTS'
  },
  groups: {
    groupNotExists: 'FAIL__GROUP_NOT_EXISTS',
    groupNotFound: 'FAIL__GROUP_NOT_FOUND',
    userWithoutCity: 'FAIL__USER_WITHOUT_CITY'
  },
  desiredProducts: {
    desiredProductNotExists: 'FAIL__DESIRED-PRODUCT_NOT_EXISTS'
  },
  orders: {
    orderNotExists: 'FAIL__ORDER_NOT_EXISTS',
    orderInIllegalState: 'FAIL__ORDER_IN_ILLEGAL_STATE',
    invalidPayment: 'FAIL__INVALID_PAYMENT'
  }
}
