const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

const connectDB = require('./db/conexao');
const { ObjectId } = require('mongodb');
const noteModel = require('./model/Note');


app.use(express.json());

let dbCollection;

async function startServer(){
  try {
    dbCollection = await connectDB();

    //Rotas

    // getAll
    app.get('/api/notes', async (req, res) => {
      try {
        const result = await dbCollection.find({}).toArray();
        res.json(result);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // get
    app.get('/api/notes/:id', async (req, res) => {
      try {
        const result = await dbCollection.find({ _id: new ObjectId(req.params.id) }).toArray();
        res.json(result);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    
    // Add
    app.post('/api/notes', async (req, res) => {
      try {
        // Valida entradas
        if (req.body.titulo == null || req.body.conteudo == null) {
          return res.status(406).send('Título e conteúdo são obrigatórios');
        }

        const data = noteModel(req.body.titulo, req.body.conteudo);

        const result = await dbCollection.insertOne(data);

        if (result && result.insertedId) {
          const insertedDocument = await dbCollection.findOne({ _id: result.insertedId });
          res.status(201).json(insertedDocument);
        } else {
          res.status(500).send('Erro ao inserir documento');
        }
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });


    // Remove
    app.delete('/api/notes/:id', async (req, res) => {
      try {
        const result = await dbCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount === 1) {
          res.status(201).json("Success");
        } else {
          res.status(500).send('Erro ao remover documento');
        }
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });


    // Edit
    app.put('/api/notes/:id', async (req, res) => {
      try {

        // Valida entradas
        if (req.body.titulo == null || req.body.conteudo == null) {
          return res.status(406).send('Título e conteúdo são obrigatórios');
        }
        
        const data = noteModel(req.body.titulo, req.body.conteudo);

        const result = await dbCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: data});
        
        if (result.matchedCount) {
          const insertedDocument = await dbCollection.findOne({ _id: new ObjectId(req.params.id) });
          res.status(201).json(insertedDocument);
        } else {
          res.status(500).send('Erro ao inserir documento');
        }
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });
    
app.listen(port, () =>{
  console.log('app running');
})
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();



