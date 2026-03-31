import { Reservation } from "../models/reservation.model.js";

const createReservation = async (req, res) => {
    try {
        const {username, email, reservationDate, reservationTime, numberOfGuests, orderedItem} = req.body;
        
        //basic validation
        if (!username || !email || !reservationDate || !reservationTime || !numberOfGuests || !orderedItem) {
            return res.status(400).json({message: "All fields are required"});
        }

        //create new reservation
        const reservation  = await  Reservation.create({
            username,
            email,
            reservationDate,
            reservationTime,
            numberOfGuests,
            orderedItem
        });
        res.status(201).json({message: "Reservation created successfully", reservation});

    } catch (error) {
        res.status(500).json({message: "Error creating reservation", error});
    }
}

export { createReservation };