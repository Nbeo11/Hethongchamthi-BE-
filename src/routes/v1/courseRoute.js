/* eslint-disable indent */
import express from 'express'
import { courseController } from '~/controllers/courseController'
import { courseValidation } from '~/validations/courseValidation'

const Router = express.Router()

Router.route('/')
    .get(courseController.getAllCourses)
    .post(courseValidation.createNew, courseController.createNew)

Router.route('/:id')
    .get(courseController.getDetails)
    .put()

export const courseRoute = Router