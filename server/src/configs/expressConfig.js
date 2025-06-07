const express = require('express');

function expressConfig(app) {
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
}

module.exports = expressConfig;