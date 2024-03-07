/* eslint-disable indent */
import express from 'express'
import { ologyController } from '~/controllers/ologyController'
import { ologyValidation } from '~/validations/ologyValidation'

const Router = express.Router()

Router.route('/')
    .get(ologyController.getAllOlogies)
    .post(ologyValidation.createNew, ologyController.createNew)

Router.route('/:id')
    .get(ologyController.getDetails)
    .put()

export const ologyRoute = Router