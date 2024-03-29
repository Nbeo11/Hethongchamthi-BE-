/* eslint-disable indent */
// Người dùng (dùng để login)
import { GET_DB } from '~/config/mongodb';

const USER_COLLECTION_NAME = 'users'
const createUsersCollection = async (userData) => {
    try {
        // Thêm logic để xác định loại người dùng và tạo collection `users` tương ứng
        if (userData.role === 'sinhvien') {
            // Thêm sinh viên mới vào collection `users`
            await GET_DB().collection(USER_COLLECTION_NAME).insertOne({
                _id: userData._id,
                email: userData.email,
                password: userData.password,
                role: userData.role
                // Thêm các trường khác của sinh viên nếu cần
            });
        } else if (userData.role === 'giangvien') {
            // Thêm giáo viên mới vào collection `users`
            await GET_DB().collection(USER_COLLECTION_NAME).insertOne({
                _id: userData._id,
                email: userData.email,
                password: userData.password,
                role: userData.role
                // Thêm các trường khác của giáo viên nếu cần
            });
        } else if (userData.role === 'phongdaotao') {
            // Thêm giáo viên mới vào collection `users`
            await GET_DB().collection(USER_COLLECTION_NAME).insertOne({
                _id: userData._id,
                email: userData.email,
                password: userData.password,
                role: userData.role
                // Thêm các trường khác của giáo viên nếu cần
            });
        } else if (userData.role === 'phongkhaothi') {
            // Thêm giáo viên mới vào collection `users`
            await GET_DB().collection(USER_COLLECTION_NAME).insertOne({
                _id: userData._id,
                email: userData.email,
                password: userData.password,
                role: userData.role
                // Thêm các trường khác của giáo viên nếu cần
            });
        } else if (userData.role === 'bomon') {
            // Thêm giáo viên mới vào collection `users`
            await GET_DB().collection(USER_COLLECTION_NAME).insertOne({
                _id: userData._id,
                email: userData.email,
                password: userData.password,
                role: userData.role
                // Thêm các trường khác của giáo viên nếu cần
            });
        } else {
            // Loại người dùng không được hỗ trợ
            throw new Error('Unsupported user role');
        }
    } catch (error) {
        throw new Error(error);
    }
}

export const userModel = {
    createUsersCollection,
    USER_COLLECTION_NAME
}

