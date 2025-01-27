import express, { request, response } from "express";
import userRouter from "./routes/users.mjs";
import productRoutes from "./routes/products.mjs";
import session from "express-session";
import { makUser } from "./utils/constans.mjs";
import passport from "passport";
import { Strategy } from "passport-local";
import mongoose from "mongoose";
import './stratergies/local-strategy.mjs'


const app = express();
app.use(express.json());

mongoose
.connect('mongodb+srv://express:1234@cluster0.5gahjnj.mongodb.net/express-tutorial?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connect database"))
.catch((err)=> console.log(`Error: ${err}`));


app.use(productRoutes);
app.use(session({
  secret: 'keybord cat',
  resave: false,
  saveUninitialized: true,
  cookie : {secure: false}
}))

app.use(passport.initialize());
app.use(passport.session());



app.use(userRouter);

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.send({ msg: "Authenticated" });
});
// ?    MIDDLEWARE
const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method}-${request.url}`);
  next();
};

app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;


// app.get("/api/users", (request, response) => {
//     response.send(makUser);
// });

//    !QUERY PARAMS
//    !VALIDATION QUERY PARAMS
// ? http://localhost:3000/api/users?search=name&&value=i
// app.get(
//   "/api/users",
//   query("search")
//     .isString()
//     .withMessage("Must be string")
//     .notEmpty()
//     .withMessage("Not Empty"),
//   (request, response) => {
//     const result = validationResult(request);
//     console.log(result);
//     console.log(request.query);
//     const {
//       query: { search, value },
//     } = request;

//     //when search and value are undefined
//     if (!search && !value) return response.send(makUser);

//     //when search and value exists
//     if (search && value)
//       return response.send(
//         makUser.filter((user) => user[search].includes(value))
//       );
//   }
// );

//    !POST REQUEST
//    !VALIDATION REQUEST BODY

// app.post(
//   "/api/users", 
//   checkSchema(createUserVAlidationSchema),
//     (request, response, next) => {
//         const result = validationResult(request);
//         console.log(result);
//         const data = matchedData(request);
//         console.log(data)
//         if(!result.isEmpty()) return response.status(400).send({errors: result.array()})
//   //const { body } = request;
//   const newUser = { id: makUser[makUser.length - 1].id + 1, ...data };

//   makUser.push(newUser);
//   return response.status(201).send(newUser);
//   next();
// }
// );

// !PUT REQUEST
// app.put("/api/users/:id", (request, response) => {
//   const {
//     body,
//     params: { id },
//   } = request;
//   const parsedId = parseInt(id);
//   if (isNaN(parsedId)) return response.sendStatus(400);
//   const findUserIndex = makUser.findIndex((user) => user.id === parsedId);
//   if (findUserIndex === -1) return response.sendStatus(404);
//   makUser[findUserIndex] = { id: parsedId, ...body };
//   return response.sendStatus(200);
// });

// !PATCH REQUEST

// app.patch("/api/users/:id", (request, response) => {
//   const {
//     body,
//     params: { id },
//   } = request;
//   const parsedId = parseInt(id);
//   if (isNaN(parsedId)) return response.sendStatus(400);
//   const findUserIndex = makUser.findIndex((user) => user.id === parsedId);
//   if (findUserIndex === -1) return response.sendStatus(404);
//   makUser[findUserIndex] = { ...makUser[findUserIndex], ...body };
//   return response.sendStatus(200);
// });

// // !DELETE REQUEST
// app.delete("/api/users/:id", (request, response) => {
//   const {
//     params: { id },
//   } = request;
//   const parsedId = parseInt(id);
//   if (isNaN(parsedId)) return response.sendStatus(400);
//   const findUserIndex = makUser.findIndex((user) => user.id === parsedId);
//   if (findUserIndex === -1) return response.sendStatus(404);
//   makUser.splice(findUserIndex);
//   return response.sendStatus(200);
// });

// // !GET REQUEST

// app.get("/api/users/:id", (request, response) => {
//   console.log(request.params);
//   const parsedId = parseInt(request.params.id);
//   console.log(parsedId);
//   if (isNaN(parsedId))
//     return response.status(400).send({ msg: "Bad Request. INVALIED ID." });
//   const findUser = makUser.find((user) => user.id === parsedId);
//   if (!findUser) return response.sendStatus(404);
//   return response.send(findUser);
// });
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

app.get("/", (request, response) => {
  response.cookie("Active", "World", {maxAge:6000})
  console.log(request.session);
  console.log(request.sessionID);
  response.status(201).send({msg : "hello"})
})

app.post("/api/auth", (request, response) => {
 
  const {
    body: {name, password},

  } = request;
  const findUser = makUser.find((user) => user.name === name);
  if(!findUser || findUser.password !== password)
    return response.status(401).send({msg : "BAD CREDENTIALS"});

  request.session.user = findUser;    //server know who user it is
  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) =>{
  console.log(`Inside /auth/status endpoint`);
  console.log(request.user);

  return request.user
  ? response.status(200).send(request.user)
  : response.status(401).send({msg : "Not Authentication"});
});