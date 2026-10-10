const jwt = require('jsonwebtoken');

function loginMiddleware(req,res,next){
    const {email , password} = req.body;
    if(!email || !password){
        res.send(JSON.stringify({message:"Email And Password Is Required!"}));
    }
    next();
}
const tokenVerifyMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;

if (!authHeader) {
    return res.status(401).json({
        success: false,
        message: "Authorization token is required"
    });
}

const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

try {
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    req.user = decoded;

} catch (error) {
    console.error("JWT verification error:", error.message);

    return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
    });
}
next();

}

module.exports = {loginMiddleware,tokenVerifyMiddleware};