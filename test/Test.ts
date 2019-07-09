
import { assert } from 'chai';
import {Notificacion} from "../modelo/Notificacion";
import {Usuario} from '../modelo/Usuario';

describe('notificacion' , () => {

    it('un usuario tiene un id y un email', () => {
        const usuario = new Usuario(1, 'usuario1@gmail.com');
        assert.equal(usuario.getId(), 1);
        assert.equal(usuario.getEmail(), 'usuario1@gmail.com');

    });
    it('Notificacion no tiene ningun usuario suscripto', () => {
        const notificacion = new Notificacion();
        assert.equal(notificacion.cantidadUsuarioSuscriptos(), 0);
    });
    it('un usuario se suscribe a la lista de notificaciones del artista 1', () => {
        const notificacion = new Notificacion();
        const usaurio1 = new Usuario(1, 'usuario1@gmail.com');

        notificacion.suscribirAUsuario(usaurio1, 1);

        assert.equal(notificacion.cantidadUsuarioSuscriptos(), 1);
    });
    it('un usuario se desuscribe de la lista de notificaciones del artista 1', () => {
        const notificacion = new Notificacion();
        const usuario1 = new Usuario(1, 'usuario1@gmail.com');

        notificacion.suscribirAUsuario(usuario1, 1);
        notificacion.desucribirAUsuario(usuario1, 1);

        assert.equal(notificacion.cantidadUsuarioSuscriptos(), 0);

    });

});
