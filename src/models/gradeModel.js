/* eslint-disable no-useless-catch */
/* eslint-disable indent */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

//Define Collection (Name & Schema)
const GRADE_COLLECTION_NAME = 'grades'
const GRADE_COLLECTION_SCHEMA = Joi.object({
    courseId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    ologyId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    unknowOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    gradename: Joi.string().required().min(3).max(50).trim().strict(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await GRADE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newGradeToAdd = {
            ...validData,
            courseId: new ObjectId(validData.courseId),
            ologyId: new ObjectId(validData.ologyId)
        }
        const createdGrade = await GET_DB().collection(GRADE_COLLECTION_NAME).insertOne(newGradeToAdd)
        return createdGrade
    } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
    try {
        const result = await GET_DB().collection(GRADE_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllGrades = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allGrades = await GET_DB().collection(GRADE_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allGrades;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(GRADE_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

export const gradeModel = {
    GRADE_COLLECTION_NAME,
    GRADE_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllGrades
}