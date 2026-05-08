import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/admin.middleware.js';
import { upload } from '../config/cloudinary.js';
import {
  getAllReservations,
  updateReservationStatus,
  deleteAllDoneReservations,
  deleteReservation,
  getAdminMenuItems,
  createAdminMenuItem,
  updateAdminMenuItem,
  deleteAdminMenuItem,
} from '../controllers/admin.controllers.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/reservations', getAllReservations);
router.patch('/reservations/:id/status', updateReservationStatus);
router.delete('/reservations/done/all', deleteAllDoneReservations);
router.delete('/reservations/:id', deleteReservation);

router.get('/menu', getAdminMenuItems);
router.post('/menu', upload.single('image'), createAdminMenuItem);
router.patch('/menu/:id', upload.single('image'), updateAdminMenuItem);
router.delete('/menu/:id', deleteAdminMenuItem);

export default router;
