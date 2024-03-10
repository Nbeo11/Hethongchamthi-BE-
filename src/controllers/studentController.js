/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { studentService } from '~/services/studentService'

const createNew = async (req, res, next) => {
    try {
        const createdStudent = await studentService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdStudent)
    } catch (error) { next(error) }
}


const getAllByGradeId = async (req, res, next) => {
    try {
        const allOlogies = await studentService.getAllByGradeId();
        res.status(StatusCodes.OK).json(allOlogies);
    } catch (error) {
        next(error);
    }
}

const getDetails = async (req, res, next) => {
    try {
        const studentId = req.params.id
        const student = await studentService.getDetails(studentId)
        res.status(StatusCodes.OK).json(student)
    } catch (error) { next(error) }
}

const update = async (req, res, next) => {
    try {
        const studentId = req.params.id;
        const updatedStudent = await studentService.update(studentId, req.body);

        res.status(StatusCodes.OK).json(updatedStudent);
    } catch (error) {
        next(error);
    }
}

const deleteItem = async (req, res, next) => {
    try {
        const studentId = req.params.id
        const result = await studentService.deleteItem(studentId)

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}


export const studentController = {
    createNew,
    getDetails,
    getAllByGradeId,
    update,
    deleteItem
}