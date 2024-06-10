//import { Router, response } from "express";
import {  validationResult } from "express-validator";
//import router from "./users.mjs";
import { Router } from "express";
//import { makUser } from "../utils/constans.mjs";
import cookieParser from "cookie-parser";
const router = Router();
router.use(cookieParser());
router.get(
    "/api/products",
    (request,response)=> {
        console.log(request.headers.cookie);
        console.log(request.cookies);
        //response.cookie("hl", "wl", );
        
        const result = validationResult(request);
        console.log(result);
        console.log(request.query);
        console.log(response.header.cookie);
        // const {
        //     query : {search, value},
        // } = request;
        if (request.cookies.hl && request.cookies.hl === "wl") {
            return response.send([{id:1, name:"choken"}]);
        }
        
        return response.send({msg: "please pass correct cookie"});
        // if (search && value)
          

    }
);

export default router;