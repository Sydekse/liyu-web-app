import mongoose, { Schema, mongo, model, models } from "mongoose";

const AdminSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export interface IAdmin {
  _id: string;
  userName: string;
  password: string;
}
const Admin = models.Admin || model("Admin", AdminSchema);

export default Admin;
