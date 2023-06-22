const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require('../Config/env');

module.exports = (request, response, next) => {
    //search for authorization
    try {
        let token = request.get("authorization").split(" ")[1];
        let decodedToken = jwt.verify(token, SECRET_KEY);
        request.id = decodedToken.id;
        request.role = decodedToken.role;                                                                   
        //to go to the next layers(end point) with id ,role
        console.log(request.id);
        next();
    }
    catch (error) {
        error.status = 401;
        error.message = "NOT authenticated";
        next(error);
    }
}
