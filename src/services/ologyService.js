/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { courseModel } from '~/models/courseModel'
import { ologyModel } from '~/models/ologyModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newOlogy = {
            ...reqBody
        }
        const createdOlogy = await ologyModel.createNew(newOlogy)
        const getNewOlogy = await ologyModel.findOneById(createdOlogy.insertedId)

        if(getNewOlogy) {
            // Xử lý cấu trúc data ở đây trước khi trả dữ liệu về
            getNewOlogy.grades = []

            //Cập nhật mảng ologyOrderIds trong collection courses
            await courseModel.pushOlogyOrderIds(getNewOlogy)
        }
        
        return getNewOlogy
    } catch (error) {
        throw error
    }
}

const getAllOlogies = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allOlogies = await ologyModel.getAllOlogies()
        return allOlogies
    } catch (error) { throw error }
}

const getDetails = async (ologyId) => {
    try {
        const ology = await ologyModel.getDetails(ologyId)
        if (!ology) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Ology not found!')
        }

        return ology
    } catch (error) {
        throw error
    }
}

export const ologyService = {
    createNew,
    getDetails,
    getAllOlogies
}