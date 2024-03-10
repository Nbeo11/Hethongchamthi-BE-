/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        courseId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        ologyId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        gradeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        studentname: Joi.string().required().min(3).max(50).trim().strict(),
        password: Joi.string().required().min(3).max(50).trim().strict(),
        birth: Joi.date().iso(),
        gender: Joi.string().valid('male', 'female', 'other'),
        phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/),
        email: Joi.string().email().required(),
        role: Joi.string().required().valid('role1', 'role2', 'role3', 'role4', 'role5') // Thêm các vai trò mới vào đây
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }

}

const update = async (req, res, next) => {
    const correctCondition = Joi.object({
        //studentname: Joi.string().min(3).max(50).trim().strict(),
        birth: Joi.date().iso(),
        gender: Joi.string().valid('male', 'female', 'other'),
        phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/),
        email: Joi.string().email(),
        role: Joi.string().valid('admin', 'student'),
        //gradeId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    })

    try {
        await correctCondition.validateAsync(req.body, {
            abortEarly: false,
            allowUnknown: true
        })

        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }

}

const deleteItem = async (req, res, next) => {
    const correctCondition = Joi.object({
        id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    })

    try {
        await correctCondition.validateAsync(req.params)
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }

}

export const studentValidation = {
    createNew,
    update,
    deleteItem
}
