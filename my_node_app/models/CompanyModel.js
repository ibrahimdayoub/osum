import { Schema, model } from 'mongoose'

const CompanySchema = Schema({
    company_name: {
        type: String,
        required: [true, "Company name field is required"],
        minlength: 2,
        maxlength: 100,
    },
    company_description: {
        type: String,
        required: [true, "Company description field is required"],
        minlength: 2,
        maxlength: 250,
    },
    delegate_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Delegate id field is required"],
        ref: 'Delegate',
    },
    location: {
        type: String,
        required: [true, "Company location field is required"],
        minlength: 2,
        maxlength: 100,
    },
    field_of_work: {
        type: String,
        required: [true, "Field of work field is required"],
        enum: {
            values: ['Programming', 'Designing', 'Content Writing', 'Translation'],
            message: '{VALUE} is not supported'
        }
    },
    likes: [{
        type: Schema.Types.ObjectId,
    }],
},
    {
        timestamps: true
    })

const Company = model("Company", CompanySchema)
export default Company