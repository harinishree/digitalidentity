
'use strict';
var user = "risabh.s";
const doc = require('../models/doc');
// const bcSdk = require('../src/blockchain/blockchain_sdk');

var ownsLedgerData = [];
var docArray = [];
var bcSdk = require('../fabcar/query');

exports.fetchUsersdocs = (rapidID) => {
    return new Promise((resolve, reject) => {

        bcSdk.getMydocs({
               
                rapidID: rapidID
            })



            .then((userdocs) => {

                ownsLedgerData = userdocs.owns
                console.log("userdocs123456",ownsLedgerData)

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

