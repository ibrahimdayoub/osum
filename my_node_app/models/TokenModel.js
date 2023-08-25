import { Schema, model } from 'mongoose'

//To know how is logged in !?
const TokenSchema = Schema({
    token_value: {
        type: String,
        required: [true, "Token value field is required"],
        minlength: 2,
        maxlength: 200,
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
},
    {
        timestamps: true
    })

const Token = model("Token", TokenSchema)
export default Token