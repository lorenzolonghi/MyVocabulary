const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const path = require("path");
const { requireAuth, getUserInfo } = require("./libraries/authLibrary");

//controllers
const authController = require("./controllers/authController");
const appController = require("./controllers/appController");


const app = express();

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
require('dotenv').config();

app.use(getUserInfo);


//auth routes
app.get("/register", authController.register_get);
app.get("/login", authController.login_get);
app.post("/register", authController.register_post);
app.post("/login", authController.login_post);
app.get("/logout", authController.logout);

//app routes
app.get("/", requireAuth, appController.page_home);
app.get("/create-list", requireAuth, appController.page_create_list);
app.post("/create-list", requireAuth, appController.post_create_list);
app.get("/getUserData", appController.getUserData);
app.get("/get-lists/:userId", requireAuth, appController.get_lists);
app.get("/list/:listId", requireAuth, appController.page_list_by_id);
app.get("/api/list/:listId", requireAuth, appController.data_list_by_id);
app.get("/delete-list/:listId", requireAuth, appController.delete_list);
app.get("/edit-list/:listId", requireAuth, appController.page_edit_list);
app.post("/edit-list", requireAuth, appController.post_edit_list);


app.listen(3000, () => {
    console.log("App running on port 3000");
});


