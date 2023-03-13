const CaptureSchema = [
    {
        name: "date",
        type: "date",
        system: false,
        required: true,
        unique: true,
        options: {
            min: "",
            max: "",
        },
    },
    {
        name: "capture_count",
        type: "number",
        system: false,
        required: true,
        unique: false,
        options: {
            min: null,
            max: null,
        },
    },
];

const DetectionSchema = (collectionId: string) => {
    const arr = [
        {
            name: "detection_date",
            type: "date",
            system: false,
            required: true,
            unique: true,
            options: {
                min: "",
                max: "",
            },
        },
        {
            name: "prediction",
            type: "text",
            system: false,
            required: true,
            unique: false,
            options: {
                min: null,
                max: null,
                pattern: "",
            },
        },
        {
            name: "image_location",
            type: "text",
            system: false,
            required: true,
            unique: false,
            options: {
                min: null,
                max: null,
                pattern: "",
            },
        },
        {
            name: "capture",
            type: "relation",
            system: false,
            required: true,
            unique: false,
            options: {
                maxSelect: 1,
                collectionId: collectionId,
                cascadeDelete: false,
            },
        },
    ];

    return arr;
};

const ContactSchema = [
    {
        name: "name",
        type: "text",
        system: false,
        required: true,
        unique: true,
        options: {
            min: null,
            max: null,
            pattern: "",
        },
    },
    {
        name: "user_id",
        type: "number",
        system: false,
        required: true,
        unique: true,
        options: {
            min: null,
            max: null,
            pattern: "",
        },
    },
];

export { CaptureSchema, DetectionSchema, ContactSchema };
