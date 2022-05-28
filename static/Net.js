class Net {
    constructor() {
        console.log("NET")
    }
    attemptLogin(username) {
        const body = JSON.stringify({ username: username })
        const headers = { "Content-Type": "application/json" } 
        fetch("/login", { method: "post", body, headers }).then(response => response.json()).then(data => checkLogin(data))
    }
    reset() {
        alert("RESET")
        fetch("/reset").then(response => response.json())
    }
    async checkPawnMovement(){
        return await fetch("/checkPawnMovement").then(response => response.json())
    }
    async updatePawnPosition(body){
        const headers = { "Content-Type": "application/json" }
        return await fetch("/updatePawnPosition", { method: "post", body, headers }).then(response => response.json())
    }
    async checkActualTurn(){
        return await fetch("/checkActualTurn").then(response => response.json())
    }
    async updateLoser(username){
        const body = JSON.stringify({ username: username })
        const headers = { "Content-Type": "application/json" } 
        return await fetch("/updateLoser", { method: "post", body, headers }).then(response => response.json())  
    }
    async getFirstPlayer(){
        return await fetch("/getFirstPlayer").then(response => response.json())  
    }
}