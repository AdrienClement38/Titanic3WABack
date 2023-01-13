import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser"
import { PassengersModel } from "./Model/passengersModel.js"
import { UsersModel } from "./Model/usersModel.js";


// Connexion à la base de données
mongoose
  .connect("mongodb://localhost:27017/titanic", {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
  })
  .then(init);

async function init() {

    const app = express();
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false}))
    app.use(bodyParser.json())

    app.get("/passengers", async (req, res) => {
        try {
    
          const Passengers = await PassengersModel.find({});
          res.json(Passengers);
        } catch (err) {
          res.status(500).send(err.message);
        }
    })



    app.get("/passengers/search/:name", async (req, res) => {

      try {

        const Passengers = await PassengersModel.find(

          { Name : {$regex : req.params.name, $options : "i"}}
        );

        res.json(Passengers);
      
      } catch (err) {

        res.status(500).send(err.message);
      }
    });


    app.get("/passengers/sex", async (req, res) => {
      try {
        const passengersMale = await PassengersModel.count({'Sex': "male", "Survived": 1})
        const passengersFemale = await PassengersModel.count({'Sex': "female", "Survived": 1})
        res.json({male:passengersMale, female:passengersFemale});
      } catch (err) {
        res.status(500).send(err.message);
      }
    });


    app.get("/passengers/age", async (req, res) => {
      try {
        const passenger10 = await PassengersModel.count({"Age": {$gte:0, $lte: 10}, "Survived": "1"})
        const passenger20 = await PassengersModel.count({"Age": {$gte:11, $lte: 20}, "Survived": "1"})
        const passenger30 = await PassengersModel.count({"Age": {$gte:21, $lte: 30}, "Survived": "1"})
        const passenger40 = await PassengersModel.count({"Age": {$gte:31, $lte: 40}, "Survived": "1"})
        const passenger50 = await PassengersModel.count({"Age": {$gte:41, $lte: 50}, "Survived": "1"})
        const passenger60 = await PassengersModel.count({"Age": {$gte:51, $lte: 60}, "Survived": "1"})
        const passenger70 = await PassengersModel.count({"Age": {$gte:61, $lte: 70}, "Survived": "1"})
        const passenger80 = await PassengersModel.count({"Age": {$gte:71, $lte: 80}, "Survived": "1"})
        const passenger90 = await PassengersModel.count({"Age": {$gte:81, $lte: 90}, "Survived": "1"})
        const passenger100 = await PassengersModel.count({"Age": {$gte:91, $lte: 100}, "Survived": "1"})
        res.json({
          p10: passenger10,
          p20: passenger20,
          p30: passenger30,
          p40: passenger40,
          p50: passenger50,
          p60: passenger60,
          p70: passenger70,
          p80: passenger80,
          p90: passenger90,
          p100: passenger100
        })
      } catch (err) {
        res.status(500).send(err.message);
      }
    });


    app.get("/passengers/class", async (req, res) => {
      try {
        const passengersc1 = await PassengersModel.count({"Pclass": '1'})
        const passengersc2 = await PassengersModel.count({"Pclass": '2'})
        const passengersc3 = await PassengersModel.count({"Pclass": '3'})
        res.json({c1:passengersc1, c2:passengersc2, c3: passengersc3});
      } catch (err) {
        res.status(500).send(err.message);
      }
    })


    app.get("/passengers/agestat", async (req, res) => {
      try {
        const womenAge = await PassengersModel.find({'Sex': "female", "Survived": "1", "Age": {$exists : true}})
        const menAge = await PassengersModel.find({'Sex': "male", "Survived": "1", "Age": {$exists : true}})
        res.json({womenAge:womenAge, menAge:menAge});
      } catch (err) {
        res.status(500).send(err.message);
      }
    })


    app.get("/passengers/classstat", async (req, res) => {
      try {
        const class1 = await PassengersModel.find({"Survived": "1", "Pclass": "1", "Age": {$exists : true}})
        const class2 = await PassengersModel.find({"Survived": "1", "Pclass": "2", "Age": {$exists : true}})
        const class3 = await PassengersModel.find({"Survived": "1", "Pclass": "3", "Age": {$exists : true}})
        res.json({class1:class1, class2:class2, class3:class3});
      } catch (err) {
        res.status(500).send(err.message);
      }
    })

    app.post("/auth/subscribe", async (req, res) => {
      try {

          const Users = await UsersModel.findOne(req.body);
          if (Users) {
              res.status(401).send("Un erreur est survenue, veuillez recommencer");
          } else {
              const newUser = await UsersModel.create(req.body)
              res.json("Utilisateur enregistré");
          }
      } catch (err) {
          res.status(500).send(err.message);
      }
  })


    app.post("/auth/login", async (req, res) => {
      try {
        
        const Users = await UsersModel.findOne( req.body );
  
        if(Users == null || Users == ""){
          res.status(401).send('Utilisateur non trouvé');
        } else {
          res.json(Users);
        }
  
      } catch (err) { 
  
        res.status(500).send(err.message);
      }
    });

    app.listen(8000, () =>
    console.log(`Server running at http://localhost:8000/`)
  );

  

};