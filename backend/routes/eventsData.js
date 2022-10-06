const express = require("express");
const router = express.Router();

//importing data model schemas
// importing both the orgdata and the eventdata in order
// to grab events from the specific org
let { eventdata } = require("../models/models");
let { orgdata } = require("../models/models");


// this function will be used in the routes in order to pass
// through the org's information -orgEvents- to return
function orgInfo(routeFunction) {
    // grabbing the ORGANIZATION env variable that contains the id of the orgs 
    // that is running the instance
    orgdata.find({ "_id": process.env.ORGANIZATION },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                // parses through the data and stores the event array 
                // containing the events in the event variable
                let events = data[0].orgEvents;
                // passes through the event array to the function that is calling it
                // allowing the function to use the event id that belongs to the speific org
                routeFunction(events);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
}

//GET all events
router.get("/", (req, res, next) => {

    orgInfo(orgEventData)

    // function to find all eventdata for the org
    function orgEventData(eventList) {
        let event = eventList;
        // using $in in order to find any events that are in the event array, which comes from the orgInfo function
        // this array will only contain event id's for that are assigned to instance org
        eventdata.find({ _id: { $in: event } },
            (error, data) => {
                if (error) {
                    return next(error);
                } else {
                    res.json(data);
                }
            }
        ).sort({ 'updatedAt': -1 }).limit(10);
    };
});


//GET single entry by ID
router.get("/id/:id", (req, res, next) => {
    orgInfo(orgEventDataID)

    function orgEventDataID(eventList) {
        eventdata.find({ _id: req.params.id }, (error, data) => {
            if (error) {
                return next(error)
            } else {
                res.json(data)
            }
        })
    };
});

// GET entries based on search query
// Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => {
    orgInfo(orgEventDataID)
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date: req.query["eventDate"]
        }
    };
    eventdata.find(
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

//GET events for which a client is signed up
router.get("/client/:id", (req, res, next) => {
    orgInfo(orgEventDataID)
    eventdata.find(
        { attendees: req.params.id },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

// dashboard data events for last 2 months and clients
router.get("/ptmevents", (req, res, next) => {
    orgInfo(orgEventDataID)
    var today = new Date();
    console.log(today)
    newDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    console.log(newDate)
    eventdata.find(
        { date: { $gte: newDate } }, { eventName: true, attendees: true, date: true },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//POST
router.post("/", (req, res, next) => {
    eventdata.create(
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

//PUT
router.put("/:id", (req, res, next) => {
    orgInfo(orgEventDataID)
    eventdata.findOneAndUpdate(
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

//PUT add attendee to event
router.put("/addAttendee/:id", (req, res, next) => {
    orgInfo(orgEventDataID)
    //only add attendee if not yet signed uo
    eventdata.find(
        { _id: req.params.id, attendees: req.body.attendee },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id },
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                consol
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }

            }
        }
    );

});

//DELETE an Event by using the ID
router.delete("/deleteEvent/:id", (req, res, next) => {
    orgInfo(orgEventDataID)
    eventdata.findOneAndRemove(
        { _id: req.params.id },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.status(200).json({
                    msg: data
                });
                res.send('Event is deleted');
            }
        });
});


module.exports = router;