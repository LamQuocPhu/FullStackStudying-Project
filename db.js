const { render } = require("ejs");
const mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "lamPhu25@",
    database: "StudentManagement"
});

let db = {};

db.checkLogin = (username, password) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM student WHERE student_name = ? AND password = ?", [username, password], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result[0]);
        });
    });

};

db.insertData = (username, password, phone, email, address) => {
    return new Promise((resolve, reject) => {
        con.query("INSERT INTO student (student_name, password, phone, email, address) VALUES (?,?,?,?,?)", [username, password, phone, email, address], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result[0]);
        });
    });
};


db.resetPassword = (password, email) => {
    return new Promise((resolve, reject) => {
        con.query("UPDATE student SET password = ? WHERE email = ?", [password, email], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result[0]);
        })
    });

};

db.checkMail = (email) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM student WHERE email = ? ", [email], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result[0]);
        });
    });

};

db.getrole = (username, password) => {
    return new Promise((resolve, reject) => {
        var sql = "SELECT role FROM StudentManagement.student WHERE student_name = ? AND password = ?";
        con.query(sql, [username, password], (err, user) => {
            if (err) {
                return reject(err);
            }
            return resolve(user[0].role);
        });
    });
};

//members
db.getstudent = (req, res, role) => {
    var sql = "SELECT * FROM StudentManagement.student ORDER BY student_id";
    con.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render("member", {studentlist: data, user: req.session.User, rolename: role });
    });
}

//getstudent use for search members page
db.getstudentMember = (req, res, role) => {
    var sql = "SELECT * FROM StudentManagement.student ORDER BY student_id";
    con.query(sql, function (err, data, fields) {
        if (err) throw err;
        return;
    });
}

db.getprofile = (username) => {
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM StudentManagement.student WHERE student_name = ?";
        con.query(sql, [username], (err, user) => {
            if (err) {
                return reject(err);
            }
            return resolve(user[0]);
        });
    });
};

db.getallproduct = () => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Product", (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.getdetail = (ID_product) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Product WHERE ID_product = ?", [ID_product], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result[0]);
        });
    });
};

db.addtocart = (ID_product) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT Name_product, Link_product, Quantity_product, Price_product, Category FROM ShopManagement.Product WHERE ID_product = ? ",
            [ID_product], (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result[0]);
            });
    });
}



db.selectproduct = (Link_product, ID_product, Price_product, student_id) => {
    return new Promise((resolve, reject) => {
        con.query("INSERT INTO ShopManagement.Cart (Link_product, ID_product,Price_product, Quantity_cart,student_id) VALUES (?,?,?,1,?)", [Link_product, ID_product, Price_product, student_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result[0]);
        })
    });
}

db.selectproductNoUser = (Link_product, ID_product, Price_product) => {
    return new Promise((resolve, reject) => {
        con.query("INSERT INTO ShopManagement.Cart (Link_product, ID_product,Price_product, Quantity_cart) VALUES (?,?,?,1)", [Link_product, ID_product, Price_product], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result[0]);
        })
    });
}

db.classifyP = (Category) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Product WHERE Category = 'P'", [Category], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.classifyTs = (Category) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Product WHERE Category = 'Ts'", [Category], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.classifyS = (Category) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Product WHERE Category = 'S'", [Category], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.classifyHd = (Category) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Product WHERE Category = 'Hd'", [Category], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.classifyBS = (TypePro) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Product WHERE TypePro = 'BS'", [TypePro], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.classifyNA = (TypePro) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Product WHERE TypePro = 'NA'", [TypePro], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

db.cartproduct = (student_id) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Cart WHERE student_id = ?", [student_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}

db.cartproductNoUser = () => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Cart", (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}

db.cartproductNoUser = () => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Cart", (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}

// search products
// db.search = (searchValues) => {
//     return new Promise ((resolve, reject) => {
//         con.query("SELECT * FROM ShopManagement.Product WHERE Name_product = ? ", [searchValues], (err, res) => {
//         if (err) {
//             return reject(err);
//         }
//         return resolve(res);
//     });
// });
// }
db.search = (searchValues) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM ShopManagement.Product WHERE Name_product LIKE ?", ['%' + searchValues + '%'], (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });
}

// search members
db.searchMember = (searchValues) => {
    return new Promise ((resolve, reject) => {
        con.query("SELECT * FROM StudentManagement.student WHERE student_name LIKE ?", ['%' + searchValues + '%'], (err, res) => {
        if (err) {
            return reject(err);
        }
        return resolve(res);
    });
});
}

db.deleteproduct = (ID_product) => {
    var sql = "DELETE FROM ShopManagement.Cart WHERE ID_product = '" + ID_product + "'";
    con.query(sql, function (err, data, fields) {
        if (err) throw err;
    });
}

db.updateQuantity = (ID_product, Quantity_cart) => {
    var sql = "UPDATE ShopManagement.Cart SET Quantity_cart = ? WHERE ID_product = '" + ID_product + "'";
    con.query(sql, function (err, data, fields) {
        if (err) throw err;
    });
}

db.deleteCart = (student_id) => {
    return new Promise((resolve, reject) => {
        con.query("DELETE FROM ShopManagement.Cart WHERE student_id = ?", [student_id], (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });

    });
}

db.deleteCartNoUser = () => {
    return new Promise((resolve, reject) => {
        con.query("DELETE FROM ShopManagement.Cart", (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });
}

db.deletestudent = (email) => {
    var sql = "DELETE FROM StudentManagement.student WHERE email = '" + email + "'";
    con.query(sql, function (err, data, fields) {
        if (err) throw err;
    });
}

db.selectstudent = (email) => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM StudentManagement.student WHERE email = ? ", [email], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result[0]);
        });
    });

};

db.updatestudent = (username, phone, email) => {
    var sql = "UPDATE StudentManagement.student SET role = '" + role + "', phone = '" + phone + "', student_name = '" + username + "' WHERE email = '" + email + "'";
    con.query(sql, function (err, data, fields) {
        if (err) throw err;
    });
};

db.getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM StudentManagement.student WHERE username = ? AND role != 'not approved'", [username], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};



module.exports = db;