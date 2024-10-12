//rafce: call back funcion
//rafc

import { HTTP_STATUS } from "../common/http-satus.common";
import { checkTypeToken } from "../utils/handler.utils";

export const verifyToken = async (req, res, next) => {
    const bearerToken = req.headers["authorization"]; //phân quyền (role) nếu admin -> thao tác đượcq quyền admin, tương tự với user
    const { query } = req;

    if (!bearerToken) {
        return res.status(HTTP_STATUS.authorization).json({
            message: "Acces denided",
            success: false,
        })
    }

    const token = bearerToken.split(' ')[1]; //lấy 

    //verify token
    const verifyToken = await handleVerifyToken({
        token,
        secretKey: checkTypeToken(query?.type),
    });
    if (!verifyToken) {
        return res
            .status(HTTP_STATUS.UNAUTHORIZED)
            .json({ message: "Invalid token!", success: false });
    }

    req.user = verifyToken;

    next();

    //verify token 
    //query đằng sau dấu ?: tìm kím dựa trên các điều kiện, baram đằng sau dấu &: điều kiện thực thể để check xem tìm kím và thao tác trên đối tượng nào
    //sau : (thông thường là id ':id' cũng là baram)
    //const verifyToken = await handleVerifyToken({ token, secretKey: checkTypeToken(query?.type) });

}