/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { teacherService } from '~/services/teacherService'

const createNew = async (req, res, next) => {
    try {
        const createdTeacher = await teacherService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdTeacher)
    } catch (error) { next(error) }
}


const getAllTeachers = async (req, res, next) => {
    try {
        const allTeachers = await teacherService.getAllTeachers();
        res.status(StatusCodes.OK).json(allTeachers);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const teacherId = req.params.id
        const teacher = await teacherService.getDetails(teacherId)
        res.status(StatusCodes.OK).json(teacher)
    } catch (error) { next(error) }
}

export const teacherController = {
    createNew,
    getDetails,
    getAllTeachers
}