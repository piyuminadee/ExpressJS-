import passport, { use } from "passport";
import { Strategy } from "passport-local";
import { makUser } from "../utils/constans.mjs";

 // !USER VALIDATION
passport.use(
    new Strategy((name, password, done) => {
        try{
            const findUser = makUser.find((user) => user.name === name);
            if (!findUser) throw new Error("user not found");
            if(findUser.password !== password)
                throw new Error("Invalied Credentials");
                done(null, findUser);
        }  catch(err){
                 done(err, null);
        }
    })
)