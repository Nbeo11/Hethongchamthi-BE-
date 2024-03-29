/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Bộ môn (user)
import bcrypt from 'bcrypt'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
// Trong file department_leaderModel.js
import { userModel } from './userModel'

//Define Collection (Name & Schema)
const DEPARTMENT_LEADER_COLLECTION_NAME = 'department_leaders'
const DEPARTMENT_LEADER_COLLECTION_SCHEMA = Joi.object({
    facultyId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    departmentId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    username: Joi.string().required().min(3).max(50).trim().strict(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3).max(50).trim().strict(),
    birth: Joi.date().iso(),
    gender: Joi.string().valid('male', 'female', 'other'),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/),
    role: Joi.string().default('bomon'), // Đặt giá trị mặc định là "bomon"
    note: Joi.string().min(3).max(50).trim().strict(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'email']

const validateBeforeCreate = async (data) => {
    return await DEPARTMENT_LEADER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const hashPassword = async (password) => {
    const saltRounds = 10; // Số vòng lặp sử dụng cho thuật toán băm
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const createNew = async (data) => {
    try {
        // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
        const existingUser = await GET_DB().collection(userModel.USER_COLLECTION_NAME).findOne({ email: data.email });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Nếu email chưa tồn tại, tiếp tục quá trình tạo người dùng mới
        const validData = await validateBeforeCreate(data)

        const hashedPassword = await hashPassword(data.password);

        // Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newDepartment_leaderToAdd = {
            ...validData,
            facultyId: new ObjectId(validData.facultyId),
            departmentId: new ObjectId(validData.departmentId),
            password: hashedPassword, // Thay đổi mật khẩu thành mật khẩu đã băm
        }
        const createdDepartment_leader = await GET_DB().collection(DEPARTMENT_LEADER_COLLECTION_NAME).insertOne(newDepartment_leaderToAdd)
        
        await userModel.createUsersCollection({
            _id: createdDepartment_leader._id,
            email: data.email,
            password: hashedPassword,
            role: 'bomon' // Xác định loại người dùng là giảng viên
            // Thêm các trường khác của giảng viên nếu cần
        });

        return createdDepartment_leader
    } catch (error) {
        throw new Error(error.message); // Trả về thông báo lỗi từ MongoDB hoặc kiểm tra email
    }
}


const findOneById = async (department_leaderId) => {
    try {
        const result = await GET_DB().collection(DEPARTMENT_LEADER_COLLECTION_NAME).findOne({
            _id: new ObjectId(department_leaderId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllDepartment_leaders = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allDepartment_leaders = await GET_DB().collection(DEPARTMENT_LEADER_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allDepartment_leaders;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(DEPARTMENT_LEADER_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByDepartment_leaderId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(DEPARTMENT_LEADER_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        })
        console.log('deleteManyByDepartment_leaderId - department_leader', result)
        return result
    } catch (error) { throw new Error(error) }
}

const update = async (department_leaderId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(DEPARTMENT_LEADER_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(department_leaderId) },
            { $set: updateData},
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (department_leaderId) => {
    try {
        const result = await GET_DB().collection(DEPARTMENT_LEADER_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(department_leaderId)
        })
        console.log('deleteOneById - department_leader', result)
        return result
    } catch (error) { throw new Error(error) }
}

export const department_leaderModel = {
    DEPARTMENT_LEADER_COLLECTION_NAME,
    DEPARTMENT_LEADER_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllDepartment_leaders,
    deleteManyByDepartment_leaderId,
    update,
    deleteOneById
}