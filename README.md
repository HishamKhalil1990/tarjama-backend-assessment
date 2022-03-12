# APIs

### to create new user ---> URL : (/reg) && body : { name : string , email : string , password : string}

### to login ---> URL : (/login) && body : { email : string , password : string }

### to create category ---> (/create-category) && body : { name : string , user_id : number }

### to edit category ---> (/edit-category) && body : { name : string , user_id : number, new_name : string }

### to get category info ---> (/get-category) && body : { name : string , user_id : number }

### to get all categories info ---> (/list-category) && body : { user_id : number }
