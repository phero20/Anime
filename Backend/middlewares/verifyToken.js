import jwt from 'jsonwebtoken';


const verifyToken = (req, res, next) => {
    try {
        // Get token from request header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add userId to request body

        if(!req.body){   
            req.body = {};
        }

        
        req.body.userId = decoded.userId;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Internal server error during token verification.'
        });
    }
};

export default verifyToken;
