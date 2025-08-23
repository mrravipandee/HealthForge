import jwt from "jsonwebtoken"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        console.log('AuthAdmin middleware - Headers:', req.headers);
        const atoken = req.headers.atoken || req.headers.aToken
        console.log('AuthAdmin middleware - Token:', atoken);
        
        if (!atoken) {
            console.log('AuthAdmin middleware - No token provided');
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)
        console.log('AuthAdmin middleware - Decoded token:', token_decode);
        console.log('AuthAdmin middleware - Expected email:', process.env.ADMIN_EMAIL);
        console.log('AuthAdmin middleware - Expected role: admin');
        
        // Check if the token contains admin data
        if (!token_decode.email || token_decode.email !== process.env.ADMIN_EMAIL || token_decode.role !== 'admin') {
            console.log('AuthAdmin middleware - Token validation failed');
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        console.log('AuthAdmin middleware - Token validation successful');
        // Add admin data to request for use in controllers
        req.adminEmail = token_decode.email
        next()
    } catch (error) {
        console.log('AuthAdmin middleware - Error:', error)
        res.json({ success: false, message: 'Not Authorized Login Again' })
    }
}

export default authAdmin;