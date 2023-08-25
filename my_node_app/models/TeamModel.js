import { Schema, model } from 'mongoose'
import Developer from './DeveloperModel.js'

const TeamSchema = Schema({
    team_name: {
        type: String,
        required: [true, "Team name field is required"],
        minlength: 2,
        maxlength: 50,
    },
    team_description: {
        type: String,
        required: [true, "Team description field is required"],
        minlength: 2,
        maxlength: 250,
    },
    members_ids: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Developer',
        }
    ],
    leader_id: {
        type: Schema.Types.ObjectId,
        refPath: "leader_model",
        required: [true, "Leader id field is required"],
    },
    leader_model: {
        type: String,
        required: [true, "Leader model field is required"],
        enum: ['Developer', 'Delegate']
    },
    team_rate: {
        type: Number,
        min: 0,
        max: 7
    },
    field_of_work: {
        type: String,
        required: [true, "Field of work field is required"],
        enum: {
            values: ['Programming', 'Designing', 'Content Writing', 'Translation'],
            message: '{VALUE} is not supported'
        }
    },
    team_picture: {
        type: String,
        minlength: 2,
        maxlength: 100,
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

TeamSchema.pre('save', async function (next) {
    let members_ids = this.members_ids;
    if (members_ids.length > 0) {
        let sum = 0;
        for (let i = 0; i < members_ids.length; i++) {
            let member = await Developer.findById(members_ids[i])
            for (let j = 0; j < member.rate_personal_profile.length; j++) {
                if (member.rate_personal_profile[j]) {
                    sum += member.rate_personal_profile[j].rate
                }
            }
        }
        this.team_rate = Math.ceil(sum / members_ids.length)
        next()
    }
    else {
        this.team_rate = 0
        next()
    }
})

const Team = model("Team", TeamSchema)
export default Team
