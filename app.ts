import express from 'express';
import bodyParser from 'body-parser';
import {Notificacion} from "./modelo/Notificacion";
import cors from 'cors';
import requestPromise from "request-promise";


const PORT = 3032;
const api_gmail = new Notificacion();
const app = express();

app.use(bodyParser);
app.use(cors());

//refactorizar la forma que se le pide el artista a unqfy y las consultas si esta bien formada la query
//el try catch tambien
// para el chequeo del json podriamos pasarle una lista de parametros a una funcion que haga un allSatisfice de que
//estan todos bien formados
//funcion get


app.post('/api/subscribe', async (req: any, res: any) => {
    const artistID = req.body.artistID;
    const email = req.body.email;

    if(!email || !artistID) {
        res.status(400);
        res.send({
            send:'BAD_REQUEST',
            errorCode: 400
        });
        return
    }
    const artistResponse = await requestPromise.get(`http://unqfy/api/artists/${artistID}`);

    if(artistResponse.status === 404) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RELATED_RESOURCE_NOT_FOUND'
        });
        return
    }

    api_gmail.suscribirAUsuario(email, artistResponse.id);
    res.status(200);
    res.send();

});

app.post('/api/unsubscribe', async (req, res) => {
    const artistID = req.body.artistID;
    const email = req.body.email;

    if(!email || !artistID) {
        res.status(400);
        res.send({
            send: 'BAD_REQUEST',
            errorCode: 400
        });
        return
    }

    const artistResponse = await requestPromise.get(`http://unqfy/api/artists/${artistID}`);

    if(artistResponse.status === 404) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RELATED_RESOURCE_NOT_FOUND',
        });
        return
    }

    api_gmail.desucribirAUsuario(email, artistResponse.id);
    res.status(200);
    res.send();
});


app.post('api/notify', async (req, res) => {
    const artistId = req.params.artistID;
    const subject = req.params.subject;
    const message = req.params.message;
    const from = req.params.from;


    if (!artistId || !subject || !message || !from) {
        res.status(400);
        res.send({
            send: 'BAD_REQUEST',
            errorCode: 400
        });
        return
    }
    const artistResponse = await requestPromise.get(`http://unqfy/api/artists/${artistId}`);

    if (artistResponse.status === 404) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RESOURCE_NOT_FOUND'
        });
        return
    }
    try {
        api_gmail.enviarMailsASuscriptos(artistResponse.id, subject, message, from);
        res.status(200);
        res.send();
    }catch (error) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RELATED_RESOURCE_NOT_FOUND'
        });
    }
    
});

app.get('/api/subscriptions?:artistId', async (req, res) => {
    const artistId = req.params.artistID;

    if (!artistId) {
        res.status(400);
        res.send({
            send: 'BAD_REQUEST',
            errorCode: 400
        });
        return
    }
    const artistResponse = await requestPromise.get(`http://unqfy/api/artists/${artistId})`);
    if (artistResponse.status === 404) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RESOURCE_NOT_FOUND'
        });
    }

    try {

        const todasLasSuscripciones = api_gmail.todasLasSuscripcionesDe(artistResponse.id);
        res.status(200);
        res.send({
            'artistId': artistResponse.id,
            'subcriptors': todasLasSuscripciones
        });
    } catch (error) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RELATED_RESOURCE_NOT_FOUND'
        });

    }
});

app.delete('/api/subscriptions', async (req, res) => {
    const artistId = req.body.artistID;

    if (!artistId) {
        res.status(400);
        res.send({
            send: 'BAD_REQUEST',
            errorCode: 400
        });
        return
    }

    const artistResponse = await requestPromise.get(`http://unqfy/api/artists/${artistId}`);
    if (artistResponse.status === 404) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RELATED_RESOURCE_NOT_FOUND'
        });
    }

    api_gmail.borrarTodasLasSuscripcionesPara(artistResponse.id);
    res.status(200);
    res.send();
});


app.all('*', (req: any, res: any) => {
    res.status(404);
    res.send({
        status: 404,
        errorCode: 'RESOURCE_NOT_FOUND',
    });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
