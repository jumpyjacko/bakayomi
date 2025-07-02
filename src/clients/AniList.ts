const ANILST_URL = "https://graphql.anilist.co";

// Example taken from https://docs.anilist.co/guide/graphql/
async function sendQuery(query: string, variables: string): Promise<Object> {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
        })
    };

    return fetch(ANILST_URL, options).then(handleResponse).then(handleData).catch(handleError);

    async function handleResponse(response: Response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        })
    }

    function handleError(error) {
        console.error(error);
    }

    function handleData(data) {
        return data;
    }
}

export async function searchMangaSeries(search: string) {
    const query = `
    query Query($search: String) {
        Media(search: $search) {
            bannerImage
            coverImage {
                extraLarge
                color
            }
            staff {
                nodes {
                    name {
                        full
                    }
                    primaryOccupations
                }
            }
            chapters
            id
            status
            title {
                userPreferred
            }
            type
            description
        }
    }
    `;

    const variables = `
    {
        "search": "${search}"
    }
    `

    console.log(await sendQuery(query, variables));
}
