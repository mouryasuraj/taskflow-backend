import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
},
    {
        timestamps: true
    }
)

userSchema.methods.isPasswordValid = async function (plainPassword) {
    const isPasswordValid = await bcrypt.compare(plainPassword, this.password)
    return isPasswordValid
}


export const User = mongoose.model("User", userSchema)

