const jwt = require('jsonwebtoken');
const JWT_Secret = "ThisIsSonGoku";

const fetchUser = (req, res, next) => {


    // get the user from the jwt token and add id

    // importing token from the headers
    const token = req.header('auth-token');

    // if the token does not exist means that the user is not logged in
    if (!token) {
        // 401 is unauthorized error
        return res.status(401).send({ error: "Please Authenticate yourself" })
    };

    // if we are here means that the user is authenticated

    try {   // since the token exists so
        // now we will verify the token - if someone changed it? or is it valid ? etc
        const data = jwt.verify(token, JWT_Secret);

        req.user = data.user;

        next();



    } catch (error) {
        res.status(401).send({ error: "Please Authenticate yourself" })
    }
}

module.exports = fetchUser;