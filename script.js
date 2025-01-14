const express = require("express")
const app = express()
const fs=require("fs")
const users = require("./MOCK_DATA.json")

app.use(express.urlencoded({extended: "false"}))

app.get('/', function(req, res){
    res.send("This is home page")
})
app.get('/about', function(req, res){
    res.send("This is about page")
})
app.get('/api/users', function(req, res){
    return res.json(users)
})
app.get('/api/users/:id', function(req, res){
    const id = Number(req.params.id)
    const user = users.find((user)=>user.id ===id)

    return res.json(user)
})
app.patch("/api/users/:id", function(req, res){
    return res.json({status: "Patching Pending"})
})
app.delete("/api/users/:id", function(req, res) {
    const id = Number(req.params.id);

    // Check if the user exists
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({ status: "User not found" });
    }

    // Remove the user from the array
    users.splice(userIndex, 1);

    // Write the updated users array back to the file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error("Error writing to file", err);
            return res.status(500).json({ status: "Error deleting user" });
        }

        return res.json({ status: "User deleted successfully" });
    });
});

app.get('/users', function(req, res){
    const f_name = `
    <ul>
        ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>`
    res.send(f_name)
})
app.get('/users/:id', function(req, res){
    const id = Number(req.params.id)
    const user = users.find((user)=>user.id ===id)
    const f_name = `
    <ul>
        <li>${user.first_name}</li>
        <li>${user.last_name}</li>
        <li>${user.email}</li>
        <li>${user.gender}</li>
    </ul>`
    res.send(f_name)
})
app.post("/api/users", function(req, res){
    const body = req.body
    users.push({id: users.length + 1, ...body})
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), function(err, data){
        return res.json({status: "Post Done", id: users.length})
    })
    // return res.json({status: "Post Pending"})
})
app.all('*', function(req, res){
    res.status(404).send("This is 404 page")
})

app.listen(5000)