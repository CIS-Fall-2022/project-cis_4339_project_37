const express = require("express");
const router = express.Router();

//importing data model schemas
let { primarydata } = require("../models/models");
let { eventdata } = require("../models/models");
// IMPORTANT - "/" route will only return the clients that are apart of the organization
// that is running the instance. So depending on id that is stored in the .env file ex: ORGANIZATION = 'XXXXXXXXX-452e-11ed-a044-27e6ab98a1a8'
// some routes will only return specifically for that org


// ----------------- GET REQUESTS ----------------------------
//GET request that retrieves all clients for the org that 
// running the instance, so it depends on the .env variable for organization
router.get("/", (req, res, next) => {
    // grabs the organization from the .env file
    orgID = process.env.ORGANIZATION
    primarydata.find({ orgs: orgID },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET request that retrives single entry by using the ID of the client
router.get("/id/:id", (req, res, next) => {
    primarydata.find(
        { _id: req.params.id },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET requests that retrieves clients based on search query
//Ex: '...?firstName=Bob&lastName=&searchBy=name' 
router.get("/search/", (req, res, next) => {
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, $options: "i" }
        }
    };
    primarydata.find(
        dbQuery,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

// ----------- POST request --------------------
//POST request to insert a client into the db
router.post("/", (req, res, next) => {
    primarydata.create(
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
    primarydata.createdAt;
    primarydata.updatedAt;
    primarydata.createdAt instanceof Date;
});

// ------------------ PUT Requests --------------------------------

//PUT request to update the attributes for the client using the id of the client
router.put("/:id", (req, res, next) => {
    primarydata.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});


// PUT request to add an org to client
router.put("/addOrg/:id", (req, res, next) => {
    // use org ID from .env file of that org's instance
    orgID = process.env.ORGANIZATION
    primarydata.updateOne(
        { _id: req.params.id },
        // $push to insert the id into the org array
        {
            $push: { orgs: orgID }
        },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});


// removes org to a client in order to associate them
router.put("/removeOrg/:id", (req, res, next) => {
    //contains the ID of the organization that is running this instance
    orgID = process.env.ORGANIZATION
    primarydata.updateOne(
        // finds the user
        { _id: req.params.id },
        // pulls org from the array that contains org ids 
        {
            $pull: { orgs: orgID }
        },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

// ------------- DELETE Requests ----------------------------
// Deletes a client based on their id
router.delete("/deletePrimary/:id", (req, res, next) => {
    console.log(req.body)
    primarydata.remove(
        { _id: req.params.id },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});



module.exports = router;