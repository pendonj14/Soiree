import mongoose, { Schema } from "mongoose";

const reservationSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
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

        guestName: {
            type: String,
            required: true,
        },

        orderedItem:{
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'done'],
            default: 'pending',
        },
    },
    {
        timestamps: true
    }
);

export const Reservation = mongoose.model("Reservation", reservationSchema);