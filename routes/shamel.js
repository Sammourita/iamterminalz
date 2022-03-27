const express = require('express');
const res = require('express/lib/response');
const app = express();
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://developers:justfordevelopers@developerz.mbxgr.mongodb.net/developing?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true 
})
let shamelSchema = new mongoose.Schema({
    material: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: String,   
        required: true
    },
    pdfname: {
        type: String,
        required: true
    },
    
})
let shamelModel = new mongoose.model('shamels', shamelSchema)
exports.getMaterial = (req, res) => {
    shamelModel.find({material: req.params.material, branch: req.params.branch}, function(err, doc) {
        shamelModel.find({material: req.params.material, branch: 'LS and GS',}, function(err, common) {
            if(req.session.username === 'khalil sammour') {
                res.render('pdf-admin', {
                    shamels: doc,
                    shamelz: common,
                    material: req.params.material,
                    branch: req.params.branch,
                    isLoggedIn: req.session.username
                })
            }
            else {
            res.render('pdf', {
                shamels: doc,
                shamelz: common,
                material: req.params.material,
                branch: req.params.branch,
                isLoggedIn: req.session.username
    
            })
        
    }
})


    })
    
}
exports.postDawra = (req, res) => {
    const year = req.body.year;
    const fileName = req.body.shamel;
    let newDawra = new shamelModel({
        material: req.params.material,
        branch: req.params.branch,
        year: year,
        pdfname: fileName
    })
    newDawra.save(function(err, save) {
        res.redirect(`/shamel/${req.params.branch}/${req.params.material}`)
    })
}
exports.getPdf = (req, res) => {
    shamelModel.findOne({branch: req.params.branch, material: req.params.material, year: req.params.year}, function(err, pdf) {
        res.render('dawra', {
            dawra: pdf,
            isLoggedIn: req.session.username

        })
    })
}
exports.shamelModel = shamelModel;
