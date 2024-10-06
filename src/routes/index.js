import express from 'express';

const router = express.Router();


const rootRoutes = [

];
rootRoutes.map((route) => {
    router.use(route);
});

export default router;