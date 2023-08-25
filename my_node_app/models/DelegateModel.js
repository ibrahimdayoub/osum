import { Schema, model } from 'mongoose'

const DelegateSchema = Schema({
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
    github_link: {
        type: String,
        lowercase: true,
        required: [true, "Github link field is required"],
        validate: [validateGithub, 'Enter valid github link please'],
    },
    password: {
        type: String,
        required: [true, "Password field is required"],
        minlength: 4,
        maxlength: 100,
    },
    role: {
        type: String,
        default: "Delegate",
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
    },
    company_id: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        default: null
    },
},
    {
        timestamps: true
    })

DelegateSchema.methods.toJSON = function () {
    const delegate = this;
    const delegateObject = delegate.toObject();
    delete delegateObject.password;
    return delegateObject;
}

function validateEmail(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

function validateGithub(github) {
    const re = /https:\/\/github.com\/[a-z_0-9\-]+/;

    /*
        var name = "osum_"+this.first_name +"_"+ this.last_name
        var expression = `https:\/\/github\.com\/${name}`;
        var re = new RegExp(expression);
    */

    return re.test(github)
}

const Delegate = model("Delegate", DelegateSchema)
export default Delegate