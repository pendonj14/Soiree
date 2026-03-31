import mongoose, { Schema } from "mongoose";

const reservationSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLenght: 1,
            maxLenght: 50
        },
        
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        reservationDate: {
            type: Date,
            required: true,
        },

        reservationTime: {
            type: String,
            required: true,
        },

        numberOfGuests: {
            type: Number,
            required: true,
        },

        orderedItem:{
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export const Reservation = mongoose.model("Reservation", reservationSchema);