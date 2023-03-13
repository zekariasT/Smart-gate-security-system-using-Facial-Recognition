//Sanitizes react admin queries into pocketbase queries
const sanitizeQuery = (stringQuery: Object | undefined) => {
    if (stringQuery === undefined || stringQuery === "{}") return "";
    let cleanQuery = "(";
    type Query = { [x: string]: any };

    const query: Query = JSON.parse(stringQuery.toString());
    for (let key of Object.keys(query)) {
        if (typeof query[key] === "number")
            cleanQuery += `${key} = ${query[key]} `;
        else cleanQuery += `${key} = '${query[key]}' `;
    }

    cleanQuery += ")";

    console.log({ query, cleanQuery });

    return cleanQuery;
};

export { sanitizeQuery };
