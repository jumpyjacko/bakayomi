import Bottleneck from "bottleneck";

// Limiter configuration from https://github.com/RockinChaos/Shiru/blob/master/common/modules/anilist.js#L152
const ANILST_URL = "https://graphql.anilist.co";
const limiter = new Bottleneck({
    reservoir: 90,
    reservoirRefreshAmount: 90,
    reservoirRefreshInterval: 60 * 1000,
    maxConcurrent: 10,
    minTime: 100
})

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

    return limiter.schedule(() => fetch(ANILST_URL, options)).then(handleResponse).then(handleData).catch(handleError);

    async function handleResponse(response: Response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        })
    }

    function handleError(error) {
        console.error(error);
    }

    function handleData(data) {
        console.log(limiter.queued()); // DEBUG
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
