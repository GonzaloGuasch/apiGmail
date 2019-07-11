
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

    it('se pueden borrar todas las suscripciones de un artista', () => {
        const notificacion = new Notificacion();
        const usuario1 = new Usuario(1, 'usuario1@gmail.com');
        const usuario2 = new Usuario(2, 'usuario2@gmail.com');
        const usuario3 = new Usuario(3, 'usuario3@gmail.com');

        notificacion.suscribirAUsuario(usuario1, 1);
        notificacion.suscribirAUsuario(usuario2,1);
        notificacion.suscribirAUsuario(usuario3, 1);

        assert.equal(notificacion.todasLasSuscripcionesDe(1).length, 3);

        notificacion.borrarTodasLasSuscripcionesPara(1);

        assert.equal(notificacion.todasLasSuscripcionesDe(1).length, 0);


    });

});
