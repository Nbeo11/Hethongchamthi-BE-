/* eslint-disable no-useless-catch */
/* eslint-disable indent */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

//Define Collection (Name & Schema)
const OLOGY_COLLECTION_NAME = 'ologies'
const OLOGY_COLLECTION_SCHEMA = Joi.object({
    courseId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    ologyname: Joi.string().required().min(3).max(50).trim().strict(),
    gradeOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await OLOGY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        const newOlogyToAdd = {
            ...validData,
            courseId: new ObjectId(validData.courseId)
        }
        const createdOlogy = await GET_DB().collection(OLOGY_COLLECTION_NAME).insertOne(newOlogyToAdd)
        return createdOlogy
        // return await GET_DB().collection(OLOGY_COLLECTION_NAME).insertOne(validData)
    } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
    try {
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllOlogies = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allOlogies = await GET_DB().collection(OLOGY_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allOlogies;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const pushGradeOrderIds = async (grade) => {
    try {
        const result = await GET_DB().collection(OLOGY_COLLECTION_NAME).findOneAndUpdate(
        { _id: new ObjectId(grade.ologyId) },
        { $push: { gradeOrderIds: new ObjectId(grade._id) } },
        { returnDocument: 'after' }
        )

        return result.value
    } catch (error) { throw new Error(error) }
}


export const ologyModel = {
    OLOGY_COLLECTION_NAME,
    OLOGY_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllOlogies,
    pushGradeOrderIds
}