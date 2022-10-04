const express = require('express');
const request = require('supertest');
const apiRouter = require('../routes/api');

const app = express();

app.use('/api', apiRouter);