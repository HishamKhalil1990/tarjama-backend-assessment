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
            const data = {
                name : name,
                email : email,
                password : password,
                last_login : new Date()
            }
            await create_record("user",data)
            res.json({msg : "user registered"})
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
app.post('/login',login) // login

db.sequelize.sync().then(() => {
    app.listen(port,() => {
        console.log(`app listening to port ${port}`)
    })
})