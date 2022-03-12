# APIs

### to create new user ---> URL : (`http://localhost:3000/reg`) && body : `{ name : string , email : string , password : string}`

### to login ---> URL : (`http://localhost:3000/login`) && body : `{ email : string , password : string }`

### to create category ---> URL : (`http://localhost:3000/create-category`) && body : `{ name : string , user_id : number }`

### to edit category ---> URL : (`http://localhost:3000/edit-category`) && body : `{ name : string , user_id : number, new_name : string }`

### to get category info ---> URL : (`http://localhost:3000/get-category`) && body : `{ name : string , user_id : number }`

### to get all categories info ---> URL : (`http://localhost:3000/list-category`) && body : `{ user_id : number }`

### to create expenses ---> URL : (`http://localhost:3000/create-expenses`) && body : `{ name : string , amount : number , user_id : number , spending_date : string }`

### to edit expenses ---> URL : (`http://localhost:3000/edit-expenses`) && body : `{ name : string , new_amount : old amount || new number , user_id : number , new_spending_date : old spending_date || new string , new_name : old name || new string }`

### to delete expenses ---> URL : (`http://localhost:3000/delete-expenses`) && body : `{ name : string , user_id : number }`

### to get all expenses ---> URL : (`http://localhost:3000/list-expenses`) && body : `{ user_id : number }`
