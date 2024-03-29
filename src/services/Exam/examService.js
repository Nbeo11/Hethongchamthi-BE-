/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { examModel } from '~/models/Exam/examModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newExam = {
            ...reqBody
        }
        const createdExam = await examModel.createNew(newExam)
        const getNewExam = await examModel.findOneById(createdExam.insertedId)

        
        return getNewExam
    } catch (error) {
        throw error
    }
}

const getAllExams = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allExams = await examModel.getAllExams()
        return allExams
    } catch (error) { throw error }
}

const getDetails = async (examId) => {
    try {
        const exam = await examModel.getDetails(examId)
        if (!exam) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Exam not found!')
        }

        return exam
    } catch (error) {
        throw error
    }
}

const update = async (id, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now()
        }
        const updatedExam = await examModel.update(id, updateData);
        return updatedExam
    } catch (error) {
        throw error
    }
}

const deleteItem = async (examId) => {
    try {
        const targetExam = await examModel.findOneById(examId)
        if (!targetExam) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Exam not found!')
        }
        // Xóa exam
        await examModel.deleteOneById(examId)
        // Xóa toàn bộ student thuộc exam

        // Xóa examId trong mảng examOrderIds trong Faculty chứa nó


        return { deleteResult: 'The exam and its references have been deleted!'}
    } catch (error) {
        throw error
    }
}

export const examService = {
    createNew,
    getDetails,
    getAllExams,
    update,
    deleteItem
}