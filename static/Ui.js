class Ui {
    constructor() {
        console.log("Ui")
    }
    attempLoginUi(){
        let username = document.querySelector("#login").value
        console.log("attemplogin")
        net.attemptLogin(username)
    }
    setStatus(status){
        document.querySelector("#status").innerText = status
    }
    changeDisplay(id, display){
        document.querySelector(`#${id}`).style.display = display
    }
}