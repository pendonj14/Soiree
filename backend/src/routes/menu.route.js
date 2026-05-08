import { Router } from "express";
import { createMenu, getMenuItems, updateMenuItem, deleteMenuItem } from "../controllers/menu.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { upload } from "../config/cloudinary.js";

const router = Router();
router.get("/all", getMenuItems);
router.post("/create", protect, adminOnly, upload.single("image"), createMenu);
router.patch("/update/:id", protect, adminOnly, upload.single("image"), updateMenuItem);
router.delete("/delete/:id", protect, adminOnly, deleteMenuItem);
export default router;
