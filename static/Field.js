class Field extends THREE.Mesh {

    constructor(geometry, material, type) {
        super() // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        this.geometry = geometry
        this.material = material
        this.name = type
    }
    setMaterial(material) {
        this.material = material
    }
}

const field = new Field()