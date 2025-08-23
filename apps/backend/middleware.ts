import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
   try {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "No Token Provided"});
            return;
        }
        
        console.log("entered the middleware")
        const decoded = jwt.decode(token, process.env.AUTH_JWT_KEY, {
            algorithms: ['RS256']
        })
        console.log("after the decoded")
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