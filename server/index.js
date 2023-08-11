const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const mysql = require("mysql");
const db = require("./db");
const notifier = require('node-notifier');
// const sessionStorage = require("sessionstorage-for-nodejs");
const mail_reset = require("mail_reset");
const mail_register = require("mail_register");
const session = require("express-session");
const oneDay = 1000 * 60 * 60 * 24;
const IN_PROD = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));


app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: "abc",
    cookie: {
        httpOnly: true,
        maxAge: oneDay,
        sameSite: true,
        secure: IN_PROD
    }
}));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "lamPhu25@",
    database: "StudentManagement"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!!!")
});

var username;
var password;
var phone;
var email;
var otp;

app.listen(PORT, () => {
    console.log(`Server start on port ${PORT}`);
});

//Reactjs
app.post("/addMember", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;
    const phone = req.body.phone;
    // db.query("INSERT INTO StudentManagement.student (student_name, password, phone, email, address) VALUES (?,?,?,?,?)", [username, password, phone, email, address], (err, result) => {
    //     if (err) {
    //         console.error(err);
    //     }
    // })});
    db.insertData(username, password, phone, email, address);
});
//Reactjs

app.get("/getOTP", function (req, res) {
    res.render("getOTP");
    console.log("username: " + username);
    console.log("password: " + password);
    console.log("email: " + email);
    console.log("phone: " + phone);
});

app.get("/resetpassword", function (req, res) {
    res.render("resetpassword");
});

app.post('/resetpassword_success', async function (req, res) {
    username = req.body.username;
    email = req.body.email;
    password = req.body.password;
    otp = Math.floor(Math.random() * 10000) + 1;
    var mail = await db.checkMail(email);
    if (!mail) {
        return res.render("resetpassword");
    }
    else {
        mail_reset(username, otp, email);
        console.log("username: " + username + " password: " + password);
        res.render("getOPT_mail", { password: password, email: email });
    }
});

app.get("/getOPT_mail", function (req, res) {
    res.render("getOPT_mail");
});

app.get("/register", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    res.render("register", { user: req.session.User, id: id });
});

app.post("/register_success", async function (req, res) {
    otp = Math.floor(Math.random() * 10000) + 1;
    username = req.body.username;
    password = req.body.password;
    phone = req.body.phone;
    email = req.body.email;
    address = req.body.address;
    mail_register(username, otp, email);
    res.render("getOTP", { name: username, password: password, email: email, phone: phone });
});

app.post("/confirmOTP", async function (req, res) {
    var otpCode = req.body.otpcode;
    if (otp != otpCode) {
        console.log("Wrong OTP");
    }
    else {
        await db.insertData(username, password, phone, email, address);
        res.redirect("login");
    }
});

app.post("/confirmOTP_resetpassword", async function (req, res) {
    var otpCode = req.body.otpcode;
    console.log("otpCode: " + otpCode);
    console.log("pass " + password);
    if (otp != otpCode) {
        console.log("Wrong OTP");
    }
    else {
        await db.resetPassword(password, email);
        console.log("Reset Password successful");
        res.redirect("login");
    }
});

app.get("/about", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    res.render("about", { user: req.session.User, id: id });
});

app.get("/cart", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    if (username === undefined) {
        var CartProduct = await db.cartproductNoUser(); //display cart page
    }
    else {
        var student_id = await id.student_id;
        var CartProduct = await db.cartproduct(student_id); //display cart page
    }
    res.render("cart", { user: req.session.User, CartProduct: CartProduct, id: id });
});

app.get("/product", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var ProductInfo = await db.getallproduct();
    res.render("product", { user: req.session.User, product: ProductInfo, id: id });
});

// add and display product to cart
app.post("/product/:ID_product", async function (req, res) {
    var ID_product = req.params.ID_product;
    var username = req.session.User;
    var id = await db.getprofile(username);
    if (username == undefined) {
        var CartProductInfo = await db.addtocart(ID_product);
        var Link_product = CartProductInfo.Link_product;
        var Price_product = CartProductInfo.Price_product;
        await db.selectproduct(Link_product, ID_product, Price_product);
        var CartProduct = await db.cartproductNoUser();
        res.render("cart", { user: req.session.User, CartProduct: CartProduct, id: id });
    }
    else {
        var student_id = await id.student_id;
        var user = await db.checkLogin(username, password);
        var CartProductInfo = await db.addtocart(ID_product); //add product to cart
        var Link_product = CartProductInfo.Link_product;
        var Price_product = CartProductInfo.Price_product;
        await db.selectproduct(Link_product, ID_product, Price_product, student_id); // insert product to cart
        var CartProduct = await db.cartproduct(student_id); //display product in cart
        res.render("cart", { user: req.session.User, CartProduct: CartProduct, id: id });
    }
});

