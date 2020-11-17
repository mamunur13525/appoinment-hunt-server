const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cors = require('cors')
const { ObjectId, ObjectID } = require('mongodb');
const fileUpload = require('express-fileupload');

const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('agency'));
// Enable file upload using express-fileupload
app.use(fileUpload({
  createParentPath: true
}));


const uri = "mongodb+srv://apoinments:If2vNjakyMkdRpVn@cluster0.bipah.mongodb.net/apoinmentHunt?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true  });


client.connect(err => {
  const apartmentCollection = client.db("apoinmentHunt").collection("apoinment");
  const bookingCollection = client.db("apoinmentHunt").collection("booking");
  
  app.get('/appoinments',(req, res)=>{
    apartmentCollection.find({})
    .toArray((err, documentss) =>{
      res.send(documentss)
    })
  })
  app.get('/apartment/', (req, res) => {
    console.log(req.query.id)
    apartmentCollection.find({_id: ObjectId(req.query.id)})
    .toArray( (err, documents) => {
        res.send(documents[0])
      })
    })



  app.get('/apartment',(req,res)=>{
   const id = req.query.id;
    var o_id = new ObjectId(id);
    apartmentCollection.find({_id:o_id})
    .toArray((err, documents)=>{
      res.send(documents[0])
    })
  })

  app.post('/addApartment',(req, res)=>{
    console.log(req.body)
    const apartmentFile = req.body;
    apartmentCollection.insertOne(apartmentFile)
    .then(result => {
      if( result.insertedCount > 0){
        res.send(result.insertedCount > 0)
      }
    })
    .catch(err => console.log(err))
  })

//   app.post('/addApartment',(req, res)=>{
//     const file = req.files.file
//     // const name = req.body.name
//     // const location = req.body.location
//     // const bathroom = req.body.bathroom
//     // const price = req.body.price
//     // const bedroom = req.body.bedroom
//     const fileName = file.name;
//     console.log(req.body)
//     apartmentCollection.insertOne({fileName,name,location,bathroom,price,bedroom})
//     file.mv(`${__dirname}/agency/${file.name}`,err=>{
//         if(err){
//             console.log(err)
//             return res.status(500).send({msg:'failed to upload '})
//         }
//        return res.send({name:file.name, path:`/${file.name}`})
//     })
//     .then(result => {
//       if( result.insertedCount > 0){
//         res.send(result.insertedCount > 0)
//       }
//     })
//     .catch(err => console.log(err))

// }) 






  app.post('/booking',(req,res)=>{
    bookingCollection.insertOne(req.body)
    .then(result => {
      if( result.insertedCount > 0){
        res.send(result.insertedCount > 0)
      }
    })
    
  })

  app.get('/bookinglist',(req, res)=>{
    bookingCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })
  app.get('/booking',(req, res)=>{
    const email =`${req.query.booking}`;
    bookingCollection.find({email: email})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })
  

});



app.get('/',(req, res)=>{
  res.send('Our Apartment Hunt Server Live.')
})


app.listen(process.env.PORT || port)