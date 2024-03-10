/* eslint-disable indent */
import express from 'express'
import { departmentController } from '~/controllers/departmentController'
import { departmentValidation } from '~/validations/departmentValidation'

const Router = express.Router()

Router.route('/')
    .get(departmentController.getAllByFacultyId)
    .post(departmentValidation.createNew, departmentController.createNew)

Router.route('/:id')
    .get(departmentController.getDetails)
    .put(departmentValidation.update, departmentController.update)
    .delete(departmentValidation.deleteItem, departmentController.deleteItem)


export const departmentRoute = Router