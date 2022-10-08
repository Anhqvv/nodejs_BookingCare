import userService from "../services/userService";

let handleLoging = async (req, res) => {
   let email = req.body.email;
   let password = req.body.password;

   if (!email || !password) {
      return res.status(500).json({
         errCode: 1,
         message: "Missing inputs parameter!",
      });
   }

   let userData = await userService.handleUserLogin(email, password);
   //check email exist
   //password nhap vao ko dung
   //return userInfor
   // access_token :JWT json web token

   return res.status(200).json({
      errCode: userData.errCode,
      message: userData.errMessage,
      user: userData.user ? userData.user : {},
   });
};

let handleGetAllUsers = async (req, res) => {
   let id = req.query.id;
   // console.log("Nodejss handleGetAllUsers id: ", id);
   if (!id) {
      return res.status(500).json({
         errCode: 1,
         errMessage: "Missing required parameters",
         user: [],
      });
   }
   // console.log('handleGetAllUsers id',id)
   let users = await userService.getAllUsers(id);
   return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      users,
   });
};

let handleCreateNewUser = async (req, res) => {
   console.log("req.body", req.body);
   let message = await userService.createNewUser(req.body);
   console.log(message);
   return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
   let id = req.body.id;
   if (!id) {
      return req.status(200).json({
         errCode: 1,
         errMessage: "Missing require parameters",
      });
   }
   console.log("delete User id", id);
   let dataUser = await userService.deleteUser(id);
   return res.status(200).json(dataUser);
};

let handleEditUser = async (req, res) => {
   let data = req.body;
   console.log('>>> Checking data from handleEditUser', data.id)
   let dataUser = await userService.editUser(data);
   // console.log('>>> Checking dataUser from handleEditUser', dataUser)
   return res.status(200).json(dataUser);
};
module.exports = {
   handleLoging,
   handleGetAllUsers,
   handleCreateNewUser,
   handleDeleteUser,
   handleEditUser,
};
