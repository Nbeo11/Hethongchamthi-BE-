/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
    try {
        // console.log(req.body)

        //Điều hướng dữ liệu sang tầng Service
        const createdUser = await userService.createNew(req.body)
        
        //Có kết quả thì trả về phía Client
        res.status(StatusCodes.CREATED).json(createdUser)
    } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
    try {
        // console.log(req.params)
        const userId = req.params.id

        const user = await userService.getDetails(userId)
        
        res.status(StatusCodes.OK).json(user)
    } catch (error) { next(error) }
}

export const userController = {
    createNew,
    getDetails
}