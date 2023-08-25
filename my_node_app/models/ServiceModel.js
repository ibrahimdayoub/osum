import { Schema, model } from 'mongoose'

const ServiceSchema = Schema({
    provider_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Provider id field is required"],
        refPath: 'provider_model',
    },
    provider_model: {
        type: String,
        required: [true, "Provider model field is required"],
        enum: {
            values: ['Developer', 'Delegate'],
            message: '{VALUE} is not supported'
        }
    },
    service_name: {
        type: String,
        minlength: 2,
        maxlength: 100,
        required: [true, "Title field is required"],
    },
    service_description: {
        type: String,
        minlength: 2,
        maxlength: 500,
        required: [true, "Content field is required"],
    },
    expected_coast: {
        type: Number,
        min: 0,
        required: [true, "Total coast field is required"],
    },
    expected_duration: {
        type: Number,
        min: 0,
        required: [true, "Expected duration field is required"],
    },
    service_experiences: [{
        type: String,
        minlength: 2,
        maxlength: 255
    }],
    experiences_links: [{
        type: String,
        minlength: 2,
        maxlength: 255
    }],
    likes: [{
        type: Schema.Types.ObjectId,
    }],
},
    {
        timestamps: true
    })

const Service = model("Service", ServiceSchema)
export default Service 