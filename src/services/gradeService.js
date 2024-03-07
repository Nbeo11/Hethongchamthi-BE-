/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { gradeModel } from '~/models/gradeModel'
import { ologyModel } from '~/models/ologyModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newGrade = {
            ...reqBody
        }
        const createdGrade = await gradeModel.createNew(newGrade)
        const getNewGrade = await gradeModel.findOneById(createdGrade.insertedId)

        if (getNewGrade) {
            await ologyModel.pushGradeOrderIds(getNewGrade)
        }
        
        return getNewGrade
    } catch (error) {
        throw error
    }
}

const getAllGrades = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allGrades = await gradeModel.getAllGrades()
        return allGrades
    } catch (error) { throw error }
}

const getDetails = async (gradeId) => {
    try {
        const grade = await gradeModel.getDetails(gradeId)
        if (!grade) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Grade not found!')
        }

        return grade
    } catch (error) {
        throw error
    }
}

export const gradeService = {
    createNew,
    getDetails,
    getAllGrades
}