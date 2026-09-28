const express = require('express');
const { randomBytes } = require('crypto');
const access = require('../api/access');

module.exports = function setupLocalApi(app) {
  // This file runs only in the React development server, never in the browser.
  if (!process.env.ACCESS_SESSION_SECRET && !process.env.BLOB_READ_WRITE_TOKEN) {
    process.env.ACCESS_SESSION_SECRET = randomBytes(32).toString('hex');
  }
  app.post('/api/access', express.json({ limit: '2kb' }), access);
};
