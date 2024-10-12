import express from "express";
import { registerController } from "../controllers/auth.controller.js";
import { validationLogin, validationRegiser, validationResetPassword, validationSendEmail } from "../middlewares/auth.middleware.js";
import { wrapRequestHandler } from "../utils/handlers.util.js";
import { loginController, resetPasswordController, sendEmailController } from "../controller/auth.controller.js";
import { handleVerifyToken } from "../utils/jwt.util.js";
import { verifyToken } from "../middlewares/verify.token.middleware.js";

const router = express.Router();

//register
//realtime: 2 options support (web socket(cũ) là giao thức, socket.io là một thư viện)
router.post(
  "/register",
  wrapRequestHandler(validationRegiser),
  wrapRequestHandler(registerController),
);

router.post('/login',
  wrapRequestHandler(validationLogin),
  wrapRequestHandler(loginController),
);

router.post('/send-email',
  wrapRequestHandler(validationSendEmail),
  wrapRequestHandler(sendEmailController),
);


router.put('/reset-password', 
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(validationResetPassword),
  wrapRequestHandler(resetPasswordController),
);
export default router;