/* eslint-disable indent */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

//Define Collection (Name & Schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
    username: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().required().min(3).trim().strict(),
    password: Joi.string().required().min(3).max(50).trim().strict(),
    role: Joi.number(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)

})

const validateBeforeCreate = async (data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        // const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(data)
        // return createdUser
        return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
    try {
        const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

export const userModel = {
    USER_COLLECTION_NAME,
    USER_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails
}