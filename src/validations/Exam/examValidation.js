/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        moduleId: Joi.string().required().min(3).max(50).trim().strict(),
        score: Joi.number().required().min(1),
        chapter: Joi.string().required().min(3).max(50).trim().strict(),
        difficulty: Joi.string().trim().strict(),
        questionId: Joi.string().required().min(3).max(50).trim().strict(),
        examstatus: Joi.number().valid(1, 2, 3).default(1)
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
        moduleId: Joi.string().min(3).max(50).trim().strict(),
        score: Joi.number().min(1),
        chapter: Joi.string().min(3).max(50).trim().strict(),
        difficulty: Joi.string().trim().strict(),
        questionId: Joi.string().min(3).max(50).trim().strict(),
        examstatus: Joi.number().valid(1, 2, 3).default(1)
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

export const examValidation = {
    createNew,
    update,
    deleteItem
}
