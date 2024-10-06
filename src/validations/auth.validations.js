import joi from 'joi';

//kiểm tra dữ liệu đầu vào cho đối tượng register
export const registerValidation = joi.object({
    //kiểm tra validations có phải định dạng email không
    email: joi.string().email().required().messages({
        'string.email': 'Email not valid',
        //chỉ nhận dữ liệu đầu vào là string
        'any.required': 'Email phải là ký tự',
        'string.empty': 'Email not null',
    }),

    //min > 6 mới nhận
    password: joi.string().min(6).required().messages({
        'string.min': 'Password phải dài hơn 6 ký tự',
        'any.required': 'Password phải là ký tự',
        'string.empty': 'Password not null',
    }),

    //"ref('password')": so sanh password trùng không
    confirmPassword: joi.string().required().valid()(joi.ref('password')).messages({
        'any.only': 'Mật khẩu không khớp',
        'any.required': 'Password not null',
    })
})

export const loginValidation = joi.object({
    //kiểm tra validations có phải định dạng email không
    email: joi.string().email().required().messages({
        'string.email': 'Email not valid',
        //chỉ nhận dữ liệu đầu vào là string
        'any.required': 'Email phải là ký tự',
        'string.empty': 'Email not null',
    }),

    //min > 6 mới nhận
    password: joi.string().min(6).required().messages({
        'string.min': 'Password phải dài hơn 6 ký tự',
        'any.required': 'Password phải là ký tự',
        'string.empty': 'Password not null',
    }),
})