app.get("/member", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    res.render("member", { user: req.session.User, id: id });
});

app.get("/pants", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var ProductInfo = await db.getallproduct();
    var Category = req.params.Category;
    var pants = await db.classifyP(Category);
    res.render("pants", { user: req.session.User, product: ProductInfo, pants: pants, id: id });
});

app.post("/pants/:ID_product", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var ID_product = req.params.ID_product;
    var CartProductInfo = await db.addtocart(ID_product);
    var Link_product = CartProductInfo.Link_product;
    var Price_product = CartProductInfo.Price_product;
    await db.selectproduct(Link_product, ID_product, Price_product);
    var CartProduct = await db.cartproduct();
    var Category = req.params.Category;
    var pants = await db.classifyP(Category);
    var detail = await db.getdetail(ID_product);
    res.render("cart", { user: req.session.User, pants: pants, CartProduct: CartProduct, detail: detail, id: id });
});

app.get("/tshirt", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var ProductInfo = await db.getallproduct();
    var Category = req.params.Category;
    var tshirt = await db.classifyTs(Category);
    res.render("tshirt", { user: req.session.User, product: ProductInfo, tshirt: tshirt, id: id });
});

app.post("/tshirt/:ID_product", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var ID_product = req.params.ID_product;
    var CartProductInfo = await db.addtocart(ID_product);
    var Link_product = CartProductInfo.Link_product;
    var Price_product = CartProductInfo.Price_product;
    await db.selectproduct(Link_product, ID_product, Price_product);
    var CartProduct = await db.cartproduct();
    var Category = req.params.Category;
    var tshirt = await db.classifyTs(Category);
    res.render("cart", { user: req.session.User, tshirt: tshirt, CartProduct: CartProduct, id: id });
});

app.get("/short", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var ProductInfo = await db.getallproduct();
    var Category = req.params.Category;
    var short = await db.classifyS(Category);
    res.render("short", { user: req.session.User, product: ProductInfo, short: short, id: id });
});

app.post("/short/:ID_product", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var ID_product = req.params.ID_product;
    var CartProductInfo = await db.addtocart(ID_product);
    var Link_product = CartProductInfo.Link_product;
    var Price_product = CartProductInfo.Price_product;
    await db.selectproduct(Link_product, ID_product, Price_product);
    var CartProduct = await db.cartproduct();
    var Category = req.params.Category;
    var short = await db.classifyS(Category);
    res.render("cart", { user: req.session.User, short: short, CartProduct: CartProduct, id: id });
});

app.get("/hoodie", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var ProductInfo = await db.getallproduct();
    var Category = req.params.Category;
    var hoodie = await db.classifyHd(Category);
    res.render("hoodie", { user: req.session.User, product: ProductInfo, hoodie: hoodie, id: id });
});

app.post("/hoodie/:ID_product", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var ID_product = req.params.ID_product;
    var CartProductInfo = await db.addtocart(ID_product);
    var Link_product = CartProductInfo.Link_product;
    var Price_product = CartProductInfo.Price_product;
    await db.selectproduct(Link_product, ID_product, Price_product);
    var CartProduct = await db.cartproduct();
    var Category = req.params.Category;
    var hoodie = await db.classifyHd(Category);
    res.render("cart", { user: req.session.User, hoodie: hoodie, CartProduct: CartProduct, id: id });
});

//search for products
app.post("/search", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var searchValues = req.body.search;
    console.log(searchValues, "ads", typeof searchValues);
    var result = await db.search(searchValues);
    console.log(typeof result, "as", result);
    res.render("search", { user: req.session.User, result: result, id: id });
});

// search for members
app.post("/searchMember", async function (req, res) {
    var searchValues = req.body.search;
    var username = req.session.User;
    var id = await db.getprofile(username);
    var password = await id.password;
    var data = await db.searchMember(searchValues);
    var role = await db.getrole(username, password);
    db.getstudentMember(req, res, role);
    res.render("searchMember", { user: req.session.User, studentlist: data, rolename: role, id: id });
});

