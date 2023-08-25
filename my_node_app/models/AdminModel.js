import { Schema, model } from 'mongoose'

const AdminSchema = Schema({
    first_name: {
        type: String,
        required: [true, "First name field is required"],
        minlength: 2,
        maxlength: 50,
    },
    last_name: {
        type: String,
        required: [true, "Last name field is required"],
        minlength: 4,
        maxlength: 50,
    },
    address: {
        type: String,
        required: [true, "Address field is required"],
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email field is required"],
        unique: true,
        validate: [validateEmail, 'Enter valid email please'],
    },
    password: {
        type: String,
        required: [true, "Password field is required"],
        minlength: 2,
        maxlength: 100,
    },
    role: {
        type: String,
        default: "Admin",
    },
    picture_personal_profile: {
        type: String,
        minlength: 2,
        maxlength: 100,
        default: null
    }
},
    {
        timestamps: true
    })

AdminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObject = admin.toObject();
    delete adminObject.password;
    return adminObject;
}

function validateEmail(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

const Admin = model("Admin", AdminSchema)
export default Admin
