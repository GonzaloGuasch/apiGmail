import express from 'express';
import bodyParser from 'body-parser';
import {Notificacion} from "./modelo/Notificacion";
import cors from 'cors';


const PORT = 3032;
const api_gmail = new Notificacion();
const app = express();

app.use(bodyParser);
app.use(cors());

//refactorizar la forma que se le pide el artista a unqfy y las consultas si esta bien formada la query
//el try catch tambien
// para el chequeo del json podriamos pasarle una lista de parametros a una funcion que haga un allSatisfice de que
//estan todos bien formados


app.post('/api/subscribe', (req: any, res: any) => {
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

    try {
        const artist =  `http://unqfy/api/artists/${artistID}`;
        api_gmail.suscribirAUsuario(email, artistID);
        res.status(200);

    }catch (error) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RELATED_RESOURCE_NOT_FOUND'
        });

    }
});

app.post('/api/unsubscribe', (req, res) => {
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

        try {
            const artist = `http://unqfy/api/artists/${artistID}`;
            api_gmail.desucribirAUsuario(email, artistID);
            res.status(200);

        } catch (error) {
            res.status(404);
            res.send({
                status: 404,
                errorCode: 'RELATED_RESOURCE_NOT_FOUND'
            });
        }
});


app.post('api/notify', (req, res) => {
    const artistId = req.params.artistID;
    const subject = req.params.subject;
    const message = req.params.message;
    const from    = req.params.from;


    if(!artistId || !subject || !message || !from){
        res.status(400);
        res.send({
            send: 'BAD_REQUEST',
            errorCode: 400
        });
        return
    }
    try{
        const artist =  `http://unqfy/api/artists/${artistId}`;
        api_gmail.enviarMailsASuscriptos(artistId, subject, message, from);
        res.status(200)

    }catch (error) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RELATED_RESOURCE_NOT_FOUND'
        });

    }

});

app.get('/api/subscriptions?:artistId', (req, res) => {
    const artistId = req.params.artistID;

    if(!artistId){
        res.status(400);
        res.send({
            send: 'BAD_REQUEST',
            errorCode: 400
        });
        return
    }
    try{
        const artist =  `http://unqfy/api/artists/${artistId}`;
        const todasLasSuscripciones = api_gmail.todasLasSuscripcionesDe(artistId);

        res.status(200);
        res.send({
            'artistId': artistId,
            'subcriptors': todasLasSuscripciones
        });
    }
    catch (error) {
        res.status(404);
        res.send({
            status: 404,
            errorCode: 'RELATED_RESOURCE_NOT_FOUND'
        });
    }
});

app.delete('/api/subscriptions', (req, res) => {
    const artistId = req.body.artistID;

    if(!artistId){
        res.status(400);
        res.send({
            send: 'BAD_REQUEST',
            errorCode: 400
        });
        return
    }
    try{
        const artist =  `http://unqfy/api/artists/${artistId}`;
        api_gmail.borrarTodasLasSuscripcionesPara(artistId);
        res.status(200);

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
