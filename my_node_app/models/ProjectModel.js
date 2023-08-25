import { Schema, model } from 'mongoose'

const ProjectSchema = Schema({
  project_name: {
    type: String,
    required: [true, "Project name field is required"],
    minlength: 2,
    maxlength: 50,
  },
  project_description: {
    type: String,
    required: [true, "Project description field is required"],
    minlength: 2,
    maxlength: 250,
  },
  is_personal: {
    type: Boolean,
    required: [true, "Is personal field is required"],
    default: true
  },
  is_training: {
    type: Boolean,
    required: [true, "Is training field is required"],
    default: true
  },
  creator_id: {
    type: Schema.Types.ObjectId,
    refPath: "creator_model",
    required: [true, "Creator id field is required"],
  },
  creator_model: {
    type: String,
    required: [true, "Creator model field is required"],
    enum: ['Developer', 'Delegate']
  },
  team_id: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  client_id: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  status: {
    type: String,
    required: [true, "Status field is required"],
    enum: {
      values: ['Started Project', 'Retreated Developers', 'Retreated Clients', 'Completed Project', 'Completed Payment'],
      message: '{VALUE} is not supported'
    },
    default: 'Started Project'
  },
  start_date: {
    type: Date,
    default: Date.now()
  },
  end_date: {
    type: Date,
    required: [true, "End date field is required"],
  },
  delay: {
    type: Number,
    min: 0,
    default: 0
  },
  total_coast: {
    type: Number,
    min: 0,
    default: 0
  },
  discount_per_day: {
    type: Number,
    min: 0,
    default: 0
  },
  github_link: {
    type: String,
    lowercase: true,
    required: [true, "Github link field is required"],
    validate: [validateGithub, 'Enter valid github link please'],
  },
  likes: [{
    type: Schema.Types.ObjectId,
  }],
},
  {
    timestamps: true
  })

function validateGithub(github) {
  const re = /https:\/\/github.com\/[a-z_0-9\-]+/;

  /*
      var name = "osum_"+this.first_name +"_"+ this.last_name
      var expression = `https:\/\/github\.com\/${name}`;
      var re = new RegExp(expression);
  */

  return re.test(github)
}

ProjectSchema.pre('save', async function (next) {
  let team_id = this.team_id;
  let client_id = this.client_id;
  if (team_id) {
    this.is_personal = false;
  }
  if (client_id) {
    this.is_training = false;
  }
 
  if (this.status === "Started Project"){
    let currentDate = new Date()
    if (currentDate - this.end_date > 0) {
      this.delay = Math.round((currentDate.getTime() - this.end_date.getTime()) / 1000 / 60 / 60 / 24)
    }
    this.total_coast = this.total_coast - (this.discount_per_day * this.delay)
    if (this.total_coast < 0) {
      this.total_coast = 0
    }
  }

  next()
})

const Project = model("Project", ProjectSchema)
export default Project

/*
valid options:
    is_training | y | y | n | n |
    _____________________________
    is_personal | n | y | n | y |
    _____________________________
    team_id     | y | n | y | n |
    _____________________________
    client_id   | n | n | y | y |
*/