/* eslint-disable no-useless-catch */
/* eslint-disable indent */
// Độ khó của câu hỏi
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

//Define Collection (Name & Schema)
const QUESTION_BANK_COLLECTION_NAME = 'question_banks'
const QUESTION_BANK_COLLECTION_SCHEMA = Joi.object({
    moduleId: Joi.string().required().min(3).max(50).trim().strict(),
    chapter: Joi.string().required().min(3).max(50).trim().strict(),
    question_format: Joi.string().valid('Trắc nghiệm', 'Thực hành', 'Lý thuyết').required(),
    difficulty: Joi.string().trim().strict(),
    question_detail: Joi.string().required().min(3).trim().strict(),
    keys: Joi.array().items(
        Joi.string().required().min(1).max(50).trim().strict()
    ),
    question_bankstatus: Joi.number().valid(1, 2, 3).default(1),
    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
});


const INVALID_UPDATE_FIELDS = ['_id','moduleId', 'createdAt']

const validateBeforeCreate = async (data) => {
    return await QUESTION_BANK_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}


const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data)

        //Biến đổi một số dữ liệu liên quan tới OjectId chuẩn chỉnh
        const newQuestion_bankToAdd = {
            ...validData,
        }
        const createdQuestion_bank = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).insertOne(newQuestion_bankToAdd)


        return createdQuestion_bank
    } catch (error) { throw new Error(error) }
}

const findOneById = async (question_bankId) => {
    try {
        const result = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).findOne({
            _id: new ObjectId(question_bankId)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const getAllQuestion_banks = async () => {
    try {
        // Gọi phương thức từ MongoDB để lấy tất cả các khóa học
        const allQuestion_banks = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).find().toArray();
        // Trả về kết quả
        return allQuestion_banks;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}

const getDetails = async (id) => {
    try {
        const result = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        })
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByQuestion_bankId = async (departmentId) => {
    try {
        const result = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).deleteMany({
            departmentId: new ObjectId(departmentId)
        })
        console.log('deleteManyByQuestion_bankId - question_bank', result)
        return result
    } catch (error) { throw new Error(error) }
}

const update = async (question_bankId, updateData) => {
    try {
        Object.keys(updateData).forEach(fileName => {
            if (INVALID_UPDATE_FIELDS.includes(fileName)) {
                delete updateData[fileName]
            }
        })
        const result = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(question_bankId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        return result
    } catch (error) {
        throw new Error(error);
    }
}

const deleteOneById = async (question_bankId) => {
    try {
        const result = await GET_DB().collection(QUESTION_BANK_COLLECTION_NAME).deleteOne({
            _id: new ObjectId(question_bankId)
        })
        console.log('deleteOneById - question_bank', result)
        return result
    } catch (error) { throw new Error(error) }
}

export const question_bankModel = {
    QUESTION_BANK_COLLECTION_NAME,
    QUESTION_BANK_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    getDetails,
    getAllQuestion_banks,
    deleteManyByQuestion_bankId,
    update,
    deleteOneById
}