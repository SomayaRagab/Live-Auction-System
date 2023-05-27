const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("./../Models/userModel");
const userSchema = mongoose.model("users");
const comparePassword = require("./../Helper/comparePassword");
const { SECRET_KEY } = require("./../Config/env");

//response generator general function
function authResponse(id, role, response) {
    let token = jwt.sign({ id: id, role: role }, SECRET_KEY, { expiresIn: "3h" });
    response.status(200).json({
        message: "Authenticated",
        token,
    });
}

//different users login
exports.login = async (request, response, next) => {
    let user = await adminSchema.findOne({
        email: request.body.email,
    });
    if (user) {
        checkPass = await comparePassword(request.body.password, user.password);
    }

    if (user && checkPass && user.role == "admin")
        authResponse(admin._id, "admin", response);
    else if (user && checkPass) authResponse(admin._id, "user", response);
    else {
        let error = new Error("Not Authenticated");
        error.status = 401;
        next(error);
    }
};
