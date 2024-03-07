/* eslint-disable no-useless-catch */
/* eslint-disable indent */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { gradeModel } from './gradeModel'
import { ologyModel } from './ologyModel'

//Define Collection (Name & Schema)
const COURSE_COLLECTION_NAME = 'courses'
const COURSE_COLLECTION_SCHEMA = Joi.object({
    coursename: Joi.string().required().min(3).max(50).trim().strict(),
    // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn
    ologyOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)

})

const validateBeforeCreate = async (data) => {
    return await COURSE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        // const createdCourse = await GET_DB().collection(COURSE_COLLECTION_NAME).insertOne(data)
        // return createdCourse
        return await GET_DB().collection(COURSE_COLLECTION_NAME).insertOne(validData)
    } catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
    try {
        const result = await GET_DB().collection(COURSE_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllCourses = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allCourses = await GET_DB().collection(COURSE_COLLECTION_NAME).find().toArray();

        // Trả về kết quả
        return allCourses;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        // const result = await GET_DB().collection(COURSE_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
        const result = await GET_DB().collection(COURSE_COLLECTION_NAME).aggregate([
            { $match: {
                _id: new ObjectId(id),
                _destroy: false
            } },
            { $lookup: {
                from: ologyModel.OLOGY_COLLECTION_NAME,
                localField: '_id',
                foreignField: 'courseId',
                as: 'ologies'
            } },
            { $lookup: {
                from: gradeModel.GRADE_COLLECTION_NAME,
                localField: '_id',
                foreignField: 'courseId',
                as: 'grades'
            } }
        ]).toArray()
        return result[0] || {}
    } catch (error) { throw new Error(error) }
}

//Nhiệm vụ là push một giá trị ologyId và cuối mảng ologyOrderIds
const pushOlogyOrderIds = async (ology) => {
    try {
        const result = await GET_DB().collection(COURSE_COLLECTION_NAME).findOneAndUpdate(
        { _id: new ObjectId(ology.courseId) },
        { $push: { ologyOrderIds: new ObjectId(ology._id) } },
        { returnDocument: 'after' }
        )

        return result.value
    } catch (error) { throw new Error(error) }
}

export const courseModel = {
    COURSE_COLLECTION_NAME,
    COURSE_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllCourses,
    pushOlogyOrderIds
}