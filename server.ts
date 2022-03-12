import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './models'
import { users } from './seeders/users';
import { categories } from './seeders/categories';
import { expenses } from './seeders/expenses';

const port = process.env.PORT || 3000
const env = process.env.NODE_ENV || "development";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// functions
// seed --- function
const seedTables = () => {
    users.map(user => {
        create_record("user",user);
    })
    categories.map(category => {
        create_record("category",category);
    })
    expenses.map(expenses => {
        create_record("expenses",expenses);
    })
}
// register --- function
const register = async (req: any, res: any) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password){
            res.status(400).json({ msg: "Please enter all fields" });
        }else{
            db.User.findOne({
                where : {email : email}
            }).then((user: any) => {
                if (!user){
                    const data = {
                        name : name,
                        email : email,
                        password : password,
                        last_login : new Date()
                    }
                    create_record("user",data)
                    res.json({msg : "user registered"})
                }else{
                    res.json({msg : "user already exist"})
                }
            })
        }
    }catch(err){
        res.json("Error: " + err);
    }
}
// login --- function
const login = (req: any, res: any) => {
    try{
        const { email, password } = req.body
        if (!email || !password){
            res.status(400).json({ msg: "Please enter all fields" });
        }else{
            db.User.findOne({
                where : {
                    email : email,
                    password : password
                }
            }).then((user: any) => {
                if (!user){
                    res.json({msg : "user not found"})
                }else{
                    user.update(
                        {
                            last_login : new Date()
                        },
                    )
                    res.json({msg : "user found", user})
                }
            })
        }
    }catch(err){
        res.json("Error: " + err);
    }
}
// create category --- function
const create_category = async (req: any, res: any) => {
    try {
        const { name, user_id } = req.body
        if (!name || !user_id){
            res.status(400).json({ msg: "Please enter all fields" });
        }else{
            const user_is_exist = await db.User.findOne({
                where : {id : user_id}
            });
            if (!user_is_exist){
                res.json({msg : "user not found"})
            }else{
                const category_is_exist = await db.Category.findOne({
                    where : {
                        user_id : user_id,
                        name : name
                    }
                });
                if (!category_is_exist){
                    const data = {
                        user_id : user_id,
                        name : name
                    }
                    await create_record("category",data)
                    res.json({msg : "category created"})
                }else{
                    res.json({msg : "category already exist"})
                }
            }
        }
    }catch(err){
        res.json("Error: " + err);
    }
}
// edit category --- function
const edit_category = async (req: any, res: any) => {
    try{
        const { name, user_id, new_name } = req.body
        if (!name || !user_id || !new_name){
            res.status(400).json({ msg: "Please enter all fields" });
        }else{
            db.Category.findOne({
                where : {
                    name : name,
                    user_id : user_id
                }
            }).then((category: any) => {
                if (!category){
                    res.json({msg : "category not found"})
                }else{
                    category.update(
                        {
                            name : new_name
                        },
                    )
                    res.json({msg : "category found", category})
                }
            })
        }
    }catch(err){
        res.json("Error: " + err);
    }
}
// get category --- function
const get_category = async (req: any, res: any) => {
    try{
        const { name, user_id } = req.body
        if (!name || !user_id){
            res.status(400).json({ msg: "Please enter all fields" });
        }else{
            db.Category.findOne({
                where : {
                    name : name,
                    user_id : user_id
                }
            }).then((category: any) => {
                if (!category){
                    res.json({msg : "category not found"})
                }else{
                    res.json({msg : "category found", category})
                }
            })
        }
    }catch(err){
        res.json("Error: " + err);
    }
}
// list categories --- function
const list_category = async (req: any, res: any) => {
    try{
        const { user_id } = req.body
        if (!user_id){
            res.status(400).json({ msg: "Please enter all fields" });
        }else{
            db.Category.findAll({
                where : {
                    user_id : user_id
                }
            }).then((categories: any) => {
                if (categories.length === 0){
                    res.json({msg : "categories not found"})
                }else{
                    res.json({msg : "categories found", categories})
                }
            })
        }
    }catch(err){
        res.json("Error: " + err);
    }
}
// create record --- function
const create_record = async (record_type : string , data : any) => {
    switch (record_type) {
        case "user":
            db.User.create(data).then((user: any) => {
                console.log(user.get())
            })
            break;
        case "category":
            db.Category.create(data).then((category: any) => {
                console.log(category.get())
            })
            break;
        case "expenses":
            db.Expenses.create(data).then((expenses: any) => {
                console.log(expenses.get())
            })
            break;
        default :
            break;
    }
}

if(env === "development"){
    const sync = async () => {
        const user_data = await db.User.findAll()
        if(user_data.length === 0){
            seedTables()
        }else{
            console.log("Database has been seeded")
        }
    }
    sync()
}

// Middlewares
app.post('/reg',register) // register
app.put('/login',login) // login
app.post('/create-category',create_category) // create category
app.put('/edit-category',edit_category) // edit category
app.get('/get-category',get_category) // get category
app.get('/list-category',list_category) // list category

db.sequelize.sync().then(() => {
    app.listen(port,() => {
        console.log(`app listening to port ${port}`)
    })
})