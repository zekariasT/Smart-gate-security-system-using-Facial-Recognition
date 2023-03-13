// in src/posts.js
import * as React from "react";
import {
    Create,
    SimpleForm,
    TextInput,
    DateInput,
    required,
    Form,
    ImageInput,
    Button,
    useCreate,
    ImageField,
    List,
    DateField,
    Datagrid,
    TextField,
    TopToolbar,
    CreateButton,
} from "react-admin";
import { IContact } from "../constants/types";
import { useState } from "react";
import { data } from "autoprefixer";
import { useRouter } from "next/router";

const ContactCreate = () => {
    const router = useRouter();

    //React admin create function to create records
    const [create, { isLoading: isCreateLoading, isError: isCreateError }] =
        useCreate();

    const [name, setName] = useState<string>("");
    const [saved, setSaved] = useState(false);

    //If contact is saved refresh
    React.useEffect(() => {
        if (!isCreateLoading && saved) {
            router.push("/#/contact");
            router.reload();
        }
    }, [isCreateLoading, isCreateError, saved]);

    //TODO Add validation
    const hasEnoughPics = async (value: any, values: any, props: any) => {
        return null;
    };
    const contactSave = async (data: IContact) => {
        await create("contact", { data });
    };

    const handleChange = (e: any) => {
        setName(e.target.value);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        const files = document.getElementById("file") as any;

        //Add files into form data
        for (let key in files?.files) formData.append(key, files?.files[key]);
        const user_id = String(Math.floor(Math.random() * 100000000));

        //Add name and user_id
        formData.append("name", name);
        formData.append("user_id", user_id);

        const requestOptions = {
            // headers: {
            //     "Content-Type": "multipart/form-data", // This way, the Content-Type value in the header will always match the content type of the file
            // },
            method: "POST",
            // files: files?.files,
            body: formData,
        };

        //Send form data to server
        const response = await (
            await fetch("http://localhost:5000/upload", requestOptions)
        ).json();

        if (response.success) {
            await contactSave({
                name,
                user_id: Number(user_id),
            }).then(() => setSaved(true));
        } else console.log(response);
    };
    return (
        <Create>
            <form onSubmit={handleSubmit} className="py-2 px-10 w-[50%]">
                <div className="my-6">
                    <label
                        htmlFor={"name"}
                        className="font-medium mb-2 leading-none inline-block"
                    >
                        Name
                    </label>
                    <input
                        required
                        id={"name"}
                        name={"name"}
                        type="text"
                        className="w-auto mx-4 rounded-full border border-black"
                        onChange={handleChange}
                        value={name}
                    />
                </div>
                <div className="my-6">
                    <input
                        type="file"
                        name="contact_images"
                        multiple
                        id="file"
                    />
                </div>
                <Button type="submit" label="submit" />
            </form>
        </Create>
    );
};

const PostListActions = () => (
    <TopToolbar>
        <CreateButton />
    </TopToolbar>
);

export const ContactList = () => (
    <List actions={<PostListActions />}>
        <Datagrid rowClick="show">
            <TextField source="name" className="font-bold text-lg" />
            <TextField source="id" />
        </Datagrid>
    </List>
);
export { ContactCreate };
