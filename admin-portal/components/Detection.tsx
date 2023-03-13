// in src/posts.js
import * as React from "react";
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    RichTextField,
    ArrayField,
    List,
    Datagrid,
    ImageField,
    BooleanField,
    FieldsSelector,
    useRecordContext,
    useGetOne,
    RaRecord,
    UseRecordContextParams,
} from "react-admin";

//Image field to show detection image 
const ImageFieldV2 = (props: UseRecordContextParams<RaRecord> | undefined) => {
    const record = useRecordContext(props);
    const image_location = "http://127.0.0.1:5000/" + record.image_location;
    console.log(image_location);
    return record ? (
        <div>
            <img
                src={image_location}
                title="detection"
                alt={"loading"}
                width="300"
                height="300"
            />
        </div>
    ) : null;
};

const DetectionList = () => (
    <List>
        <Datagrid rowClick="show">
            <DateField source="detection_date" className="font-bold text-lg" />
            <TextField source="image_location" />
            <TextField source="prediction" />
        </Datagrid>
    </List>
);

const DetectionShow = () => (
    <Show>
        <SimpleShowLayout>
            <ImageFieldV2 />
            <TextField className="font-bold text-lg" source="image_location" />
            <TextField source="prediction" />
            <DateField source="detection_date" />
        </SimpleShowLayout>
    </Show>
);

export { DetectionShow, DetectionList };
