/* eslint-disable indent */
import express from 'express'
import { gradeController } from '~/controllers/gradeController'
import { gradeValidation } from '~/validations/gradeValidation'

const Router = express.Router()

Router.route('/')
    .get(gradeController.getAllGrades)
    .post(gradeValidation.createNew, gradeController.createNew)

Router.route('/:id')
    .get(gradeController.getDetails)
    .put()

export const gradeRoute = Router