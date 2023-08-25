import { Schema, model } from 'mongoose'

const FavouriteSchema = Schema({
    prefered: {
        type: Schema.Types.ObjectId,
        required: [true, "Prefered field is required"],
    },
    prefered_role: {
        type: String,
        required: [true, "Prefered role field is required"],
        enum: {
            values: ['Customer', 'Worker', 'Delegate'],
            message: '{VALUE} is not supported'
        }
    },
    favourite: {
        type: Schema.Types.ObjectId,
        required: [true, "Favourits field is required"],
    },
    favourite_role: {
        type: String,
        required: [true, "Favourite role field is required"],
        enum: {
            values: ['Customer', 'Worker', 'Delegate'],
            message: '{VALUE} is not supported'
        }
    },
    are_friends: {
        type: Boolean,
        required: [true, "Are friends field is required"],
    }
},
    {
        timestamps: true
    })

const Favourite = model("Favourite", FavouriteSchema)
export default Favourite