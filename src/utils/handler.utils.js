import { TypeToken } from "../common/type.common.js";

export const wrapRequestHandler = (func) => {
    return async(req,res,next) => {
        try{
            await func(req,res,next);// goi ham xu li request
        }
        catch(error){
            return res.status(500).json({
                message : error.message,
                success: false,
            });
        }
    };
};

export const checkTypeToken = (type) => {
    switch (type) {
        case TypeToken.RESET:
            return process.env.SEND_EMAIL_SECRET_KEY;
        case TypeToken.REGISTER:
            return process.env.SECRET_KEY_REGISTER;
        case TypeToken.LOGIN:
        default :
            return process.env.SECRET_KEY;
    }
};