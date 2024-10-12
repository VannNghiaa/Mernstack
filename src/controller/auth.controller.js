import * as dotenv from 'dotenv';

import { checkEmailExist, createUser, updatePassword } from '../services/auth.service.js';

import { HTTP_STATUS } from '../common/http-satus.common.js';
import { handleGenerateToken } from '../utils/jwt.util.js';
import { handleComparePassword, handleHashPassword } from '../utils/hash-password.util.js';

dotenv.config();

export const registerController = async (req, res) => {
    const body = req.user;
    /*
    BODY: CHỖ CHỨA DATA GỬI LÊN
    request line:
    post: them du lieu len database
    get: tra data cho nguoi dung
    patch(chỉ lấy ra 1 số trường để cập nhật) = put(tập dữ liệu to): lấy data để update
     */

    //check email
    const user = await checkEmailExist(body.email);
    if (user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: 'Email already existed!',
            success: false,
        });
    };

    //hash password
    const hashPassword = await handleHashPassword({ password: body.password, saltNumber: 5 }); //saltNumber: độ dài của đoạn mã hóa

    //create user in db
    const newUser = await createUser({ ...body, password: hashPassword }); //copy tất cả trường hiện tại và past lên password cũ

    //câu lệnh check điều kiện
    //Nếu không có thằng newUser thì nó chạy vào và dừng hẳn còn khoogn thì thôi
    if (!newUser) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: 'User created failed!',
            success: false,
        });
    };

    //generate token
    const accessToken = await handleGenerateToken({ payload: { _id: newUser, email: newUser.email } }); //payload là một phần nhỏ trong body và để lấy ra một số trường cần thiết để sử dụng

    return res.status(HTTP_STATUS.CREATED).json({
        message: 'User created successfully!', //thông báo status 
        success: true,
        accessToken,
    });
};

export const loginController = async (req, res) => {
    const body = req.user;

    //check email
    const user = await checkEmailExist(body.email);
    if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Email is not found!",
            success: false,
        });
    }

    //compare password
    const isMatch = await handleComparePassword({
        password: body.password,
        hashPassword: user.password,
    });
    if (!isMatch) {
        return res.status(HTTP_STATUS).json({
            message: "Password not match",
            success: false,
        });
    }

    //generate token
    const accessToken = await handleGenerateToken({ //một đoạn mã hóa chứa 3 field trông payload
        payload: { _id: user._id, email: user.email, role: user.role },
    });

    return res.status(HTTP_STATUS.OK).json({
        message: 'Login successfully',
        success: true,
        accessToken,
    })
}

//send email
export const sendEmailController = async (req, res) => {
    const { email } = req.email; //khai báo email và truyền vào hàm check

    const user = await checkEmailExist(email); //tạo hàm check email đã tồn tại chưa và xử lý logic
    if (!user) {
        //generate token
        const accessToken = await handleGenerateToken({
            payload: { email: user.email },
            secretKey: process.env.SEND_EMATL_SECRET_KEY,
            expiresIn: '1h',
        });

        //link reset password
        const link = `${process.env.URL_SERVER}/reset-password?token=${accessToken}`;

        //send email
        return res.status(HTTP_STATUS.OK).json({
            message: "Email was sent successfully!",
            success: true,
            link,
        });
    }
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Email was sent successfully",
        success: false,
    });
}

//reset password
export const resetPasswordController = async (req, res) => {
    const {newPassword} = req.forgetPassword;
    const {email} = req.user;

    
    //check email
    const user = await checkEmailExist(email);
    if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Email is not existed!",
            success: false,
        });
    }
    
    //hash password
  const hashPassword = await handleHashPassword({ password: newPassword });

  // update password
  const result = await updatePassword(user._id, hashPassword);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Update password failed!",
      success: false,
    });
  }

  return res.status(HTTP_STATUS.OK).json({
    message: "Update password successfully!",
    success: true,
  });
};