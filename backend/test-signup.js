import { signup } from './dist/controllers/auth.controller.js';

const req = {
  body: {
    name: "Test User",
    email: "test2@example.com",
    password: "Password123!",
    confirmPassword: "Password123!",
    acceptTerms: true
  },
  headers: {},
  ip: "127.0.0.1"
};

const res = {
  status: function(code) {
    console.log("STATUS:", code);
    return this;
  },
  json: function(data) {
    console.log("JSON:", data);
    return this;
  },
  cookie: function(name, val, opts) {
    console.log("COOKIE:", name);
  }
};

signup(req, res).catch(console.error);
