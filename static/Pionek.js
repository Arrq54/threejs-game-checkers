class Pionek extends THREE.Mesh {

    constructor(geometry, material) {
        super() // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        this.geometry = geometry
        this.material = material
    }
    setMaterial(material) {
        this.material = material
    }
}

const pionek = new Pionek()
console.log(pionek.type)