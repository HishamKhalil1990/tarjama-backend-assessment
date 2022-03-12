# APIs

### to create new user ---> URL : (`http://localhost:3000/reg`) && body : `{ name : string , email : string , password : string}`

### to login ---> URL : (`http://localhost:3000/login`) && body : `{ email : string , password : string }`

### to create category ---> URL : (`http://localhost:3000/create-category`) && body : `{ name : string , user_id : number }`

### to edit category ---> URL : (`http://localhost:3000/edit-category`) && body : `{ name : string , user_id : number, new_name : string }`

### to get category info ---> URL : (`http://localhost:3000/get-category`) && body : `{ name : string , user_id : number }`

### to get all categories info ---> URL : (`http://localhost:3000/list-category`) && body : `{ user_id : number }`
