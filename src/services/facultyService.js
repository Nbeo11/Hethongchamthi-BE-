/* eslint-disable indent */
/* eslint-disable no-useless-catch */
// eslint-disable-next-line quotes
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { facultyModel } from '~/models/facultyModel'
import { gradeModel } from '~/models/gradeModel'
import { ologyModel } from '~/models/ologyModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        //Xử lý logic dữ liệu tùy đặc thù dự án
        const newFaculty = {
            ...reqBody,
        }

        //Gọi tới tầng Model để xử lý lưu bản ghi newFaculty vào trong Database
        const createdFaculty = await facultyModel.createNew(newFaculty)
        // console.log(createdFaculty)

        //Lấy bản ghi faculty sau khi gọi (tùy mục đích dự án mà có cần bước này hay k)
        const getNewFaculty = await facultyModel.findOneById(createdFaculty.insertedId)
        // console.log(getNewFaculty)

        //Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án
        //Bắn email, notification về cho admon khi có 1 faculty mới đc tạo

        //Trả kết quả về, trong Service luôn phải có return
        return getNewFaculty
    } catch (error) {
        throw error
    }
}

const getAllFaculties = async () => {
    try {
        // Gọi phương thức từ Model để lấy tất cả các khóa học
        const allFaculties = await facultyModel.getAllFaculties();
        
        // Trả về kết quả
        return allFaculties;
    } catch (error) {
        // Xử lý lỗi nếu có
        throw error;
    }
}


const getDetails = async (facultyId) => {
    try {
        const faculty = await facultyModel.getDetails(facultyId)
        if (!faculty) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Faculty not found!')
        }

        //B1: deepclone faculty là tạo ra một cái mới để xử lý, không ảnh hưởng tớ faculty ban đầu
        const resFaculty = cloneDeep(faculty)

        //B2: Đưa grade về đúng ology
        resFaculty.ologies.forEach(ology => {
            //Cách dùng .equals này là bởi vì ObjectId trong MongoDB có suppport method .equals
            ology.grades = resFaculty.grades.filter(grade => grade.ologyId.equals(ology._id))
            
            //Cách này là convert ObjectId về string bằng hàm toString() của Javascript
            // ology.grades = resFaculty.grades.filter(grade => grade.ologyId.toString() === ology._id.toString())
        })
        resFaculty.grades.forEach(grade => {
            //Cách dùng .equals này là bởi vì ObjectId trong MongoDB có suppport method .equals
            grade.students = resFaculty.students.filter(student => student.gradeId.equals(grade._id))
            
            //Cách này là convert ObjectId về string bằng hàm toString() của Javascript
            // ology.grades = resFaculty.grades.filter(grade => grade.ologyId.toString() === ology._id.toString())
        })

        //B3: Xóa mảng grades khỏi faculty ban đầu
        delete resFaculty.grades
        delete resFaculty.students


        return resFaculty
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
        const updatedFaculty = await facultyModel.update(id, updateData);
        return updatedFaculty
    } catch (error) {
        throw error
    }
};

const deleteItem = async (facultyId) => {
    try {
        // Xóa faculty
        await facultyModel.deleteOneById(facultyId);

        // Xóa toàn bộ ology và grade thuộc faculty
        const ologies = await ologyModel.getAllByFacultyId(facultyId);
        for (const ology of ologies) {
            // Lấy ologyId từ đối tượng ology, không sử dụng ology._id nếu không phải là ologyId
            const ologyId = ology._id;
            // Xóa toàn bộ grade thuộc ology
            await gradeModel.deleteManyByGradeId(ologyId);
        }

        // Sau khi xóa tất cả các grade, bạn có thể xóa tất cả các ology thuộc faculty
        await ologyModel.deleteManyByOlogyId(facultyId);

        return { deleteResult: 'The faculty and its references have been deleted!' };
    } catch (error) {
        throw error;
    }
};


export const facultyService = {
    createNew,
    getDetails,
    getAllFaculties,
    update,
    deleteItem
}