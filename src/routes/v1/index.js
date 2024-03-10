import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { courseRoute } from './courseRoute'
import { gradeRoute } from './gradeRoute'
import { ologyRoute } from './ologyRoute'
import { studentRoute } from './studentRoute'

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

export const APIs_V1 = Router