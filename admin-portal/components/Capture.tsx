// in src/posts.js
import * as React from "react";
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    List,
    Datagrid,
    useRecordContext,
    useGetOne,
    useGetMany,
    ArrayField,
    useGetList,
} from "react-admin";
import Typography from "@mui/material/Typography";
import { IDetection, ICapture } from "../constants/types";

import { Link } from "react-router-dom";

const DetectionsField = () => {
    const record = useRecordContext();

    const { data, isLoading } = useGetList("detection", {
        filter: { capture: record.id },
    });

    //If still loading...
    if (isLoading) return <h1>Loading...</h1>;
    else {

        //Mini detection view in capture component
        const DetectionMini = ({ item }: { item: IDetection }) => {
            const detectionShowPage = `/detection/${item.id}/show`;

            const date = item.detection_date;
            let prediction = item.prediction;

            //Get contact if the person is identified
            const {
                data: contacts,
                isLoading,
                error,
            } = useGetList("contact", {
                filter: { user_id: Number(prediction) },
            });

            const image_location =
                "http://127.0.0.1:5000/" + item.image_location;

            if (!isLoading && contacts && contacts?.length > 0) {
                prediction = contacts[0].name;
                return (
                    <div className="py-2 text-blue-700 " key={item.id}>
                        <Link
                            key={item.id}
                            to={detectionShowPage}
                            className="font-thin py-24"
                        >
                            <img
                                src={image_location}
                                title="detection"
                                alt={"loading"}
                                width="300"
                                height="300"
                            />
                        </Link>
                        <h2 className="text-black">Date: {date}</h2>
                        <Link
                            key={contacts[0].id}
                            to={`/contact/${contacts[0].id}/show`}
                            className="font-thin py-24"
                        >
                            <h2>Prediction: {prediction}</h2>
                        </Link>
                    </div>
                );
            }

            return (
                <div className="py-2 text-blue-700 " key={item.id}>
                    <Link
                        key={item.id}
                        to={detectionShowPage}
                        className="font-thin py-24"
                    >
                        <img
                            src={image_location}
                            title="detection"
                            alt={"loading"}
                            width="300"
                            height="300"
                        />
                        <h2>Date: {date}</h2>
                        <h2>Prediction: {prediction}</h2>
                    </Link>
                </div>
            );
        };
        const detectionFields = data?.map((item) => (
            <DetectionMini item={item} />
        ));

        if (detectionFields) {
            return (
                <>
                    <h1 className="font-bold text-lg">
                        Detections on {record.date.split(" ")[0]}
                    </h1>
                    <div className="grid grid-rows-4 grid-cols-4 gap-4">
                        {detectionFields}
                    </div>
                </>
            );
        } else return <h1>No Detections</h1>;
    }
};

const DetectionCount = (props: any) => {
    const record = useRecordContext<ICapture>();

    return (
        <Typography component="span" variant="body2" {...props}>
            {record.capture_count}
        </Typography>
    );
};

//List of captures
const CaptureList = () => (
    <List>
        <Datagrid rowClick="show">
            <DateField label="Capture Date" source="date" />
            <DetectionCount label="Detection Count" />
            <TextField source="id" />
        </Datagrid>
    </List>
);

//Individual capture component
const CaptureShow = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <DateField source="date" />
                <DetectionsField />
            </SimpleShowLayout>
        </Show>
    );
};

export { CaptureShow, CaptureList };
