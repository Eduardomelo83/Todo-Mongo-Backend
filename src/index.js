const express = require('express');
const moogoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const todoRouter = require('./routes/todoRouter');
const app = express();

app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele 
    if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers é HTTP 
        res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS 
    else //Se a requisição já é HTTPS 
        next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado 
});

app.use(cors());
app.use(express.json());



moogoose.connect(process.env.MONGO, {useUnifiedTopology: true, useNewUrlParser: true});
let db = moogoose.connection;

db.on('error', () => {console.log('houve um erro')});
db.once('open', () => {console.log('banco carregado')});

app.use('/', todoRouter);

app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);

})
