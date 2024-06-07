import express, { request, response } from "express";
//import { query} from "express";

import {body, query, validationResult, matchedData , checkSchema} from "express-validator";
import { createUserVAlidationSchema } from "./utils/validationSchema.js";
const app = express();
app.use(express.json());

// ?    MIDDLEWARE
const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method}-${request.url}`);
  next();
};

app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;
const makUser = [
  { id: 1, name: "muthu", displayNAme: "Muthu" },
  { id: 2, name: "lahiru", displayNAme: "lahiru" },
  { id: 3, name: "rajith", displayNAme: "rajith" },
];

// app.get("/api/users", (request, response) => {
//     response.send(makUser);
// });

//    !QUERY PARAMS
//    !VALIDATION QUERY PARAMS
// ? http://localhost:3000/api/users?search=name&&value=i
app.get(
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
);

//    !POST REQUEST
//    !VALIDATION REQUEST BODY

app.post("/api/users", checkSchema(createUserVAlidationSchema),
    (request, response, next) => {
        const result = validationResult(request);
        console.log(result);
        const data = matchedData(request);
        console.log(data)
        if(result.isEmpty()) return response.status(400).send({errors: result.array()})
  //const { body } = request;
  const newUser = { id: makUser[makUser.length - 1].id + 1, ...data };

  makUser.push(newUser);
  return response.status(201).send(newUser);
  next();
});

// !PUT REQUEST
app.put("/api/users/:id", (request, response) => {
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

// !PATCH REQUEST

app.patch("/api/users/:id", (request, response) => {
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
app.delete("/api/users/:id", (request, response) => {
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

app.get("/api/users/:id", (request, response) => {
  console.log(request.params);
  const parsedId = parseInt(request.params.id);
  console.log(parsedId);
  if (isNaN(parsedId))
    return response.status(400).send({ msg: "Bad Request. INVALIED ID." });
  const findUser = makUser.find((user) => user.id === parsedId);
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
