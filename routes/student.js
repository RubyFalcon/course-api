const Router = require("express").Router();
const db = require('../db/coursedb')
const moment= require('moment');



/*
create-acount params:
    user_ID, Student_Approved(default false)
*/
Router.post('/create-account',  (req, res)=> {
    db.create('student', {
        user_ID: req.body.user_ID,  
        Student_Approved: false         
    }, (result) => {  
        if(result) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    })
})

// DOES THIS WORK???
// Router.post('/add-qualifications',  (req, res)=> {
//     db.create('qualifications', {
//         Type: req.body.type,
//         Name: req.body.name,
//         Date_Issued: moment(req.body.Date_Issued,"YYYY-DD-MM")        
//     }, (result) => {
//         if(result) {
//             res.status(200).json(result);
//         } else {
//             res.status(500).json(result);
//         }
//     })
// })

Router.get('/:id', (req, res) => {
    if(req.params.id == null) {
        return res.status(500).json({ 
            result: false,
            msg: ['Student not found']
        })
    }
    db.get({
        fields: ['*'],
        table: 'student',
        where: { ID: req.params.id },
        limit: 1
    }, (result) => {
        if(result) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    });
});

Router.get('/all', (req, res) => {
    db.get({
        fields: ['*'],
        table: 'student'
    }, (result) => {
        if(result) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    });
});



Router.patch('/:id',/*(adminAuth),*/ (req, res) => {
    if(req.body == null) { return { result: false, msg: ['No data has been sent'] } }
    let updateObject = {}
    if(req.body.Student_Approved != null) updateObject.Student_Approved = req.body.Student_Approved;

    db.update('student', updateObject, {ID: req.params.id}, (result) => {
        if(result) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    });
});



Router.delete('/:id',/*authorization*/ (req, res) => {
    db.delete('student', { ID: req.params.id }, (result) => {
        if(result) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    });
});

module.exports  = Router;