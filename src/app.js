import express from 'express';
import schoolRoutes from './routes/school/schoolRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import courseRoute from './routes/courseRoute.js'
import enrollmentRoute from './routes/enrollmentRoutes.js'
import departmentRoutes from './routes/departmentRoutes.js'
import levelRoutes from './routes/levelRoutes.js'
import clasRoutes from './routes/classRoutes.js'
import resultRoutes from "./routes/resultRoutes.js";
import promotionRoutes from "./routes/promotionRoute.js";
import promotionRuleRoutes from "./routes/promotionRuleRoutes.js";
import promotionHistoryRoutes from "./routes/promotionHistoryRoutes.js";
import sessionRoute from "./routes/sessionRoutes.js"
import authRoutes from './routes/Authentication/authRoutes.js'
import userRoutes from './routes/Authentication/userRoutes.js'
import termRoutes from './routes/termRoutes.js'
import cors from 'cors'


const app = express();

// app.use(cors({
//     origin: process.env.CLIENT_URL
// }))
app.use(cors())

app.use(express.json());


//routes
app.use('/api/auth', authRoutes )
app.use('/api/user', userRoutes)
app.use('/api/school', schoolRoutes)
app.use('/api/course', courseRoute)
app.use('/api/student', studentRoutes)
app.use('/api/enrollment', enrollmentRoute)
app.use('/api/levels', levelRoutes)
app.use('/api/class', clasRoutes)
app.use('/api/department', departmentRoutes)
app.use("/api/promotions", promotionRoutes);
app.use('/api/session', sessionRoute)
app.use('/api/term', termRoutes)
app.use('/api/result', resultRoutes)
app.use('/api/promotion-rule', promotionRuleRoutes)
app.use("/api/promotion-history", promotionHistoryRoutes);


app.get('/health', (req, res)=>{
    res.status(200).json({ status: 'ok', timestamp: Date.now() })
});



export default app;