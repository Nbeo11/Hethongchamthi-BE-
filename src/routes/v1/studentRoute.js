/* eslint-disable indent */
import express from 'express'
import { studentController } from '~/controllers/studentController'
import { studentValidation } from '~/validations/studentValidation'

const Router = express.Router()

Router.route('/')
    .post(studentValidation.createNew, studentController.createNew)

Router.route('/:id')
    .get(studentController.getDetails)
    .put(studentValidation.update, studentController.update)
    .delete(studentValidation.deleteItem, studentController.deleteItem)


export const studentRoute = Router