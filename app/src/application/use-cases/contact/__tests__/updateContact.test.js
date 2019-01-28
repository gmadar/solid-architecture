const updateContactFactory = require('../updateContact')

test('USE-CASE updateContact: unauthorized update of another user', async () => {
  const currentUser = {
    id: 'user-id',
    contact: { id: 'contact-id' }
  }
  const updateContact = updateContactFactory({ currentUser })

  const contactData = {
    'id': 'another-contact-id'
  }

  await expect(
    updateContact(contactData)
  ).rejects.toMatchObject({ code: updateContact.codes.UNAUTHORIZED_USER })
})

test('USE-CASE updateContact: invalid contact data - invalid email', async () => {
  const currentUser = {
    id: 'user-id',
    contact: { id: 'contact-id', toJSON: () => ({}) }
  }
  const updateContact = updateContactFactory({ currentUser })

  const contactData = {
    'id': 'contact-id',
    'email': 'invalid'
  }
  await expect(
    updateContact(contactData)
  ).rejects.toMatchObject({ code: updateContact.codes.INVALID_INPUT })
})

test('USE-CASE updateContact: updates contact', async () => {
  const currentUser = {
    id: 'user-id',
    contact: {
      id: 123,
      toJSON: () => ({ id: 123, contact: { toJSON: () => ({}) } })
    }
  }
  const contactsRepository = {
    update: jest.fn().mockResolvedValue()
  }
  const updateContact = updateContactFactory({ currentUser, contactsRepository })

  const contactData = {
    'id': 123,
    'email': 'valid@email.com',
    'name': 'John Snow'
  }
  await updateContact(contactData)
  expect(contactsRepository.update).toBeCalled()
})

test('USE-CASE updateContact: existing fields and new fields are merged', async () => {
  const currentUser = {
    id: 'user-id',
    contact: {
      id: 123,
      toJSON: () => ({
        id: 123, email: 'valid@email.com', name: 'Mr. Anderson'
      })
    }
  }
  const contactsRepository = {
    update: jest.fn().mockResolvedValue()
  }
  const updateContact = updateContactFactory({ currentUser, contactsRepository })

  const contactData = {
    'id': 123,
    'name': 'Neo'
  }
  await updateContact(contactData)
  expect(contactsRepository.update).toBeCalledWith(
    expect.objectContaining({
      id: 123,
      email: 'valid@email.com',
      name: 'Neo'
    })
  )
})
