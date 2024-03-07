/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
    try {
        //Xử lý logic dữ liệu tùy đặc thù dự án
        const newUser = {
            ...reqBody,
            slug: slugify(reqBody.username)
        }

        //Gọi tới tầng Model để xử lý lưu bản ghi newUser vào trong Database
        const createdUser = await userModel.createNew(newUser)
        // console.log(createdUser)

        //Lấy bản ghi user sau khi gọi (tùy mục đích dự án mà có cần bước này hay k)
        const getNewUser = await userModel.findOneById(createdUser.insertedId)
        // console.log(getNewUser)

        //Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án
        //Bắn email, notification về cho admon khi có 1 user mới đc tạo

        //Trả kết quả về, trong Service luôn phải có return
        return getNewUser
    } catch (error) {
        throw error
    }
}

const getDetails = async (userId) => {
    try {
        const user = await userModel.getDetails(userId)
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
        }

        return user
    } catch (error) {
        throw error
    }
}

export const userService = {
    createNew,
    getDetails
}