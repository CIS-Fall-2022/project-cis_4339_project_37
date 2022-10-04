const express = require("express");
const router = express.Router();

//importing data model schemas
let { eventdata } = require("../models/models");
let { orgdata } = require("../models/models");

//GET all entries
router.get("/", (req, res, next) => {
    orgdata.find(
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET entries based on search query
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
//GET single entry by ID
router.get("/id/:id", (req, res, next) => {
    orgdata.find(
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


//POST
router.post("/", (req, res, next) => {
    orgdata.create(
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
    orgdata.createdAt;
    orgdata.updatedAt;
    orgdata.createdAt instanceof Date;
});

//PUT update (make sure req body doesn't have the id)
router.put("/:id", (req, res, next) => {
    orgdata.findOneAndUpdate(
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


// PUT updates array by inserting a new eventID
router.put("/addEvent/:id", (req, res, next) => {
    console.log(req.body)
    orgdata.updateOne(
        { _id: req.params.id },
        {
            $push: req.body
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


// deletes an org by using the ID of the org
router.delete("/deleteOrg/:id", (req, res, next) => {
    console.log(req.body)
    orgdata.remove(
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