const mongoose = require('mongoose');
const express = require("express");
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../', '.env') });

const port = process.env.PORT || 80;

const GuestsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
})

const Guests = mongoose.model('Guests', GuestsSchema);

const ConfirmedGuestsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
})

const ConfirmedGuests = mongoose.model('ConfirmedGuests', ConfirmedGuestsSchema);

const routes = express.Router();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

routes.post("*/confirm/:id", async (req, res) => {
    const { id } = req.params;

    const guest = await Guests.findById(id);

    if(!guest){
        return res.status(404).send({
            message: "Guest not found"
        });
    }

    console.log(guest);

    const confirmedGuest = await ConfirmedGuests.findOne({ id: guest._id });

    if(confirmedGuest){
        return res.status(400).send({
            message: "Guest already confirmed"
        });
    }

    await ConfirmedGuests.create({
        name: guest.name,
        id: guest._id
    });

    
    return res.status(200).send({
        message: "Guest confirmed"
    });
});

routes.post("*/create", async (req, res) => {
    const { name } = req.body;

    await Guests.create({
        name,
    });

    
    return res.status(201).send({
        message: "Guest created"
    });
});

// routes.get("*/create-all", async (req, res) => {

//     const names = [];

//     if(names.length === 0){
//         return res.status(400).send({
//             message: "No names provided"
//         });
//     }

//     await Guests.insertMany(names.map(name => ({
//         name
//     })));

//     return res.status(201).send({
//         message: "Guests created"
//     });

// });

routes.get("*/confirmed-guests", async (req, res) => {

    const confirmedGuests = await ConfirmedGuests.find();
    return res.json(confirmedGuests);    
});

routes.get("*/helth", async (req, res) => {
    return res.status(200).send({
        message: "Server is running"
    });    
});


routes.get("*/guests", async (req, res) => {

    const guests = await Guests.find();
    return res.json(guests);    
});

routes.get("*/guest/:id", async (req, res) => {

    const guest = await Guests.find({ _id: req.params.id });    
    return res.json(guest[0]?.name);    
});

app.use(express.static(path.join(__dirname, '../')));

app.use(routes);

app.listen(port, function() {
    console.log(`Server started at port: ${port}`);
})
