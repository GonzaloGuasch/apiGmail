export class Usuario {

    private email: string;
    private id: number;

    constructor(id: number, email: string){
        this.id = id;
        this.email = email;

    }

    getId() : number {
        return this.id;
    }
    getEmail(): string {
        return this.email;

    }
}
