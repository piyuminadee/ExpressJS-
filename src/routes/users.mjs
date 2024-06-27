import { Router } from "express";
import { query, validationResult, matchedData, checkSchema } from "express-validator";
import { makUser } from "../utils/constans.mjs";
import createUserVAlidationSchema from "../utils/validationSchema.mjs";
//import loggingMiddleware from "../index.mjs";
import  {User} from "../mongoose/schemas/user.mjs";


const router = Router();

router.get(
    
        "/api/users",
        query("search")
          .isString()
          .withMessage("Must be string")
          .notEmpty()
          .withMessage("Not Empty"),
        (request, response) => {
          const result = validationResult(request);
          console.log(result);
          console.log(request.query);
          const {
            query: { search, value },
          } = request;
      
          //when search and value are undefined
          if (!search && !value) return response.send(makUser);
      
          //when search and value exists
          if (search && value)
            return response.send(
              makUser.filter((user) => user[search].includes(value))
            );
        }
      )


router.post(
  "/api/users", 
  checkSchema(createUserVAlidationSchema),
   async (request, response) => {
    const result = validationResult(request);
    if(!result.isEmpty()) return response.send(result.array());
  
     const {body} = request;
     const newUser = new User(body);
    try{
      const savedUser = await newUser.save();
      return response.status(201).send(savedUser)
    } catch (err) {
      console.log(err);
      return response.sendStatus(400);
    }
}
)   

router.put(
"/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = makUser.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  makUser[findUserIndex] = { id: parsedId, ...body };
  return response.sendStatus(200);
});


router.patch("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = makUser.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  makUser[findUserIndex] = { ...makUser[findUserIndex], ...body };
  return response.sendStatus(200);
});



// !DELETE REQUEST
router.delete("/api/users/:id", (request, response) => {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = makUser.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  makUser.splice(findUserIndex);
  return response.sendStatus(200);
});



// !GET REQUEST

router.get("/api/users/:id", (request, response) => {
  console.log(request.params);
  const parsedId = parseInt(request.params.id);
  console.log(parsedId);
  if (isNaN(parsedId))
    return response.status(400).send({ msg: "Bad Request. INVALIED ID." });
  const findUser = makUser.find((user) => user.id === parsedId);
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});


export default router;