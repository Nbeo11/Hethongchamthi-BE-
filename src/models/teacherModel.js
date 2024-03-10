/* eslint-disable no-useless-catch */
/* eslint-disable indent */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { studentModel } from './studentModel'

//Define Collection (Name & Schema)
const TEACHER_COLLECTION_NAME = 'teachers'
const TEACHER_COLLECTION_SCHEMA = Joi.object({
    facultyId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    departmentId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    studentOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    teachername: Joi.string().required().min(3).max(50).trim().strict(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await TEACHER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newTeacherToAdd = {
            ...validData,
            facultyId: new ObjectId(validData.facultyId),
            departmentId: new ObjectId(validData.departmentId)
        }
        const createdTeacher = await GET_DB().collection(TEACHER_COLLECTION_NAME).insertOne(newTeacherToAdd)
        return createdTeacher
    } catch (error) { throw new Error(error) }
}

const findOneById = async (teacherId) => {
    try {
        const result = await GET_DB().collection(TEACHER_COLLECTION_NAME).findOne({
            _id: new ObjectId(teacherId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllTeachers = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allTeachers = await GET_DB().collection(TEACHER_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allTeachers;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(TEACHER_COLLECTION_NAME).aggregate([
            {
                $match: {
                    _id: new ObjectId(id),
                    _destroy: false
                }
            },
            {
                $lookup: {
                    from: studentModel.STUDENT_COLLECTION_NAME,
                    localField: '_id',
                    foreignField: 'teacherId',
                    as: 'students'
                }
            }
        ]).toArray()
        return result[0] || {}
    } catch (error) { throw new Error(error) }
}

const deleteManyByTeacherId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(TEACHER_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        })
        console.log('deleteManyByTeacherId - teacher', result)
        return result
    } catch (error) { throw new Error(error) }
}


export const teacherModel = {
    TEACHER_COLLECTION_NAME,
    TEACHER_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllTeachers,
    deleteManyByTeacherId
}