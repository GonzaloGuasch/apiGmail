import express from 'express';
import bodyParser from 'body-parser';
import {Notificacion} from "./modelo/Notificacion";
import cors from 'cors';
import requestPromise from "request-promise";
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3032;
const api_gmail = new Notificacion();
const app = express();

app.use(bodyParser());
app.use(cors());


// para el chequeo del json podriamos pasarle una lista de parametros a una funcion que haga un allSatisfice de que
//estan todos bien formados
//sacar usuarios y poner todo mail, ver como hacer la sub clase de errror para los tric catch




app.post('/api/subscribe', async (req: any, res: any) => {
    const artistID = req.body.artistID;
    const emailDeNuevoUsuario = req.body.email;

    if(!emailDeNuevoUsuario || !artistID) {
        res.status(400);
        res.send({
            send:'BAD_REQUEST',
            errorCode: 400
        });
        return
    }
    try {
        const artistResponseString = await requestPromise.get(`${process.env.BASE_URL}${artistID}`);
        const artistResponse = JSON.parse(artistResponseString);
        api_gmail.suscribirAUsuario(emailDeNuevoUsuario, artistResponse.id);
        res.status(200);
        res.send({
            status: 200,
            message: 'Succeeded'
        });
    }catch (error) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RELATED_RESOURCE_NOT_FOUND'
        });
    }
});

app.post('/api/unsubscribe', async (req, res) => {
    const artistID = req.body.artistID;
    const emailDeNuevoUsuario = req.body.email;

    if(!emailDeNuevoUsuario || !artistID) {
        res.status(400);
        res.send({
            send: 'BAD_REQUEST',
            errorCode: 400
        });
        return
    }
    try {
        const artistResponseString = await requestPromise.get(`${process.env.BASE_URL}${artistID}`);
        const artistResponse = JSON.parse(artistResponseString);
        api_gmail.desucribirAUsuario(emailDeNuevoUsuario, artistResponse.id);
        res.status(200);
        res.send({
            status: 200,
            message: 'Succeeded'
        });
    }catch (error) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RELATED_RESOURCE_NOT_FOUND',
        });
    }
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
    try{
        console.log('aSD');
        const artistResponseString = await requestPromise.get(`${process.env.BASE_URL}${artistId}`);
        const artistResponse = JSON.parse(artistResponseString);
        await api_gmail.enviarMailsASuscriptos(artistResponse.id, subject, message, from);
        res.status(200);
        res.send({
            status: 200,
            errorCode: 'Succeeded'
        });
    }
    catch (error) {
        if(error.statusCode === 404) {
            console.log(error);
            res.status(404);
            res.send({
                status: 404,
                errorCode: 'RESOURCE_NOT_FOUND'
            });
        }else{
            res.status(500);
            res.send({
                status: 500,
                errorCode: 'INTERNAL_SERVER_ERROR'
            });
        }
    }

});

app.get('/api/subscriptions/:id', async (req, res) => {
    const artistId = req.params.id;

    if (!artistId) {
        res.status(400);
        res.send({
            send: 'BAD_REQUEST',
            errorCode: 400
        });
        return
    }

    try {
        const artistResponseString = await requestPromise.get(`${process.env.BASE_URL}${artistId}`);
        const artistResponse = JSON.parse(artistResponseString);
        const todasLasSuscripciones = api_gmail.todasLasSuscripcionesDe(artistResponse.id);
        res.status(200);
        res.send({
            'artistId': artistResponse.id,
            'subcriptors': todasLasSuscripciones
        });
    }catch (error) {
        if (error.statusCode === 404) {
            res.status(404);
            res.send({
                status: 404,
                errorCode: 'RESOURCE_NOT_FOUND'
            });
        }else {
            res.status(404);
            res.send({
                status: 404,
                errorCode: 'RELATED_RESOURCE_NOT_FOUND'
            });
        }
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
    try {
        const artistResponseString = await requestPromise.get(`${process.env.BASE_URL}${artistId}`);
        const artistResponse = JSON.parse(artistResponseString);
        api_gmail.borrarTodasLasSuscripcionesPara(artistResponse.id);
        res.status(200);
        res.send({
            status: 200,
            message: 'Succeeded'
        });
    }catch (error) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RELATED_RESOURCE_NOT_FOUND'
        });
    }

});

app.all('*', (req: any, res: any) => {
    res.status(404);
    res.send({
        status: 404,
        errorCode: 'RESOURCE_NOT_FOUND',
    });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
