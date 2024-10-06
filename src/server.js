import * as dotenv from 'dotenv';

import connectDB from './configs/connect-db.config.js';
import cors from 'cors';
import express from 'express';
import rootRoutes from './routes/index.js';

// import swaggerUi from 'swagger-ui-express';


dotenv.config();

const app = express();

// middlewares
app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods:'GET, HEAD, PUT, PATCH, POST, DELETE',
    }),
);

app.get('/', (_, res,) => {
    res.send('hello word');
});

//connect db
connectDB();

//doc swagger
// app.use('/documents', swaggerUi.serve, swaggerUi.setup(api))

//routes
app.use(`/api/v1`, rootRoutes )

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🚀 ~Server is running on port ${port}` );
});

