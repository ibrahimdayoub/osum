import { Schema, model } from 'mongoose'

//To know how is try to confirm his account !?
const ConfirmSchema = Schema({
    code_value: {
        type: Number,
        required: [true, "Code value field is required"],
        minlength: 2,
        maxlength: 50,
    },
    user_role: {
        type: String,
        required: [true, "User role field is required"],
        enum: {
            values: ['Client', 'Developer', 'Delegate', 'Admin'],
            message: '{VALUE} is not supported'
        }
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: [true, "User ID field is required"],
    },
    user_email: {
        type: String,
        lowercase: true,
        required: [true, "Email field is required"],
        validate: [validateEmail, 'Enter valid email please'],
    },
},
    {
        timestamps: true
    })

function validateEmail(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

const Confirm = model("Confirm", ConfirmSchema)
export default Confirm