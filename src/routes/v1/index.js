import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from '../../../build/src/routes/v1/userRoute'
import { difficultRoute } from './Exam/difficultRoute'
import { examRoute } from './Exam/examRoute'
import { exam_structureRoute } from './Exam/exam_structureRoute'
import { question_bankRoute } from './Exam/question_bankRoute'
import { moduleRoute } from './Module/moduleRoute'
import { teaching_groupRoute } from './Module/teaching_groupRoute'
import { authRoute } from './authRoute'
import { courseRoute } from './courseRoute'
import { departmentRoute } from './departmentRoute'
import { department_leaderRoute } from './department_leaderRoute'
import { facultyRoute } from './facultyRoute'
import { gradeRoute } from './gradeRoute'
import { ologyRoute } from './ologyRoute'
import { studentRoute } from './studentRoute'
import { teacherRoute } from './teacherRoute'
import { testing_departmentRoute } from './testing_departmentRoute'
import { tranning_departmentRoute } from './tranning_departmentRoute'


const Router = express.Router()

/**Check API v1/staus */
Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})

/**Student APIs */
Router.use('/students', studentRoute)

/**Board APIs */
Router.use('/courses', courseRoute)

/**Ology APIs */
Router.use('/ologies', ologyRoute)

/**Grade APIs */
Router.use('/grades', gradeRoute)

/**Faculty APIs */
Router.use('/faculties', facultyRoute)

/**Department APIs */
Router.use('/departments', departmentRoute)

/**Teacher APIs */
Router.use('/teachers', teacherRoute)

/**User APIs */
Router.use('/users', userRoute)

/**Authentication APIs */
Router.use('/auth', authRoute);

/**tranning_department APIs */
Router.use('/tranning_departments', tranning_departmentRoute);

/**testing_department APIs */
Router.use('/testing_departments', testing_departmentRoute);

/**department_leader APIs */
Router.use('/department_leaders', department_leaderRoute);

/**difficult APIs */
Router.use('/difficults', difficultRoute);

/**modules APIs */
Router.use('/modules', moduleRoute);

/**teaching-group APIs */
Router.use('/teaching_groups', teaching_groupRoute);

/**exam_structure APIs */
Router.use('/exam_structures', exam_structureRoute);

/**question_bank APIs */
Router.use('/question_banks', question_bankRoute);

/**exam APIs */
Router.use('/exams', examRoute);

export const APIs_V1 = Router