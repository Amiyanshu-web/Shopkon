import bcrypt from 'bcryptjs';
const users=[
    {
        name:'admin',
        email:'admin@shopkon.com',
        password:bcrypt.hashSync('123456',10),
        isAdmin:true
    },
    {
        name:'User',
        email:'user@shopkon.com',
        password:bcrypt.hashSync('123456',10),

    },{
        name:'Raja',
        email:'raja@shopkon.com',
        password:bcrypt.hashSync('123456',10),

    },    
]

export default users;