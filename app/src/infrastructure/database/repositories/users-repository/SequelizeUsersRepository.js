const UserMapper = require('../../mappers/UserMapper')

class SequelizeUsersRepository {
  constructor ({ database }) {
    this.UserModel = database.User
    this.ContactModel = database.Contact
    this.UserAuthProviderModel = database.UserAuthProvider
    this.CityModel = database.City
  }

  async getById (userId) {
    const include = [
      { model: this.ContactModel, include: [this.CityModel] }
    ]
    const user = await this.UserModel.findByPk(userId, { include })

    if (!user) {
      return null
    }

    return UserMapper.toDomain(user)
  }

  async getByAuthProvider (authProviderUserId, provider) {
    const userAuthProvider = await this.UserAuthProviderModel.findOne(
      {
        where: { authProviderUserId, provider },
        include: [
          {
            model: this.UserModel,
            include: [this.ContactModel]
          }
        ]
      }
    )

    if (!userAuthProvider) {
      return null
    }

    return UserMapper.toDomain(userAuthProvider.User)
  }

  async getAll () {
    const users = await this.UserModel.findAll(
      { include: [this.ContactModel] }
    )
    return users.map(UserMapper.toDomain)
  }

  async create (user) {
    const userAsDb = UserMapper.toDatabase(user)

    const include = [
      { model: this.ContactModel, include: [this.CityModel] }
    ]
    if (user.userAuthProviders && user.userAuthProviders.length) {
      include.push(this.UserAuthProviderModel)
    }
    const createdUser = await this.UserModel.create(userAsDb, { include })

    return this.getById(createdUser.userId)
  }

  async update (user) {
    const userAsDb = UserMapper.toDatabase(user)

    const userInstance = await this.UserModel.findByPk(user.id,
      { include: [this.ContactModel] }
    )
    if (!userInstance) {
      throw new Error(`could not find user with id "${user.id}"`) // TODO: throw operational error
    }

    await userInstance.Contact.update(userAsDb.Contact)
    await userInstance.update(userAsDb)

    const updatedUser = await this.getById(user.id)
    return updatedUser
  }

  async deleteById (userId) {
    await this.UserModel.destroy({ where: { userId } })
  }
}

module.exports = SequelizeUsersRepository
