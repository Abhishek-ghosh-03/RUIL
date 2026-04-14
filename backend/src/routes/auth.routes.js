import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";
import { registerValidation, loginValidation } from "../middleware/validator.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/logout", logout);
router.get("/me", protect, getMe);

export default router;
