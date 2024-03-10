/* eslint-disable no-useless-catch */
/* eslint-disable indent */
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

//Define Collection (Name & Schema)
const STUDENT_COLLECTION_NAME = 'students'
const STUDENT_COLLECTION_SCHEMA = Joi.object({
    courseId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    ologyId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    gradeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    studentname: Joi.string().required().min(3).max(50).trim().strict(),
    password: Joi.string().required().min(3).max(50).trim().strict(),
    birth: Joi.date().iso(),
    gender: Joi.string().valid('male', 'female', 'other'),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/),
    email: Joi.string().email().required(),
    role: Joi.string().required().valid('role1', 'role2', 'role3', 'role4', 'role5'), // Thêm các vai trò mới vào đây
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
    return await STUDENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)
        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newStudentToAdd = {
            ...validData,
            courseId: new ObjectId(validData.courseId),
            ologyId: new ObjectId(validData.ologyId),
            gradeId: new ObjectId(validData.gradeId),
        }
        const createdStudent = await GET_DB().collection(STUDENT_COLLECTION_NAME).insertOne(newStudentToAdd)
        return createdStudent
    } catch (error) { throw new Error(error) }
}

const findOneById = async (studentId) => {
    try {
        const result = await GET_DB().collection(STUDENT_COLLECTION_NAME).findOne({
            _id: new ObjectId(studentId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllStudents = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allStudents = await GET_DB().collection(STUDENT_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allStudents;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(STUDENT_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByStudentId = async (gradeId) => {
    try {
        const result = await GET_DB().collection(STUDENT_COLLECTION_NAME).deleteMany({
            gradeId: new ObjectId(gradeId)
        })
        console.log('deleteManyByStudentId - student', result)
        return result
    } catch (error) { throw new Error(error) }
}


export const studentModel = {
    STUDENT_COLLECTION_NAME,
    STUDENT_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllStudents,
    deleteManyByStudentId
}