app.get("/login", function (req, res) {
    res.render("login", { user: req.session.User });
});

//product details
app.get("/details/:ID_product", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var ID_product = req.params.ID_product;
    var detail = await db.getdetail(ID_product);
    var ProductInfo = await db.getallproduct();
    res.render("details", { user: req.session.User, detail: detail, ProductInfo: ProductInfo, id: id });
});

app.get("/home", async function (req, res) {
    var ProductInfo = await db.getallproduct();
    var TypePro = req.params.TypePro;
    var BS = await db.classifyBS(TypePro);
    var NA = await db.classifyNA(TypePro);
    var username = req.session.User;
    var id = await db.getprofile(username);
    res.render("home", { user: req.session.User, ProductInfo: ProductInfo, BS: BS, NA: NA, id: id });
});

app.post("/home/:ID_product", async function (req, res) {
    var ID_product = req.params.ID_product;
    var username = req.session.User;
    var id = await db.getprofile(username);
    var CartProductInfo = await db.addtocart(ID_product);
    var Link_product = CartProductInfo.Link_product;
    var Price_product = CartProductInfo.Price_product;
    await db.selectproduct(Link_product, ID_product, Price_product);
    var CartProduct = await db.cartproduct();
    var TypePro = req.params.TypePro;
    var BS = await db.classifyBS(TypePro);
    var NA = await db.classifyNA(TypePro);
    res.render("cart", { user: req.session.User, BS: BS, CartProduct: CartProduct, NA: NA, id: id });
});

app.post("/home", async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var id = await db.getprofile(username);

    var user = await db.checkLogin(username, password);
    if (!user) {
        notifier.notify({ title: "Login", message: "Wrong username or password" });
        return res.render("login", { user: req.session.User });
    }
    else {
        var role = await db.getrole(username, password);
        if (role == "admin") {
            req.session.User = username;
            db.getstudent(req, res, role);// render memeber
        }
        else {
            req.session.User = username;
            res.render("profile", { user: req.session.User, id: id, username: username });
        }
    }
});

app.get("/delete/:email", async function (req, res) {
    var email = req.params.email;
    db.deletestudent(email);
    db.getstudent(req, res);
});

app.get("/del/:ID_product", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    var ID_product = req.params.ID_product;
    db.deleteproduct(ID_product);
    if (username === undefined) {
        var CartProduct = await db.cartproductNoUser();
    }
    else {
        var student_id = await id.student_id;
        var CartProduct = await db.cartproduct(student_id);
    }
    res.render("cart", { user: req.session.User, CartProduct: CartProduct, id: id });
});

app.get("/CheckOut", async function (req, res) {
    var username = req.session.User;
    if (username === undefined) {
        await db.deleteCartNoUser();
    }
    else {
        var id = await db.getprofile(username);
        var student_id = await id.student_id;
        await db.deleteCart(student_id);
    }
    var ProductInfo = await db.getallproduct();
    res.render("product", { user: req.session.User, product: ProductInfo });
});

app.get("/update/:email", async function (req, res) {
    var email = req.params.email;
    var student = await db.selectstudent(email);
    res.render("update", student);
});

app.post("/update/update_successful", async function (req, res) {
    username = req.body.username;
    phone = req.body.phone;
    email = req.body.email;
    role = req.body.role;
    db.updatestudent(username, phone, email, role);
    db.getstudent(req, res);
    notifier.notify("Update successful");

});

app.get("/", async function (req, res, next) {
    var ProductInfo = await db.getallproduct();
    var TypePro = req.params.TypePro;
    var BS = await db.classifyBS(TypePro);
    var NA = await db.classifyNA(TypePro);
    res.render("home", { user: req.session.User, ProductInfo: ProductInfo, BS: BS, NA: NA });
});

app.get("/profile", async function (req, response, next) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    response.render("profile", { user: req.session.User, id: id });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

app.get("/momo", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    res.render("momo", { user: req.session.User, id: id });
});

app.get("/visa_checkout", async function (req, res) {
    var username = req.session.User;
    var id = await db.getprofile(username);
    res.render("visa_checkout", { user: req.session.User, id: id });
});

