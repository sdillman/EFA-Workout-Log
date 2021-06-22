    // ***** 4.2 EXPRESS ROUTER INTRODUCTION *****
const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
// Import the Log Model
const { LogModel } = require("../models");

router.get('/practice', validateJWT, (req, res) => {
    res.send('Hey!! This is a practice route!');
    // ^^ handler function
});

/*
======================
    WOL CREATE
======================
*/
router.post("/", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.sendStatus(200).json(newLog);
    } catch (err) {
        res.status(500).json( { error: err.message } );
    }
})


/*
=========================================
    WorkOutLogs GET LOGGED-IN USER's
=========================================
*/

router.get("/", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


/*
==============================
    WorkOutLogs GET BY ID  --  HELLLLPPPPPPP!
==============================
*/

router.get("/:id", async (req, res) => {
    /* ^^^ the : before title makes it a dynamic route */
    const log_Id = req.params.id;
    const user_Id = req.user.id;
    try {
        const results = await User.findAll({
            where: {   //include:?
                id: log_Id,
                owner: user_Id
            }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
==========================
    WorkOutLog UPDATE
==========================
*/

router.put("/:id", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner: userId
        }
    };

    const updatedLog =  {
        description: description,
        definition: definition,
        result: result,
        owner_id: userId
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
========================
    JOURNALS DELETE
========================
*/

router.delete("/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner: ownerId
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({ message: "Workout Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err});
    }
});

/* ======================================= */

// router.get('/about', (req, res) => {
//     res.send('This is the about route!');
//     // ^^ handler function
// });

// router.get('/user', (req, res) => {
//     res.send('This is the user route!');
//     // ^^ handler function
// });

module.exports = router;
    // ***** 4.2 EXPRESS ROUTER INTRODUCTION *****