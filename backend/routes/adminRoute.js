import express from "express"
import { adminAuth ,adminProfiile } from "../controllers/adminControllers/adminController.js"
import { signIn } from "../controllers/authController.js"
import { signOut  } from "../controllers/userControllers/userController.js"
import { addProduct, deleteVehicle, editVehicle, getAdminSummary, showUsers, showVendors, showVehicles } from "../controllers/adminControllers/dashboardController.js"
import { multerUploads } from "../utils/multer.js"
import { insertDummyData } from "../controllers/adminControllers/masterCollectionController.js"
import { getCarModelData } from "../controllers/adminControllers/masterCollectionController.js"
import { approveVendorVehicleRequest, fetchVendorVehilceRequests, rejectVendorVehicleRequest } from "../controllers/adminControllers/vendorVehilceRequests.js"
import { allBookings, changeStatus } from "../controllers/adminControllers/bookingsController.js"
import { verifyToken } from "../utils/verifyUser.js"
import { ensureLocalSeed } from "../utils/localSeed.js"





const router = express.Router()

router.post('/dashboard',signIn,adminAuth)
router.post('/profile',adminProfiile)
router.get('/signout',signOut)
router.post('/addProduct',multerUploads,addProduct)
router.get('/showVehicles',showVehicles)
router.get('/showUsers',showUsers)
router.get('/showVendors',showVendors)
router.get('/summary',getAdminSummary)
router.delete('/deleteVehicle/:id',deleteVehicle)
router.put('/editVehicle/:id',editVehicle)
router.get('/dummyData',insertDummyData)
router.get('/getVehicleModels',getCarModelData)
router.get('/seedLocal', async (req, res, next) => {
  try {
    const result = await ensureLocalSeed();
    res.status(200).json({ ok: true, ...result, vendorLogin: { email: "vendor@demo.com", password: "vendor123" } });
  } catch (error) {
    next(error);
  }
})
router.get('/fetchVendorVehilceRequests',fetchVendorVehilceRequests)
router.post('/approveVendorVehicleRequest',approveVendorVehicleRequest)
router.post('/rejectVendorVehicleRequest',rejectVendorVehicleRequest)
router.get('/allBookings',allBookings)
router.post('/changeStatus',changeStatus)

export default router
