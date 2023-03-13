type IContact = {
    id?: string;
    name?: string;
    user_id?: number;
};
type IDetection = {
    id?: string;
    prediction?: string;
    image_location?: string;
    detection_date?: number;
    capture?: string;
};

type ICapture = {
    id: string;
    date: string;
    capture_count: number;
};

type IListRequest = {
    pagination?: { page: number; perPage: number };
    sort?: { field: string; order: string };
    range?: Array<number>;
    filter?: Object;
    meta?: Object;
};

type Response = {
    message?: string;
    error?: string;
};
export type { IContact, IDetection, ICapture, IListRequest };
