import passport from "passport";
import { Strategy } from "passport-local";
import { makUser } from "../utils/constans.mjs";

 // !USER VALIDATION
export default passport.use(
    new Strategy( {
        usernameField: 'name',  // specify the username field
        passwordField: 'password'  // specify the password field
      },(name, password, done) => {
        console.log(`Username : ${name}`);
        console.log(`Password : ${password}`);
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

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user to retrieve full user object from the session data
  passport.deserializeUser((id, done) => {
    const user = makUser.find(user => user.id === id);
    done(null, user);
  });