
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express ();
require('dotenv').config();

app.use (cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bkf4wz6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try {

        const videoCollections = client.db('videoGallery').collection('videoCollection');
        const tagCollections = client.db('videoGallery').collection('tags');

        app.get('/videos', async(req,res)=>{
            const query={};
            const cursor = videoCollections.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });

      app.get ('/videos',async (tags, search) => {
        let queryString = "";
    
        if (tags?.length > 0) {
            queryString += tags.map((tag) => `tags_like=${tag}`).join("&");
        }
    
        if (search !== "") {
            queryString += `&q=${search}`;
        }
        })
       

        app.get('/videos/:videoId',async(req,res)=>{
            const videoId = req.params.videoId;
            const query = {_id:new ObjectId(videoId)};
            const services = await videoCollections.findOne(query);
            res.send(services);

        });

        app.get('/tags', async(req,res)=>{
            const query={};
            const cursor = tagCollections.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });

    }

    finally{

    }
}
  
run().catch(console.dir);

app.get('/',async(req,res)=>{
    res.send ('Video gallery Server is Running')
})

app.listen(port, ()=>console.log(`Video gallery is Running on ${port}`))