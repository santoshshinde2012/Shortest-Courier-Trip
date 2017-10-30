import express from 'express';
//import cloud travel routes
import cloudTravelRoutes from "./cloudTravelRoutes";

let router = express.Router();

//base route path
router.get('/', cloudTravelRoutes.intro);

//routes to cloud-travel
router.get('/cloud-travel', cloudTravelRoutes.get);

export default router;
