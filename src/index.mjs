import express, { request, response } from "express";

const app = express();

const PORT = process.env.PORT || 3000;
const makUser = [
    {id : 1, name : "muthu", displayNAme : "Muthu"},
    {id : 2,name : "lahiru", displayNAme : "lahiru"},
    {id : 3,name : "rajith", displayNAme : "rajith"},
];

app.get("/api/users", (request, response) => {
    response.send(makUser);
});


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