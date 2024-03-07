/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { courseModel } from '~/models/courseModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        //Xử lý logic dữ liệu tùy đặc thù dự án
        const newCourse = {
            ...reqBody,
        }

        //Gọi tới tầng Model để xử lý lưu bản ghi newCourse vào trong Database
        const createdCourse = await courseModel.createNew(newCourse)
        // console.log(createdCourse)

        //Lấy bản ghi course sau khi gọi (tùy mục đích dự án mà có cần bước này hay k)
        const getNewCourse = await courseModel.findOneById(createdCourse.insertedId)
        // console.log(getNewCourse)

        //Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án
        //Bắn email, notification về cho admon khi có 1 course mới đc tạo

        //Trả kết quả về, trong Service luôn phải có return
        return getNewCourse
    } catch (error) {
        throw error
    }
}

const getAllCourses = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allCourses = await courseModel.getAllCourses();
        
        // Trả về kết quả
        return allCourses;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}


const getDetails = async (courseId) => {
    try {
        const course = await courseModel.getDetails(courseId)
        if (!course) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Course not found!')
        }

        //B1: deepclone course là tạo ra một cái mới để xử lý, không ảnh hưởng tớ course ban đầu
        const resCourse = cloneDeep(course)

        //B2: Đưa grade về đúng ology
        resCourse.ologies.forEach(ology => {
            //Cách dùng .equals này là bởi vì ObjectId trong MongoDB có suppport method .equals
            ology.grades = resCourse.grades.filter(grade => grade.ologyId.equals(ology._id))
            
            //Cách này là convert ObjectId về string bằng hàm toString() của Javascript
            // ology.grades = resCourse.grades.filter(grade => grade.ologyId.toString() === ology._id.toString())
        })

        //B3: Xóa mảng grades khỏi course ban đầu
        delete resCourse.grades

        return resCourse
    } catch (error) {
        throw error
    }
}


export const courseService = {
    createNew,
    getDetails,
    getAllCourses
}