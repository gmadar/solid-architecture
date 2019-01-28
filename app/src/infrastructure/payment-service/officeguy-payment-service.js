const axios = require('axios')
const _ = require('lodash')

const URL_PREFIX = 'https://www.myofficeguy.com/api'
const BEGIN_REDIRECT = `${URL_PREFIX}/billing/payments/beginredirect`
const GET_PAYMENT = `${URL_PREFIX}/billing/payments/get`

// TODO: tests
module.exports = ({ config, logger, currentUser }) => {
  const { companyId, apiKey } = config.get('payment')
  const Credentials = {
    'CompanyID': companyId,
    'APIKey': apiKey
  }

  return {
    /**
     * @param {Object[]} items - cart items to pay for
     * @param {string} items[].id
     * @param {string} items[].name
     * @param {string} items[].description
     * @param {string} items[].quantity
     * @param {string} items[].unitPrice
     */
    beginRedirect: async ({ orderId, items, endRedirectUrl }) => {
      logger.info(`beginning payment redirect for order "${orderId}". items: ${JSON.stringify(items)}`)
      const { sendUpdateByEmailAddress } = config.get('payment')

      const Items = items.map(item => (
        {
          'Item': {
            'Name': item.name,
            'Currency': 'ILS',
            'ExternalIdentifier': item.id,
            'SearchMode': 'Automatic'
          },
          'UnitPrice': item.unitPrice,
          'Quantity': item.quantity,
          'Currency': 'ILS',
          'Description': item.description,
          'UseItemDetails': false
        }))

      const body = {
        'Customer': {
          'ExternalIdentifier': `user_id-${currentUser.id}`,
          'Name': currentUser.contact.name,
          'Phone': currentUser.contact.phone,
          'EmailAddress': currentUser.contact.email,
          'SearchMode': 'Automatic',
          'additionalProp1': { userId: currentUser.id }
        },
        Items,
        'VATIncluded': true,
        'DocumentType': 'Invoice',
        'RedirectURL': endRedirectUrl,
        'ExternalIdentifier': `order_id-${orderId}`,
        'MaximumPayments': 1,
        'SendUpdateByEmailAddress': sendUpdateByEmailAddress,
        'ExpirationHours': 99,
        'Theme': 'Joyness',
        'Language': 'Hebrew',
        Credentials,
        'ResponseLanguage': 'hebrew'
      }
      const { data: response } = await axios.post(BEGIN_REDIRECT, body)

      const beginRedirectUrl = _.get(response, 'Data.RedirectURL')
      if (response['Status'] !== 0 || !beginRedirectUrl) {
        throw new Error(`failed to perform beginRedirect. response: ${JSON.stringify(response)}`)
      }
      return beginRedirectUrl
    },

    getPayment: async (paymentId) => {
      const body = {
        'PaymentID': paymentId,
        Credentials,
        'ResponseLanguage': 'hebrew'
      }
      const { data: response } = await axios.post(GET_PAYMENT, body)
      const payment = _.get(response, 'Data.Payment')
      if (response['Status'] !== 0 || !payment) {
        throw new Error(`failed to perform getPayment. response: ${JSON.stringify(response)}`)
      }
      return payment
    }
  }
}
