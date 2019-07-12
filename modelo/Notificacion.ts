import {Usuario} from "./Usuario";
import {AdministradorDeMail} from "./AdministradorDeMail";

export class Notificacion {

    private listOfSubscriptions: {[artist: number]: Usuario[]};
    private administradorDeMail: AdministradorDeMail;

    constructor(){
        this.listOfSubscriptions = {};
        this.administradorDeMail = new AdministradorDeMail();
    }

    cantidadUsuarioSuscriptos(): number {
        const allValues = Object.values(this.getList());
        let res: Usuario[] = [];
        allValues.forEach(value => res = res.concat(value));
        return res.length;
    }
    getList(): {[artist: string]: Usuario[]} {
        return this.listOfSubscriptions;
    }

    noExisteElArtista(idArtista: number) : boolean {
        const allKeys = Object.keys(this.getList());
        return !allKeys.includes(idArtista.toString())
    }



    suscribirAUsuario(usuario: Usuario, artistId: number) {

        if (this.noExisteElArtista(artistId)) {
            this.getList()[artistId] = [usuario];
        }
        else {
            this.getList()[artistId].push(usuario)
        }
    }

    usuarioEstaSuscripto(idArtista: number, usuario: Usuario): boolean{
        return this.getList()[idArtista].includes(usuario);
    }

    desucribirAUsuario(usuario: Usuario, idArtista: number) {

        if(this.noExisteElArtista(idArtista)){
            throw new Error('el artista no existe en el sistema');
        }
        if(this.usuarioEstaSuscripto(idArtista, usuario)) {
            const index = this.getList()[idArtista].indexOf(usuario, 0);
            this.getList()[idArtista].splice(index);
        }
        else {
            throw  new Error('No se puede eliminar un usuario que no este suscripto');
        }

    }

    borrarTodasLasSuscripcionesPara(artistId: number) {

        if(this.noExisteElArtista(artistId)) {
            throw new Error('No existe el artista en el sistema');
        }else {
            this.getList()[artistId] = [];
        }
    }

    todasLasSuscripcionesDe(artistId: number): Usuario[] {
        return this.getList()[artistId]
    }

    enviarMailsASuscriptos(artistId: number, subject: string, message: string, from: string) {

        if(!this.noExisteElArtista(artistId)){
            this.getList()[artistId].forEach(suscripto => this.administradorDeMail.mandarMail(suscripto.getEmail(), subject, message, from))
        }
        else{
            throw new Error('El artista no existe ');
        }
    }
}
