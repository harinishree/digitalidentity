
'use strict';
var user = "risabh.s";
const doc = require('../models/doc');
var bcSdk = require('../fabcar/query');
var ownsLedgerData = [];
var docArray = [];



exports.fetchUsersdocs = (rapidID) => {
    return new Promise((resolve, reject) => {

        bcSdk.getMydocs({
                
                rapidID: rapidID
            })



            .then((userdocs) => {

                ownsLedgerData = userdocs.body.owns

            //    for (let i = 0; i < ownsLedgerData.length; i++) {
                    doc.find({
                            "rapid_doc_ID": ownsLedgerData
                        })

                        .then((docs) => {

                              resolve({
                    status: 201,
                    docArray: docs
                })
            })
			
          })
                  .catch(err => {

                console.log("error occurred" + err);

                return reject({
                    status: 500,
                    message: 'Internal Server Error !'
                });
            })
    })
};

