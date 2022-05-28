var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;
var path = require("path")
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
let players = []
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html")
})
app.post('/login', function (req, res) {
    let username = req.body.username
    let response = {}
    if (players.length != 2) {
        if (!players.includes(username)) {
            players.push(username)
            response.username = username
            response.count = players.length
            response.success = true;
        } else {
            response.success = false
            response.error = "Użytkownik o takiej nazwie już istnieje!"
        }
    } else {
        response.succes = false
        response.error = "W grze jest już dwóch użytkowników!"
    }
    res.send(response)
})
app.get('/reset', function (req, res) {
    let tempplayers = players
    players = []
    whoseTurn = "white"
    moved=null;
    beaten=null;
    loser=null;
    res.send({ reset: true, players: tempplayers })
})
app.get('/checkAmmount', function (req, res) {
    res.send({ count: players.length, players: players })
})
app.get('/getFirstPlayer', function(req,res){
    res.send({firstPlayer: players[0]})
})
let moved = null;
let whoMoved = null;
let whoseTurn = "white";
let table, indexes, beaten;
app.post('/updatePawnPosition', function (req, res) {
    moved = req.body.moved
    whoMoved = req.body.username
    whoseTurn=="white"?whoseTurn = "black":whoseTurn = "white"
    tempPlayers = [...players]
    table = req.body.table
    indexes = req.body.pawnIndexes
    beaten = req.body.beaten
    console.log(loser)
    res.send({turn: whoseTurn, loser: loser})
})
app.get("/checkActualTurn",function(req,res){
    res.send({turn: whoseTurn, loser: loser})
})
let tempPlayers = [];
app.get('/checkPawnMovement', function (req, res) {
    if (moved != null) {
        res.send({ movedPawn: moved, table: table, pawnIndexes: indexes, beaten: beaten })
        return;
    }
    res.send({ move: false })
})
let loser;
app.post("/updateLoser", function(req,res){
    loser = req.body.username
    res.send({loser: loser})
})
app.post('/getLoser',function(req,res){
    res.send({loser: loser})
})
app.use(express.static('static'))
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
