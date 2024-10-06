import mongoose from 'mongoose';
import mongoosePaginate  from 'mongoose-paginate-v2';

//create new collection
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true, //required: trường bắt buộc phải đăng nhập
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
        },
        address: {
            type: String,
        },
        fullname: {
            type: String,
        },

        //phân quyền
        role: {
            type: String,
            default: 'customer',
            enum: ['customer', 'admin', 'staff'],
        },
        status: {
            type: String,
            default: 'active',
            enum: ['active', 'inactive'],
        },
        avatar: {
            type: String,
        }
  
    },
    {
        timestamps: true, // born 2 field: createAt and updateAt: hien thi tg tạo và cập nhật
        versionKey: false, 
    },

);

userSchema.plugin(mongoosePaginate);

//tạo collection mới trong database mang tên "User"
const User = mongoose.model('User', userSchema);

export default User;