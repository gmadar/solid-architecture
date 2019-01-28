const PromiseRouter = require('express-promise-router')
const { inject } = require('awilix-express')
const Status = require('http-status')
const _ = require('lodash')

const { success, fail } = require('../utils/httpResponses')
const codes = require('../utils/constants/response-codes')
const { secureRoute, roles: { admin } } = require('../utils/secureRoute')
const OrderMapper = require('../mappers/OrderMapper')
const GroupMapper = require('../mappers/GroupMapper')

const GroupsController = {
  get router () {
    const router = PromiseRouter()

    router.get('/', this.getAllGroups)
    router.get('/last-joined', secureRoute(), this.getLastJoinedGroup)
    router.get('/:id', secureRoute(), this.getById)
    router.post('/join', secureRoute(), this.joinGroup)

    router.post('/', secureRoute(admin), this.createGroup)
    router.put('/:id', secureRoute(admin), this.updateGroup)
    router.post('/:id/close', secureRoute(admin), this.closeGroup)

    return router
  },

  getById: inject(({ getGroupById }) =>
    async (req, res) => {
      const groupId = req.params.id

      try {
        const group = await getGroupById(groupId)
        const clientResponse = GroupMapper.toClient(group)
        res.status(Status.OK).json(success(clientResponse))
      } catch (err) {
        const { GROUP_NOT_EXISTS } = getGroupById.codes
        if (err.isOperational) {
          if (err.code === GROUP_NOT_EXISTS) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.groups.groupNotExists, err.message))
          }
        }
        throw err
      }
    }
  ),

  getAllGroups: inject(({ getAllGroups }) =>
    async (req, res) => {
      let groups = await getAllGroups()
      const clientResponse = groups.map(GroupMapper.toClient)
      res.status(Status.OK).json(success(clientResponse))
    }
  ),

  createGroup: inject(({ createGroup }) =>
    async (req, res) => {
      const { group } = req.body
      if (_.isEmpty(group)) {
        return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, 'group is missing in body.'))
      }

      try {
        const createdGroup = await createGroup(group)
        const clientResponse = GroupMapper.toClient(createdGroup)
        res.status(Status.OK).json(success(clientResponse))
      } catch (err) {
        const { INVALID_INPUT } = createGroup.codes
        if (err.isOperational) {
          if (err.code === INVALID_INPUT) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, err.message, err.data))
          }
        }
        throw err
      }
    }
  ),

  updateGroup: inject(({ updateGroup }) =>
    async (req, res) => {
      const { group } = req.body
      const { id } = req.params
      if (_.isEmpty(group)) {
        return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, 'group is missing in body.'))
      }
      group.id = _.toNumber(id)

      try {
        await updateGroup(group)
        res.status(Status.OK).json(success())
      } catch (err) {
        const { INVALID_INPUT, GROUP_NOT_EXISTS } = updateGroup.codes
        if (err.isOperational) {
          if (err.code === INVALID_INPUT) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, err.message, err.data))
          }
          if (err.code === GROUP_NOT_EXISTS) {
            return res.status(Status.BAD_REQUEST)
              .json(fail(codes.groups.groupNotExists, err.message, err.data))
          }
        }
        throw err
      }
    }
  ),

  joinGroup: inject(({ joinGroup }) =>
    async (req, res) => {
      const { order } = req.body

      let orderAsDomain
      try {
        orderAsDomain = OrderMapper.fromClient(order)
      } catch (err) {
        return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, err.message))
      }

      try {
        const { groupId, desiredProductId, orderId } = await joinGroup(orderAsDomain)
        res.status(Status.OK).json(success({ groupId, orderId, desiredProductId }))
      } catch (err) {
        const { INVALID_INPUT, GROUP_NOT_FOUND, USER_WITHOUT_CITY } = joinGroup.codes
        if (err.isOperational) {
          if (err.code === INVALID_INPUT) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, err.message, err.data))
          }
          if (err.code === GROUP_NOT_FOUND) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.groups.groupNotFound, err.message))
          }
          if (err.code === USER_WITHOUT_CITY) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.groups.userWithoutCity, err.message))
          }
        }
        throw err
      }
    }
  ),

  getLastJoinedGroup: inject(({ getLastJoinedGroup }) =>
    async (req, res) => {
      try {
        const group = await getLastJoinedGroup()
        const clientResponse = GroupMapper.toClient(group)
        res.status(Status.OK).json(success(clientResponse))
      } catch (err) {
        const { GROUP_NOT_EXISTS } = getLastJoinedGroup.codes
        if (err.isOperational) {
          if (err.code === GROUP_NOT_EXISTS) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.groups.groupNotExists, err.message, err.data))
          }
        }
        throw err
      }
    }
  ),

  closeGroup: inject(({ closeGroup }) =>
    async (req, res) => {
      const { id } = req.params
      const options = req.body

      try {
        const { closedGroup, createdGroup } = await closeGroup(id, options)
        res.status(Status.OK).json(success({ closedGroup, createdGroup }))
      } catch (err) {
        const { INVALID_INPUT } = closeGroup.codes
        if (err.isOperational) {
          if (err.code === INVALID_INPUT) {
            return res.status(Status.BAD_REQUEST).json(fail(codes.general.invalidInput, err.message, err.data))
          }
        }
        throw err
      }
    }
  )
}

module.exports = GroupsController
