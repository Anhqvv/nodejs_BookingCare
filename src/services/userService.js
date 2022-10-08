import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
   return new Promise(async (resolve, reject) => {
      try {
         let userData = {};
         let isExist = await checkUserEmail(email);
         if (isExist) {
            //user already exist
            let user = await db.User.findOne({
               attributes: ["email", "roleId", "password"],
               where: { email: email },
               raw: true,
            });
            if (user) {
               //compare password: dùng cách 1 hay cách 2 đều chạy đúng cả =))
               // Cách 1: dùng asynchronous (bất đồng bộ)
               let check = await bcrypt.compare(password, user.password);

               // Cách 2: dùng synchronous  (đồng bộ)
               // let check = bcrypt.compareSync(password, user.password);

               if (check) {
                  userData.errCode = 0;
                  userData.errMessage = "OK";

                  delete user.password;
                  userData.user = user;
               } else {
                  userData.errCode = 3;
                  userData.errMessage = "Wrong password";
               }
            } else {
               userData.errCode = 2;
               userData.errMessage = `User not found`;
            }
         } else {
            //return error
            userData.errCode = 1;
            userData.errMessage = `Your's Email isn't exist in our system, plz try other email`;
         }
         resolve(userData);
      } catch (e) {
         reject(e);
      }
   });
};

let checkUserEmail = (userEmail) => {
   return new Promise(async (resolve, reject) => {
      try {
         let user = await db.User.findOne({
            where: { email: userEmail },
         });
         if (user) {
            resolve(true);
         } else {
            resolve(false);
         }
      } catch (e) {
         reject(e);
      }
   });
};

let getAllUsers = (userId) => {
   return new Promise(async (resolve, reject) => {
      try {
         let users = "";
         if (userId === "All") {
            users = await db.User.findAll({
               attributes: {
                  exclude: ["password"],
               },
            });
         } else {
            users = await db.User.findOne({
               where: {
                  id: userId,
               },
               attributes: {
                  exclude: ["password"],
               },
            });
         }
         if (userId && userId !== "All") {
            users = await db.User.findOne({
               where: { id: userId },
            });
         }
         resolve(users);
      } catch (e) {
         reject(e);
      }
   });
};
let createNewUser = async (data) => {
   return new Promise(async (resolve, reject) => {
      try {
         let check = await checkUserEmail(data.email);
         console.log(">>>Checking email", check);
         if (check === true) {
            resolve({
               errCode: 1,
               message:
                  "Your email is already in used, Please try another email",
            });
         }
         let hashPassWordFromBcrypt = await hashUserPassword(data.password);
         await db.User.create({
            email: data.email,
            password: hashPassWordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phonenumber: data.phonenumber,
            gender: data.gender === "1" ? true : false,
            roleId: data.roleId,
         });
         resolve({
            errCode: 0,
            message: "OK",
         });
      } catch (e) {
         reject(e);
      }
   });
};

let hashUserPassword = (password) => {
   return new Promise(async (resolve, reject) => {
      try {
         //lưu ý, truyền vào đúng password cần hash
         // let hashPassWord = await bcrypt.hashSync("B4c0/\/", salt); => copy paste mà ko edit nè
         let hashPassWord = await bcrypt.hashSync(password, salt);

         resolve(hashPassWord);
      } catch (e) {
         reject(e);
      }
   });
};

let deleteUser = (id) => {
   console.log("deleteUser: ", id);
   return new Promise(async (resolve, reject) => {
      try {
         let user = db.User.findOne({
            where: { id: id },
         });
         if (!user) {
            resolve({
               errCode: 2,
               errMessage: "The user is not exits",
            });
         }
         if (user) {
            await db.User.destroy({
               where: { id: id },
            });
         }
         //Notice:
         resolve({
            errCode: 0,
            errMessage: "Success",
         });
      } catch (e) {
         reject(e);
      }
   });
};

let editUser = (data) => {
   console.log(">>>Checking data from editUser: ", data);
   console.log(">>>Checking data from editUser: ", data.id);
   return new Promise(async (resolve, reject) => {
      try {
         if (!data.id) {
            resolve({
               errCode: 2,
               errMessage: "Missing required parameter ",
            });
         }
         if (data.id) {
            let user = await db.User.findOne({
               where: { id: data.id },
               raw: false,
            });
            if (user) {
               user.firstName = data.firstName;
               user.lastName = data.lastName;
               user.address = data.address;

               await user.save();
               resolve({
                  errCode: 0,
                  errMessage: "Edit success!",
               });
            }
         } else {
            resolve({
               errCode: 1,
               errMessage: "User is not found!",
            });
         }
      } catch (e) {
         reject(e);
      }
   });
};
module.exports = {
   handleUserLogin,
   getAllUsers,
   createNewUser,
   hashUserPassword,
   deleteUser,
   editUser,
};
