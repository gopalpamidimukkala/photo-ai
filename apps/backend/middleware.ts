import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
   try {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1];
        console.log(authHeader)
        if (!token) {
            res.status(401).json({ message: "No Token Provided"});
            return;
        }
        
        const decoded = jwt.decode(token, process.env.AUTH_JWT_KEY, {
            algorithms: ['RS256']
        })
        
        if (decoded?.sub) {
            console.log(decoded.sub)
            req.userId = decoded?.sub;
            next();
        } else {
            res.status(403).json({
                message: "Error while decoding"
            })
        }

        
   } catch (error) {
    
   }
}