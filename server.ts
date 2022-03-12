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
                    categories = categories.map((category: any) => { return category.name })
                    res.json({msg : "categories found", categories})
                }
            })
        }
    }catch(err){
        res.json("Error: " + err);
    }
}
// create expense --- function
const create_expenses = async (req: any, res: any) => {
    try{
        const { name, amount, user_id, spending_date } = req.body
        if (!name || !amount || !user_id || !spending_date){
            res.status(400).json({ msg: "Please enter all fields" });
        }else{
            const user_is_exist = await db.User.findOne({
                where : {id : user_id}
            });
            if (!user_is_exist){
                res.json({msg : "user not found"})
            }else{
                const category = await db.Category.findOne({
                    where : {
                        name : name, 
                        user_id : user_id
                    }
                });
                if (!category){
                    res.json({msg : "category not found"})
                }else{
                    db.Expenses.findOne({
                        where : {
                            user_id : user_id,
                            category_id : category.id,
                        }
                    }).then((expense: any) => {
                        if(!expense){
                            const data = {
                                user_id : user_id,
                                category_id : category.id,
                                spending_date : spending_date,
                                amount : amount,
                            }
                            create_record("expenses",data)
                            res.json({msg : "expense created"})
                        }else{
                            res.json({msg : "expense already exist"})
                        }
                    })
                }
            }
        }
    }catch(err){
        res.json("Error: " + err);
    }
}
// edit expense --- function
const edit_expenses = async (req: any, res: any) => {
    try{
        const { name, new_amount, user_id, new_spending_date, new_name } = req.body
        if (!name || !new_amount || !user_id || !new_spending_date || !new_name){
            res.status(400).json({ msg: "Please enter all fields" });
        }else{
            const user_is_exist = await db.User.findOne({
                where : {id : user_id}
            });
            if (!user_is_exist){
                res.json({msg : "user not found"})
            }else{
                const old_category = await db.Category.findOne({
                    where : {
                        name : name, 
                        user_id : user_id
                    }
                });
                const new_category = await db.Category.findOne({
                    where : {
                        name : new_name, 
                        user_id : user_id
                    }
                });
                if (!old_category || !new_category){
                    res.json({msg : "category not found"})
                }else{
                    db.Expenses.findOne({
                        where : {
                            user_id : user_id,
                            category_id : old_category.id,
                        }
                    }).then((expense: any) => {
                        if(!expense){
                            res.json({msg : "expense not found"})
                        }else{
                            expense.update(
                                {
                                    category_id : new_category.id,
                                    amount : new_amount,
                                    spending_date : new_spending_date,
                                },
                            )
                            res.json({msg : "expense found", expense})
                        }
                    })
                }
            }
        }
    }catch(err){
        res.json("Error: " + err);
    }
}
// delete expense --- function
const delete_expenses = async (req: any, res: any) => {
    try{
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
                const category = await db.Category.findOne({
                    where : {
                        name : name, 
                        user_id : user_id
                    }
                });
                if (!category){
                    res.json({msg : "category not found"})
                }else{
                    db.Expenses.findOne({
                        where : {
                            user_id : user_id,
                            category_id : category.id,
                        }
                    }).then((expense: any) => {
                        if(!expense){
                            res.json({msg : "expense not found"})
                        }else{
                            expense.destroy()
                            res.json({msg : "expense deleted"})
                        }
                    })
                }
            }
        }
    }catch(err){
        res.json("Error: " + err);
    }
}
// list expenses --- function
const list_expenses = async (req: any, res: any) => {
    try{
        const { user_id } = req.body
        if (!user_id){
            res.status(400).json({ msg: "Please enter all fields" });
        }else{
            let filtered_categories: any = []
            const user = await db.User.findOne({
                where : {id : user_id}
            });
            const categories = await db.Category.findAll({
                where : {user_id : user_id}
            })
            categories.forEach((category: any) => {
                filtered_categories[category.id] = (category.name)
            });
            await db.Expenses.findAll({
                where : {
                    user_id : user_id
                }
            }).then((expenses: any) => {
                if (expenses.length === 0){
                    res.json({msg : "expenses not found"})
                }else{
                    expenses = expenses.map((expense: any) => { 
                        return `the ${user.name} spent ${expense.amount} JOD on ${expense.spending_date} , as a ${filtered_categories[expense.category_id]} purchase` 
                    })
                    res.json({msg : "expenses found", expenses})
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
app.post('/create-expenses',create_expenses) // create expenses
app.put('/edit-expenses',edit_expenses) // edit expenses
app.delete('/delete-expenses',delete_expenses) // delete expenses
app.get('/list-expenses',list_expenses) // list expenses

db.sequelize.sync().then(() => {
    app.listen(port,() => {
        console.log(`app listening to port ${port}`)
    })
})