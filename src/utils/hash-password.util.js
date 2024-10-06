import bcrypt from 'bcrypt';

//tạo hàm password với độ dài là 10 và mã hóa
export const handleHashPassword = async ({password, saltNumber = 10 }) => {
    const salt = await bcrypt.genSalt(saltNumber);
    const hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
}

//so sanh password user nhập với database
export const handleComparePassword = async ({ password, hashPassword }) => {
    return await bcrypt.compare(password, hashPassword);
};