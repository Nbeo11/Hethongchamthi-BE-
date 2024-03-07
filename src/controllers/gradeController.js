/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { gradeService } from '~/services/gradeService'

const createNew = async (req, res, next) => {
    try {
        const createdGrade = await gradeService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdGrade)
    } catch (error) { next(error) }
}


const getAllGrades = async (req, res, next) => {
    try {
        const allGrades = await gradeService.getAllGrades();
        res.status(StatusCodes.OK).json(allGrades);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const gradeId = req.params.id
        const grade = await gradeService.getDetails(gradeId)
        res.status(StatusCodes.OK).json(grade)
    } catch (error) { next(error) }
}

export const gradeController = {
    createNew,
    getDetails,
    getAllGrades
}