class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x077b88);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("root").append(this.renderer.domElement);
        this.szachownica = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
        ];
        this.pionki = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
        ];
        this.chessboard = []
        this.pawns = []
        this.fieldsAbleToMove = []
        this.camera.position.set(0, 500, 0)
        this.camera.lookAt(this.scene.position)
        this.axes = new THREE.AxesHelper(100)
        this.scene.add(this.axes)
        this.createChessBoard()
        this.render() 

    }
    createChessBoard() {
        let blackBoxMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, 
            map: new THREE.TextureLoader().load('mats/whiteBox.png'), 
            transparent: true, 
            opacity: 1, 
        })
        let whiteBoxMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, 
            map: new THREE.TextureLoader().load('mats/blackBox.jpg'), 
            transparent: true, 
            opacity: 1, 
        })
        const geometry = new THREE.BoxGeometry( 216, 5, 8 );
        const material = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('mats/boundries.jpg'), } );
        const boundries = new THREE.Mesh( geometry, material );
        boundries.position.set(0,2.5,104)
        const boundries2 = new THREE.Mesh( geometry, material );
        boundries2.position.set(0,2.5,-104)
        const boundries3 = new THREE.Mesh( geometry, material );
        boundries3.position.set(-104,2.5,0)
        boundries3.rotation.y = Math.PI/2
        const boundries4 = new THREE.Mesh( geometry, material );
        boundries4.position.set(104,2.5,0)
        boundries4.rotation.y = Math.PI/2
        this.scene.add(boundries)
        this.scene.add(boundries2)
        this.scene.add(boundries3)
        this.scene.add(boundries4)
        this.szachownica.map((element,i)=>{
            element.map((item,j)=>{
                const geometry = new THREE.BoxGeometry(25, 5, 25);
                let material;
                let type;
                if (item == 1) {
                    material = blackBoxMaterial
                    type = "black"
                } else {
                    material = whiteBoxMaterial
                    type = "white"
                }
                let shift = 12.5
                const cube = new Field(geometry, material, type)
                cube.position.set((i * 25) + shift - (25 * this.szachownica.length) / 2, 0, (j * 25) + shift - (25 * this.szachownica.length) / 2)
                cube.cubeIndexY = i;
                cube.cubeIndexX = j;
                this.scene.add(cube);
                this.chessboard.push(cube)
            })
        })
    }
    animatePawns(){
        this.pawns.map((element)=>{
            new TWEEN.Tween(element.position) 
                .to({ x: element.position.x, y: 2.5, z: element.position.z }, 750)
                .repeat(0) 
                .easing(TWEEN.Easing.Bounce.InOut) 
                .onUpdate()
                .onComplete(sleep(51))
                .start()
           
        })
    }
    generatePawns() {
        let whitePawnMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, 
            map: new THREE.TextureLoader().load('mats/whitePawn.png'), 
            transparent: true, 
            opacity: 1, 
            color: 0xffffff
        })
        let blackPawnMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, 
            map: new THREE.TextureLoader().load('mats/blackPawn.jpg'), 
            transparent: true, 
            opacity: 1, 
            color: 0xff0000
        })
        updateControlArray()
        let counter = 0;
        this.pionki.map((element,i)=>{
            element.map((pionek,j)=>{
                if (pionek != 0) {
                    const geometry = new THREE.CylinderGeometry(10, 10, 10, 32, 32);
                    let material;
                    let pawnType;
                    if (pionek == 2) {
                        material = blackPawnMaterial
                        pawnType = "black"
                    } else if (pionek == 1) {
                        material = whitePawnMaterial
                        pawnType = "white"
                    }
                    let shift = 12.5
                    const cylinder = new Pionek(geometry, material);
                    cylinder.position.set((i * 25) + shift - (25 * this.pionki.length) / 2, 200, (j * 25) + shift - (25 * this.pionki.length) / 2)
                    cylinder.name = `pawn`
                    cylinder.positionForRaycaster = cylinder.position
                    cylinder.pawnId = counter;
                    counter += 1;
                    cylinder.pawnIndexY = i;
                    cylinder.pawnIndexX = j;
                    cylinder.pawnType = pawnType
                    this.scene.add(cylinder);
                    this.pawns.push(cylinder)
                }
            })
        })
        return true;
    }
    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        TWEEN.update();
    }
}
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  
async function checkPawnMovement() {
    let data = await net.checkPawnMovement()
    if (data.move != false) {
        game.pionki = data.table;
        updateControlArray()
        game.pawns.map((pawn,i)=>{
            if (pawn.pawnId == data.movedPawn.pawnId) {
                new TWEEN.Tween(pawn.position).to({ x: data.movedPawn.position.x, y: data.movedPawn.position.y, z: data.movedPawn.position.z }, 300).repeat(0).easing(TWEEN.Easing.Circular.InOut).onUpdate().onComplete().start()
                pawn.pawnIndexX = data.pawnIndexes.x;
                pawn.pawnIndexY = data.pawnIndexes.y;
            }
            if(data.beaten!=null){
                if(pawn.pawnId == data.beaten){
                    game.pawns = game.pawns.filter((element)=>{return element.pawnId!=data.beaten})
                    removePawn(pawn)
                }
            }
        })
    }
}
async function fetchUpdatePawnPosition(body) {
    let turn = await net.updatePawnPosition(body)
    console.log(turn.loser)
    if(turn.loser==null){
        if (turn.turn != playerType) {
            stopCountingMyTimer()
            ui.changeDisplay("overlay","block")
            ui.changeDisplay("enemyTurnTimer","block")
            enableClicking = false;
            stopCounting()
            beginCounting()
        } else {
            ui.changeDisplay("overlay","none")
            ui.changeDisplay("enemyTurnTimer","none")
            enableClicking = true;
        }
    }
    
}
let enableClicking;
let timerInterval;
let defaultTime = 5;
function setDefaultTime(){
    defaultTime = 30
}
let pawnMoveInterval = undefined;
function beginCounting() {
    if(justStarted){
        game.animatePawns()
        justStarted=false;
    }
    console.log("licznik")
    setDefaultTime()
    document.querySelector("#timer").textContent = String(defaultTime)
    timerInterval = setInterval(timer, 1000)
    pawnMoveInterval = setInterval(checkPawnMovement, 1000)
}
function stopCounting() {
    clearInterval(timerInterval)
    clearInterval(pawnMoveInterval)
    ui.changeDisplay("enemyTurnTimer","none")
}
async function timer() {
    let turn = await net.checkActualTurn()
    if (turn.turn != playerType) {
        turn.loser!=null?turn.loser!=username?win():console.log():console.log()
        if(defaultTime>0){
            defaultTime -= 1;
            document.querySelector("#timer").textContent = String(defaultTime)
            ui.changeDisplay("overlay","block")
            ui.changeDisplay("enemyTurnTimer","block")
            stopCountingMyTimer()
            enableClicking = false;
        }
       
    } else {
        ui.changeDisplay("overlay","none")
        ui.changeDisplay("enemyTurnTimer","none")
        enableClicking = true;
        stopCounting()
        beginCountingMyTimer()
    }
}
function beginCountingMyTimer() {
    console.log("licznik")
    setDefaultTime()
    ui.changeDisplay("myTurnTimer", "block")
    document.querySelector("#myTimer").textContent = String(defaultTime)
    myTurnInterval = setInterval(myTimer, 1000);
}
async function myTimer(){
    if(defaultTime == 0){
        stopCountingMyTimer()
        let loser =await  net.updateLoser(username)
        ui.changeDisplay("loser","block")
        ui.changeDisplay("overlay","block")
        enableClicking = false;
        return;
    }
    defaultTime -= 1;
    document.querySelector("#myTimer").textContent = String(defaultTime)
}
function stopCountingMyTimer(){
    ui.changeDisplay("myTurnTimer","none")
    clearInterval(myTurnInterval)
}
function updateControlArray(){
    if (playerType == "white") {
        let string = ""
        game.pionki.map((element,i)=>{
            for (let j =element.length - 1; j >= 0; j--) {
                string += `<span style="color: ${game.pionki[i][j]==1?'white':game.pionki[i][j]==2?'red':'black'}">`+String(game.pionki[i][j]) + "</span>, "
            }
            string += "\n"
        })
        document.querySelector("#gameStatus").innerHTML = string
    } else {
        let temp = [...game.pionki].reverse()
        let string = ""
        temp.map((element,i)=>{
            element.map((item,j)=>{
                string += `<span style="color: ${item==1?'white':item==2?'red':'black'}">`+String(item) + "</span>, "
            })
            string += "\n"
        })
        document.querySelector("#gameStatus").innerHTML = string
    }
}
function clearAbleToMove() {
    if (game.fieldsAbleToMove != []) {
        let black = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/blackBox.jpg'),
            transparent: true,
            opacity: 1
        })
        let white = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/blackBox.jpg'),
            transparent: true,
            opacity: 1
        })
        game.fieldsAbleToMove.map((element,i)=>{
            if (element.name == "white") {
                element.setMaterial(black)
            } else {
                element.setMaterial(white)
            }
        })
        game.fieldsAbleToMove = []
    }
}
let myTurnInterval;


