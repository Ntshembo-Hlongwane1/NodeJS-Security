import express from "express";
import bodyParser from "body-parser";
import { connect } from "mongoose";
import AuthRoutes from "./Routes/Auth.routes";
import ExpressSession from "express-session";
import MongoStore from "connect-mongo";

const mongoURI =
  "mongodb+srv://junior:EakCxqyyzcCSVCBK@cluster0.zfgdf.mongodb.net/Security?retryWrites=true&w=majority";

const server = express();

//=============================================Base Middlewares=================================================
server.use(bodyParser.json());

//=============================================Mongo Conenction=================================================
connect(mongoURI, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Server connected to MongoDB`);
});

//===============================================Session Handler================================================
ExpressSession.Session.prototype.LOGIN = function (data, cb) {
  this.request.session.regenerate(function (error) {
    if (error) {
      return cb(error);
    }
  });
  this.request.session.user = data;
  cb();
};

const Store = new MongoStore({
  mongoUrl: mongoURI,
  collectionName: "session",
  autoRemove: "native",
  ttl: 24 * 60 * 60, //1day  //ttl === Time To Leave
});

server.use(
  ExpressSession({
    store: Store,
    secret: "This is a super secrete code",
    saveUninitialized: true,
    resave: false,
    cookie: {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1day span
    },
    name: "session",
  })
);

//===============================================Server Endpoints===============================================
server.use(AuthRoutes);

server.get("/", (request, response) => {
  response.send("<h1>Session Handling</h1>");
});

const PORT = process.env.PORT ?? 5000;
server.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
