// import mongoose from "mongoose";

// const AppointmentSchema=new mongoose.Schema({
//     serviceUser:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         required:true
//     },
//     serviceProvider:{
//         type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//         requestType: {
//       type: String,
//       required: true
//     },
//         status: {
//       type: String,
//       enum: ["new", "pending", "cancelled", "completed"],
//       default: "new"
//     },
//         isUrgent: {
//       type: Boolean,
//       default: false
//     },
//       appointmentDate: {
//       type: Date
//     },
//     appointmentTime: {
//   type: String,
//   default: null
// },
 
// },{ timestamps: true })


// const Appointment=mongoose.model("Appointment",AppointmentSchema)
// export {Appointment}





import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    serviceUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    requestType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["new", "pending", "cancelled", "completed"],
      default: "new",
    },

    isUrgent: {
      type: Boolean,
      default: false,
    },

    appointmentDate: {
      type: Date,
    },

    appointmentTime: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", AppointmentSchema);