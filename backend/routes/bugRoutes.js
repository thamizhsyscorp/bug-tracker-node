const express = require('express')
const Bug = require('../models/Bug');

const { tokenVerifyMiddleware } = require('../middlewares/middlewares');
const upload = require('../middlewares/fileUploadMiddleware');
const router = express.Router();

router.get('/',tokenVerifyMiddleware,async(req,res)=>{
    
    const bugs = await Bug.find();
    return res.send(bugs);
});

router.post("/create-bug",tokenVerifyMiddleware,upload.single("image"),async (req, res) => {

        try {

            // Only tester can create bugs
            if (req.user.role !== "tester") {

                // If an image was uploaded but user isn't authorized,
                // remove the uploaded file.
                if (req.file) {
                    const fs = require("fs");

                    fs.unlinkSync(req.file.path);
                }

                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to create a bug"
                });
            }

            const {
                title,
                description,
                project,
                assignedTo,
                team,
                priority,
                bugUrl
            } = req.body;
            const status = "assigned";
            const reporter = req.user.id;

            //Validate required fields
            if (
                !title ||
                !description ||
                !project ||
                !reporter
            ) {

                if (req.file) {
                    const fs = require("fs");

                    fs.unlinkSync(req.file.path);
                }

                return res.status(400).json({
                    success: false,
                    message:
                        "Title, description, project and reporter are required"
                });
            }

            // Image URL
            let imageUrl = "";

            if (req.file) {

                imageUrl =
                    `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
            }

            // Create bug
            const bug = await Bug.create({

                title,

                description,

                project,

                reporter,

                assignedTo: assignedTo || null,

                team: team || "backend",

                priority: priority || "medium",

                status: status || "pending",

                bugUrl: bugUrl || "",

                imageUrl

            });

            return res.status(201).json({
                success: true,
                message: "Bug created successfully",
                bug
            });

        } catch (error) {

            console.error("Create bug error:", error);

            // Delete uploaded image if database creation fails
            if (req.file) {

                const fs = require("fs");

                try {
                    fs.unlinkSync(req.file.path);
                } catch (deleteError) {
                    console.error(
                        "Failed to delete uploaded image:",
                        deleteError.message
                    );
                }
            }

            return res.status(500).json({
                success: false,
                message: "Failed to create bug",
                error: error.message
            });
        }
    }
);
router.get("/assigned-bugs",tokenVerifyMiddleware,async(req,res)=>{
    const developer = req.user.id;
    const bugs = await Bug.find({assignedTo:developer});
    return res.send(bugs);
})

router.put("/update-status",tokenVerifyMiddleware,async(req,res)=>{
    try{
        const {bugId,status} = req.body;
        const developer = req.user.id;
        const bug = await Bug.findById(bugId);
        if(developer!=bug.assignedTo){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this bug"
            });
        }
        await Bug.updateOne({_id:bugId},{$set:{status}});
        const updatedBug = await Bug.findById(bugId);
        return res.send({
            success: true,
            message: "Bug updated successfully",
            updatedBug
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).send(error);
    }
})


module.exports = router;