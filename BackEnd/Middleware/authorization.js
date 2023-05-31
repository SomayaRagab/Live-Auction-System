module.exports.checkAdmin = (request, response, next) => {
    if (request.role == "admin") {
        //go to next layer  (controller)
        next();
    }
    else {
        let error = new Error("Not authorized");
        error.status = 403;
        next(error);
    }
}

module.exports.checkUser = (request, response, next) => {
    if (request.role == "user") {
        //go to next layer  (controller)
        next();
    }
    else {
        let error = new Error("Not authorized");
        error.status = 403;
        next(error);
    }
}

