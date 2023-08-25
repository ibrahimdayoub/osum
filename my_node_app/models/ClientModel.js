import { Schema, model } from 'mongoose'

const ClientSchema = Schema({
    first_name: {
        type: String,
        required: [true, "First name field is required"],
        minlength: 2,
        maxlength: 50,
    },
    last_name: {
        type: String,
        required: [true, "Last name field is required"],
        minlength: 2,
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
        minlength: 4,
        maxlength: 100,
    },
    role: {
        type: String,
        default: "Client",
    },
    field_of_work: {
        type: String,
        required: [true, "Field of work field is required"],
        enum: {
            values: ['Programming', 'Designing', 'Content Writing', 'Translation'],
            message: '{VALUE} is not supported'
        }
    },
    views_personal_profile: {
        type: Number,
        default: 0,
        min: 0,
    },
    rate_personal_profile: [{
        rater_id: {
            type: Schema.Types.ObjectId,
            required: [true, "Rater id field is required"],
            refPath: 'rater_model',
        },
        rater_model: {
            type: String,
            required: [true, "Rater model field is required"],
            enum: {
                values: ['Client', 'Developer', 'Delegate'],
                message: '{VALUE} is not supported'
            }
        },
        rate: {
            type: Number,
            required: [true, "Rate field is required"],
            min: 0,
            max: 7
        },
    }],
    picture_personal_profile: {
        type: String,
        minlength: 2,
        maxlength: 100,
        default: null
    },
    end_block_date: {
        type: Date,
        default: null
    }
},
    {
        timestamps: true
    })

ClientSchema.methods.toJSON = function () {
    const client = this;
    const clientObject = client.toObject();
    delete clientObject.password;
    return clientObject;
}

function validateEmail(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

const Client = model("Client", ClientSchema)
export default Client