import { connect } from "mongoose"

const connectDB = async () => {
    try {
        const conn = connect(process.env.MONGO_URI)
        console.log(`==> MongoDB Connected Successfully With URI ${process.env.MONGO_URI}...`.yellow.underline)
    }
    catch (error) {
        console.log(`${error}`.red.underline)
        process.exit(1)
    }
}

export default connectDB