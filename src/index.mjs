import express, { request, response } from "express";

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3000;
const makUser = [
    {id : 1, name : "muthu", displayNAme : "Muthu"},
    {id : 2,name : "lahiru", displayNAme : "lahiru"},
    {id : 3,name : "rajith", displayNAme : "rajith"},
];

// app.get("/api/users", (request, response) => {
//     response.send(makUser);
// });


        //    !QUERY PARAMS
        // ? http://localhost:3000/api/users?search=name&&value=i
app.get("/api/users", (request,response)=>{
    console.log(request.query);
    const {
        query : {search, value},

    } = request;


        //when search and value are undefined
    if(!search && !value) return response.send(makUser);

        //when search and value exists
    if(search && value) return response.send(
        makUser.filter((user)=> user[search].includes(value))
    );


});

        //    !POST REQUEST

app.post("/api/users", (request, response)=>{
    const {body} = request;
   const newUser = {id:makUser[makUser.length-1].id + 1, ...body};

   makUser.push(newUser);
   return response.status(201).send(newUser);
})
  // !PUT REQUEST
  app.put("/api/users/:id", (request,response)=>{
    const {
        body,
        params : {id},
    } = request;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400);
    const findUserIndex = makUser.findIndex((user)=>user.id===parsedId);
    if(findUserIndex===-1) return response.sendStatus(404);
    makUser[findUserIndex] = {id: parsedId, ...body};
    return response.sendStatus(200);
  })
  
 // !PATCH REQUEST
 
 app.patch("/api/users/:id", (request,response)=>{
    const {
        body,
        params : {id},
    } = request;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400);
    const findUserIndex = makUser.findIndex((user)=>user.id===parsedId);
    if(findUserIndex===-1) return response.sendStatus(404);
    makUser[findUserIndex] = {...makUser[findUserIndex], ...body};
    return response.sendStatus(200);
  })



app.get("/api/users/:id", (request, response) =>{
    console.log(request.params);
    const parsedId = parseInt(request.params.id);
    console.log(parsedId);
    if (isNaN(parsedId))
        return response.status(400).send({msg: "Bad Request. INVALIED ID."});
    const findUser = makUser.find((user) => user.id === parsedId);
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
});
app.listen(PORT, ()=>{
    console.log(`Running on port ${PORT}`);
})