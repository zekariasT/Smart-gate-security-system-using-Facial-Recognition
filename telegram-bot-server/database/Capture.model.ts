import { Schema, model } from "mongoose";
import { Types } from "mongoose";

type Detection = {
    prediction: string;
    img_location: string;
    detection_time: number;
};

// 1. Create an interface representing a document in MongoDB.
interface ICapture {
    device_id: string;
    start_date: string;
    end_date: string;
    detections: Array<Detection>;
}

// 2. Create a Schema corresponding to the document interface.
const captureSchema = new Schema<ICapture>({
    device_id: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    detections: Array<Detection>,
});

// 3. Create a Model.
const Capture = model<ICapture>("Capture", captureSchema);

export { Capture };
