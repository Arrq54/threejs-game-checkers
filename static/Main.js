let net;
let ui;
let game;
let userCount;
let interval;
window.onload = () => {
    net = new Net();
    ui = new Ui();
    game = new Game();
}
window.onresize = () => {
    game.camera.aspect = window.innerWidth / window.innerHeight;
    game.camera.updateProjectionMatrix();
    game.renderer.setSize(window.innerWidth, window.innerHeight);
}
async function checkUserAmmount() {
    console.log("user")
    let fetchData = await fetch("/checkAmmount") // fetch
        .then(response => response.json())
    userCount = fetchData.count
    if (userCount == 2) {
        clearInterval(interval);
        ui.changeDisplay("waitMessage","none");
        ui.changeDisplay("overlay","none");
        pawnMoveInterval = setInterval(checkPawnMovement, 1000);
        gameStarted = true;
        enableClicking = true;
        beginCountingMyTimer();
        game.animatePawns();
        updateControlArray();
        document.querySelector("#status2").innerText = `Twoim przeciwnikiem jest: ${fetchData.players[1]} `
    }
}
let gameStarted = false;
let playerType;
let username;
let justStarted=false;
async function checkLogin(data) {
    if (data.success) {
        await game.generatePawns()
        username = data.username
        ui.changeDisplay("loginDiv", "none")        
        if (data.count == 1) {
            game.camera.position.set(200, 200, 0)
            game.camera.lookAt(game.scene.position)
            document.querySelector("#status").innerText = `Witaj ${data.username}, grasz białymi `
            let div = document.createElement("DIV");
            div.id = "waitMessage"
            let h1 = document.createElement("H1")
            h1.innerText = "Oczekiwanie na drugiego gracza ..."
            div.classList.add("wait")
            div.appendChild(h1)
            document.body.appendChild(div)
            playerType = "white"
            interval = setInterval(checkUserAmmount, 500);
        } else {
            enableClicking = false;
            justStarted=true;
            beginCounting()
            game.camera.position.set(-200, 200, 0)
            game.camera.lookAt(game.scene.position)
            document.querySelector("#status").innerText = `Witaj ${data.username}, grasz czarnymi `
            let fetchOpponent = await net.getFirstPlayer()
            document.querySelector("#status2").innerText = `Twoim przeciwnikiem jest: ${fetchOpponent.firstPlayer} `
            playerType = "black"
            gameStarted = true;
            
            ui.changeDisplay("enemyTurnTimer", "block")
        }
       
        return
    }
    ui.setStatus(data.error)
}