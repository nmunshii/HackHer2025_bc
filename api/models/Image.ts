import { Schema, model, Document } from "mongoose";

export interface IImage extends Document {
  data: Buffer;
  contentType: string;
  name: string;
  width: number;
  height: number;
  hash: string;
}

const ImageSchema: Schema = new Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    name: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    hash: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IImage>("Image", ImageSchema); 