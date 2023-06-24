const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('./../Models/userModel');
const userSchema = mongoose.model('users');
const { SECRET_KEY } = require('./../Config/env');
const bcrypt = require("bcrypt");

const checkMailAndPassword = async (model, request, response, next) => {
	try {
		let data = await model.findOne({ email: request.body.email });
		if (data == null) {
			throw new Error('either mail or password is wrong');
		} else {
			let matched = await bcrypt.compare(request.body.password, data.password);
			if (!matched) throw new Error('either mail or password is wrongooo');
		}
		return data;
	} catch (error) { next(error); }
};
//response generator general function
function authResponse(id, role, response) {
  let token = jwt.sign({ id: id, role: role }, SECRET_KEY);
  response.status(200).json({
    message: 'Authenticated',
    token,
  });
}

// //different users login
exports.login = async(request, response, next) => {
  let user = await checkMailAndPassword(userSchema,request,response,next)

  if (user && user.role == 'admin')
    authResponse(user._id, 'admin', response);
  else if (user && user.role == 'user') authResponse(user._id, 'user', response);
  else {
    let error = new Error('Not Authenticated');
    error.status = 401;
    next(error);
  }
};