let beaten = null;
function removePawn(pawn){
    game.pawns = game.pawns.filter((element)=>{return element.pawnId != pawn.pawnId})
    game.pionki[pawn.pawnIndexY][pawn.pawnIndexX] = 0;
    beaten = pawn.pawnId;
    updateControlArray()
    pawn.parent.remove(pawn)

    let blackPawns = game.pawns.filter((element,index)=>{return element.pawnType=="black"})
    let whitePawns =  game.pawns.filter((element,index)=>{return element.pawnType=="white"})
    if(whitePawns.length == 0){
        playerType=="black"?setTimeout(win, 100):setTimeout(lose, 100)
    }
    if(blackPawns.length == 0){
        playerType=="white"?setTimeout(win, 100):setTimeout(lose, 100)
    }

}
function lose(){
    stopCounting()
    stopCountingMyTimer()
    ui.changeDisplay("loser","block")
    ui.changeDisplay("overlay","block")
    enableClicking = false;
}
function win(){
    enableClicking = false;
    stopCounting()
    stopCountingMyTimer()
    ui.changeDisplay("winner","block")
    ui.changeDisplay("overlay","block")
    ui.changeDisplay("enemyTurnTimer","none")
}
window.addEventListener("mousedown", (e) => {
    if (gameStarted && enableClicking) {
        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2()
        mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVector, game.camera);
        const intersects = raycaster.intersectObjects(game.scene.children);
        if (intersects.length > 0) {
            if (intersects[0].object.name == "pawn") {
                console.log(`X: ${intersects[0].object.pawnIndexX}, Y: ${intersects[0].object.pawnIndexY}`)
                if (game.selectedPawn != undefined) {
                    clearAbleToMove()
                    if (playerType == "white") {
                        let mat = new THREE.MeshBasicMaterial({
                            side: THREE.DoubleSide, 
                            map: new THREE.TextureLoader().load('mats/whitePawn.png'), 
                            transparent: true, 
                            opacity: 1, 
                            color: 0xffffff
                        })
                        game.selectedPawn.setMaterial(mat)
                    } else {
                        let mat = new THREE.MeshBasicMaterial({
                            side: THREE.DoubleSide, 
                            map: new THREE.TextureLoader().load('mats/blackPawn.jpg'), 
                            transparent: true, 
                            opacity: 1, 
                            color: 0xff0000
                        })
                        game.selectedPawn.setMaterial(mat)
                    }
                    game.selectedPawn = undefined
                }
                game.selectedPawn = undefined
                let id = intersects[0].object.uuid
                game.pawns.map((pawn,index)=>{
                    if (pawn.pawnType == playerType) {
                        if (pawn.uuid == id) {
                            let selectedMaterial = new THREE.MeshBasicMaterial({
                                side: THREE.DoubleSide, 
                                map: new THREE.TextureLoader().load('mats/whitePawn.png'), 
                                transparent: true, 
                                opacity: 1, 
                                color: 0xffff00
                            })
                            pawn.setMaterial(selectedMaterial)
                            game.selectedPawn = pawn
                            clearAbleToMove()
                            if(playerType=="white"){
                                try{
                                    if(game.pionki[game.selectedPawn.pawnIndexY - 1][game.selectedPawn.pawnIndexX + 1] == 2 && game.pionki[game.selectedPawn.pawnIndexY - 2][game.selectedPawn.pawnIndexX + 2]==0){
                                        let field = game.chessboard.filter((element)=>{return (element.cubeIndexX==game.selectedPawn.pawnIndexX +2  && element.cubeIndexY==game.selectedPawn.pawnIndexY - 2)})[0]
                                        game.fieldsAbleToMove.push(field)
                                        let mat = new THREE.MeshBasicMaterial({
                                            side: THREE.DoubleSide, 
                                            map: new THREE.TextureLoader().load('mats/ableToMove.jpg'),
                                            transparent: true, 
                                            opacity: 1
                                        })
                                        field.setMaterial(mat)  
                                    }
                                    if(game.pionki[game.selectedPawn.pawnIndexY - 1][game.selectedPawn.pawnIndexX - 1] == 2 && game.pionki[game.selectedPawn.pawnIndexY - 2][game.selectedPawn.pawnIndexX - 2]==0){
                                        let field = game.chessboard.filter((element)=>{return (element.cubeIndexX==game.selectedPawn.pawnIndexX -2  && element.cubeIndexY==game.selectedPawn.pawnIndexY - 2)})[0]
                                        game.fieldsAbleToMove.push(field)
                                        let mat = new THREE.MeshBasicMaterial({
                                            side: THREE.DoubleSide, 
                                            map: new THREE.TextureLoader().load('mats/ableToMove.jpg'),
                                            transparent: true, 
                                            opacity: 1
                                        })
                                        field.setMaterial(mat)
                                    }
                                }catch{
                                    console.log("off")
                                }
                                
                            }else{
                                try{
                                    if(game.pionki[game.selectedPawn.pawnIndexY + 1][game.selectedPawn.pawnIndexX + 1] == 1 && game.pionki[game.selectedPawn.pawnIndexY + 2][game.selectedPawn.pawnIndexX + 2]==0){
                                        let field = game.chessboard.filter((element)=>{return (element.cubeIndexX==game.selectedPawn.pawnIndexX +2  && element.cubeIndexY==game.selectedPawn.pawnIndexY + 2)})[0]
                                        game.fieldsAbleToMove.push(field)
                                        let mat = new THREE.MeshBasicMaterial({
                                            side: THREE.DoubleSide, 
                                            map: new THREE.TextureLoader().load('mats/ableToMove.jpg'),
                                            transparent: true, 
                                            opacity: 1
                                        })
                                        field.setMaterial(mat)
                                    }
                                    if(game.pionki[game.selectedPawn.pawnIndexY + 1][game.selectedPawn.pawnIndexX - 1] == 1 && game.pionki[game.selectedPawn.pawnIndexY + 2][game.selectedPawn.pawnIndexX - 2]==0){
                                        let field = game.chessboard.filter((element)=>{return (element.cubeIndexX==game.selectedPawn.pawnIndexX -2  && element.cubeIndexY==game.selectedPawn.pawnIndexY + 2)})[0]
                                        game.fieldsAbleToMove.push(field)
                                        let mat = new THREE.MeshBasicMaterial({
                                            side: THREE.DoubleSide, 
                                            map: new THREE.TextureLoader().load('mats/ableToMove.jpg'),
                                            transparent: true, 
                                            opacity: 1
                                        })
                                        field.setMaterial(mat)
                                    }
                                }catch{
                                    console.log("off")
                                }
                               
                            }
                            game.chessboard.map((element,i)=>{
                                let canMove = false;
                                if (playerType == "white") {
                                    if (element.cubeIndexY <= game.selectedPawn.pawnIndexY &&
                                        element.cubeIndexY >= game.selectedPawn.pawnIndexY - 1 &&
                                        element.cubeIndexX >= game.selectedPawn.pawnIndexX - 1 &&
                                        element.cubeIndexX <= game.selectedPawn.pawnIndexX + 1) {
                                        canMove = true;
                                    }
                                } else {
                                    if (element.cubeIndexY >= game.selectedPawn.pawnIndexY &&
                                        element.cubeIndexY <= game.selectedPawn.pawnIndexY + 1 &&
                                        element.cubeIndexX >= game.selectedPawn.pawnIndexX - 1 &&
                                        element.cubeIndexX <= game.selectedPawn.pawnIndexX + 1) {
                                        canMove = true;
                                    }
                                }
                                if (element.name == "white") {
                                    if (canMove) {
                                        let flag = true;
                                        game.pawns.map((pawn,i)=>{
                                            if (pawn.position.x == element.position.x && pawn.position.z == element.position.z) 
                                                flag = false
                                        })
                                        if (flag) {
                                            let mat = new THREE.MeshBasicMaterial({
                                                side: THREE.DoubleSide, 
                                                map: new THREE.TextureLoader().load('mats/ableToMove.jpg'), 
                                                transparent: true,
                                                opacity: 1
                                            })
                                            element.setMaterial(mat)
                                            game.fieldsAbleToMove.push(element)
                                        }
                                    }
                                }
                            })
                        }
                    }
                })
            } else {
                if (game.selectedPawn != undefined) {
                    if(game.fieldsAbleToMove.includes(intersects[0].object)){
                        if (intersects[0].object.name == "white") {
                            let ratio = intersects[0].object.cubeIndexX - game.selectedPawn.pawnIndexX;
                            if(playerType=="white"){
                                if(ratio==2){
                                    game.pawns.map((pawn,i)=>{
                                        if(pawn.pawnIndexX == (intersects[0].object.cubeIndexX -1) && pawn.pawnIndexY == (intersects[0].object.cubeIndexY +1)){
                                            removePawn(pawn)
                                        }
                                    })
                                }else if (ratio==-2 ){
                                    game.pawns.map((pawn,i)=>{
                                        if(pawn.pawnIndexX == (intersects[0].object.cubeIndexX +1) && pawn.pawnIndexY == (intersects[0].object.cubeIndexY +1)){
                                            removePawn(pawn)
                                        }
                                    })
                                }
                            }else{
                                if(ratio==2){
                                    game.pawns.map((pawn,i)=>{
                                        if(pawn.pawnIndexX == (intersects[0].object.cubeIndexX -1) && pawn.pawnIndexY == (intersects[0].object.cubeIndexY -1)){
                                            removePawn(pawn)
                                        }
                                    })
                                }else if (ratio==-2 ){
                                    game.pawns.map((pawn,i)=>{
                                        if(pawn.pawnIndexX == (intersects[0].object.cubeIndexX +1) && pawn.pawnIndexY == (intersects[0].object.cubeIndexY -1)){
                                            removePawn(pawn)
                                        }
                                    })
                                }
                            }
                            game.pionki[intersects[0].object.cubeIndexY][intersects[0].object.cubeIndexX] = game.pionki[game.selectedPawn.pawnIndexY][game.selectedPawn.pawnIndexX];
                            game.pionki[game.selectedPawn.pawnIndexY][game.selectedPawn.pawnIndexX] = 0;
                            game.selectedPawn.pawnIndexY = intersects[0].object.cubeIndexY
                            game.selectedPawn.pawnIndexX = intersects[0].object.cubeIndexX
                            updateControlArray()
                            game.pawns.map((element,i)=>{
                                if (element.position.x == intersects[0].object.position.x && element.position.z == intersects[0].object.position.z)
                                return;
                            })
                            new TWEEN.Tween(game.selectedPawn.position) 
                            .to({ x: intersects[0].object.position.x, y: 2.5, z: intersects[0].object.position.z }, 300)
                            .repeat(0) 
                            .easing(TWEEN.Easing.Circular.InOut) 
                            .onUpdate()
                            .onComplete()
                            .start()
                        fetchUpdatePawnPosition(JSON.stringify({ moved: { pawnId: game.selectedPawn.pawnId, position: { x: intersects[0].object.position.x, y: 2.5, z: intersects[0].object.position.z } }, username: username, table: game.pionki, beaten: beaten, pawnIndexes: {x:  game.selectedPawn.pawnIndexX, y:  game.selectedPawn.pawnIndexY } }))
                        clearAbleToMove()
                        if (playerType == "white") {
                            let mat = new THREE.MeshBasicMaterial({
                                side: THREE.DoubleSide, 
                                map: new THREE.TextureLoader().load('mats/whitePawn.png'), 
                                transparent: true, 
                                opacity: 1, 
                                color: 0xffffff
                            })
                            game.selectedPawn.setMaterial(mat)
                        } else {
                            let mat = new THREE.MeshBasicMaterial({
                                side: THREE.DoubleSide, 
                                map: new THREE.TextureLoader().load('mats/blackPawn.jpg'), 
                                transparent: true, 
                                opacity: 1, 
                                color: 0xff0000
                            })
                            game.selectedPawn.setMaterial(mat)
                        }
                        game.selectedPawn = undefined;
                        }
                    }
                }
            }
        }
    }
});
