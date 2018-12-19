const express = require("express");
const router = express.Router();
const RateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const Device = require("../models/device");

// Attempt to limit spam post requests for inserting data
const minutes = 5;
const postLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000, // milliseconds
  max: 100, // Limit each IP to 100 requests per WindowMS
  delayMs: 0, // Disable delaying - full speed untill the max limit is reached
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      msg: `You made too many requests. Please try again after ${minutes} minutes.`
    });
  }
});

// READ (ONE)
router.get("/:id", (req, res) => {
  Device.findById(req.params.id)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(404).json({ success: false, msg: `No such Device.` });
    });
});

// READ (ALL)
router.get("/", (req, res) => {
  Device.find({})
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res
        .status(500)
        .json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// CREATE
router.post("/", postLimiter, (req, res) => {
  let newDevice = new Device({
    deviceTitle: req.body.deviceTitle,
    deviceType: req.body.deviceType,
    location: req.body.location,
    sensor: req.body.sensor,
    updated: req.body.updated
  });

  newDevice
    .save()
    .then(result => {
      res.json({
        success: true,
        msg: `Successfully added!`,
        result: {
          _id: result._id,
          deviceTitle: result.deviceTitle,
          deviceType: result.deviceType,
          location: result.location,
          sensor: result.sensor,
          updated: result.updated
        }
      });
    })
    .catch(err => {
      if (err.errors) {
        if (err.errors.deviceTitle) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.deviceTitle.message });
          return;
        }
        if (err.errors.deviceType) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.deviceType.message });
          return;
        }
        if (err.errors.location) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.location.message });
          return;
        }
        if (err.errors.sensor) {
          res
            .status(400)
            .json({ success: false, msg: err.error.sensorsmessage });
          return;
        }
        if (err.errors.updated) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.updated.message });
          return;
        }
   
      
        // Show failed if all else fails for some reason
        res
          .status(500)
          .json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// UPDATE
router.put("/:id", (req, res) => {
  Device.findOneAndUpdate({ _id: req.params.id }, updatedDevice, {
    // runValidators: true,
    context: "query"
  })
    .then(oldResult => {
      Device.findOne({ _id: req.params.id })
        .then(newResult => {
          res.json({
            success: true,
            msg: `Successefully updated!`,
            result: {
              _id: newResult._id,
              title: newResult.title,
              type: newResult.type,
              status: newResult.status,
              location: newResult.location,
              updated: newResult.updated,
              sensors: newResult.sensors
            }
          });
        })
        .catch(err => {
          res
            .status(500)
            .json({ success: false, msg: `Something went wrong. ${err}` });
          return;
        });
    })
    .catch(err => {
      if (err.errors) {
        if (err.errors.title) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.title.message });
          return;
        }
        if (err.errors.type) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.type.message });
          return;
        }
        if (err.errors.status) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.status.message });
          return;
        }
        if (err.errors.location) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.location.message });
          return;
        }
        if (err.errors.updated) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.updated.message });
          return;
        }
        if (err.errors.sensors) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.sensors.message });
          return;
        }
       
        // Show failed if all else fails for some reason
        res
          .status(500)
          .json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// DELETE
router.delete("./:id", (req, res) => {
  Device.findOneAndRemove(req.params.id)
    .then(result => {
      res.json({
        success: true,
        msg: `It has been deleted.`,
        result: {
          _id: result._id,
          title: result.title,
          type: result.type,
          status: result.status,
          location: result.location,
          updated: result.updated,
          sensors: result.sensors
        }
      });
    })
    .catch(err => {
      res.status(404).json({ success: false, msg: "Nothing to delete." });
    });
});

module.exports = router;
