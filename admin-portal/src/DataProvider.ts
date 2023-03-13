import {
    CreateParams,
    CreateResult,
    DataProvider,
    DeleteManyParams,
    DeleteManyResult,
    DeleteParams,
    DeleteResult,
    GetListParams,
    GetListResult,
    GetManyParams,
    GetManyReferenceParams,
    GetManyReferenceResult,
    GetManyResult,
    GetOneParams,
    GetOneResult,
    RaRecord,
    UpdateManyParams,
    UpdateManyResult,
    UpdateParams,
    UpdateResult,
} from "react-admin";
import { PB, loginPB } from "../database/pocketbase";
import { fetchUtils } from "react-admin";

const apiUrl = "/api";

const httpClient = fetchUtils.fetchJson;

const DataProvider: DataProvider = {
    getOne: async <RecordType extends RaRecord = any>(
        resource: string,
        params: GetOneParams<any>
    ): Promise<GetOneResult<RecordType>> => {
        let record = await httpClient(`${apiUrl}/${resource}/${params.id}`);
        let data = record.json;
        if (!record) return Promise.reject("Record not found");
        return Promise.resolve(data);
    },
    getList: async function <RecordType extends RaRecord = any>(
        resource: string,
        params: GetListParams
    ): Promise<GetListResult<RecordType>> {
        
        let querystring = params.
        let listOfRecords = await httpClient(`${apiUrl}/${resource}/getList`);

        let data = listOfRecords.json;

        if (!listOfRecords) return Promise.reject("List not found");
        return Promise.resolve(data);
    },
    getMany: function <RecordType extends RaRecord = any>(
        resource: string,
        params: GetManyParams
    ): Promise<GetManyResult<RecordType>> {
        throw new Error("Function not implemented.");
    },
    getManyReference: function <RecordType extends RaRecord = any>(
        resource: string,
        params: GetManyReferenceParams
    ): Promise<GetManyReferenceResult<RecordType>> {
        throw new Error("Function not implemented.");
    },
    update: function <RecordType extends RaRecord = any>(
        resource: string,
        params: UpdateParams<any>
    ): Promise<UpdateResult<RecordType>> {
        throw new Error("Function not implemented.");
    },
    updateMany: function <RecordType extends RaRecord = any>(
        resource: string,
        params: UpdateManyParams<any>
    ): Promise<UpdateManyResult<RecordType>> {
        throw new Error("Function not implemented.");
    },
    create: function <RecordType extends RaRecord = any>(
        resource: string,
        params: CreateParams<any>
    ): Promise<CreateResult<RecordType>> {
        throw new Error("Function not implemented.");
    },
    delete: function <RecordType extends RaRecord = any>(
        resource: string,
        params: DeleteParams<RecordType>
    ): Promise<DeleteResult<RecordType>> {
        throw new Error("Function not implemented.");
    },
    deleteMany: function <RecordType extends RaRecord = any>(
        resource: string,
        params: DeleteManyParams<RecordType>
    ): Promise<DeleteManyResult<RecordType>> {
        throw new Error("Function not implemented.");
    },
};

export default DataProvider;
