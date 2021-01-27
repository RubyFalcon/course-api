const Router = require("express").Router();
const db = require('../db/coursedb')
const moment= require('moment');

Router.post('/create-account',  (req, res)=> {
    db.create('staff', {
        User_ID: req.body.User_ID,
        Staff_role: req.body.Staff_role,
        
        
    }, (results) => {
        /* {
            result: true|false
            rows: []
        }*/
        if(results.result) {
            db.update('user',{is_Admin: 1},{ID: req.body.User_ID},()=>{
                console.log(result);
            });
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    })
})

Router.get('/:id', (req, res) => {
    if(req.params.code == null) {
        return res.status(500).json({ 
            result: false,
            msg: ['Staff member not found']
        })
    }
    db.get({
        fields: ['*'],
        table: 'staff',
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

Router.get('/', (req, res) => {
    db.get({
        fields: ['*'],
        table: 'user'
    }, (result) => {
        if(result) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    });
});



Router.patch('/:id',/*(userAuth),*/ (req, res) => {
    if(req.body == null) { return { result: false, msg: ['No data has been sent'] } }
    let updateObject = {}
    if(req.body.address != null) updateObject.address = req.body.address;
   
    if(req.body.hashed_password != null) updateObject.hashed_password = req.body.hashed_password;
    // let End_Date;
    // if(req.body.End_Date != null) {
    //     End_Date = moment(req.body.End_Date, "DD MM YYYY");
    //     if(!(End_Date instanceof String)) updateObject.End_Date = End_Date.format('DD MMM YYYY');
    // }

    db.update('user', updateObject, { ID: req.params.id}, (result) => {
        if(result) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    });
});



Router.delete('/:id', (req, res) => {
    db.delete('staff',/* super-admin-privileges */ { ID: req.params.id }, (result) => {
        if(result) {
            db.update('user',{is_Admin: 0},{ID: req.body.User_ID},()=>{
                console.log(result);
            });
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    });
});

module.exports  = Router;