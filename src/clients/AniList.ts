import Bottleneck from "bottleneck";

// Limiter configuration from https://github.com/RockinChaos/Shiru/blob/master/common/modules/anilist.js#L152
const ANILST_URL = "https://graphql.anilist.co";
const limiter = new Bottleneck({
    reservoir: 90,
    reservoirRefreshAmount: 90,
    reservoirRefreshInterval: 60 * 1000,
    maxConcurrent: 3,
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
        // console.log(limiter.queued(), limiter.currentReservoir()); // DEBUG
        return data;
    }
}

export async function searchMangaSeriesByName(search: string) {
    const query = `
    query Query($search: String) {
        Media(search: $search, type: MANGA, format: MANGA) {
            bannerImage
            coverImage {
                extraLarge
                large
                medium
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
            idMal
            status
            title {
                userPreferred
            }
            description
            siteUrl
            countryOfOrigin
            averageScore
            popularity
            startDate {
                year
            }
            endDate {
                year
            }
        }
    }
    `;

    const variables = `
    {
        "search": "${search}"
    }
    `;

    return await sendQuery(query, variables);
}

export async function searchMangaSeriesById(id: number) {
    const query = `
    query Query($id: Int) {
        Media(id: $id, type: MANGA, format: MANGA) {
            bannerImage
            coverImage {
                extraLarge
                large
                medium
            }
            staff {
                nodes {
                    name {
                        full
                    }
                    primaryOccupations
                }
            }
            id
            idMal
            status
            title {
                userPreferred
            }
            description
            siteUrl
            countryOfOrigin
            averageScore
            popularity
            startDate {
                year
            }
            endDate {
                year
            }
        }
    }
    `;

    const variables = `
    {
        "id": ${id}
    }
    `;

    return await sendQuery(query, variables);
}

export async function getTrendingSeries() {
    const query = `
    query Query($page: Int, $perPage: Int, $averageScoreGreater: Int, $status: MediaStatus, $sort: [MediaSort], $isAdult: Boolean) {
        Page(page: $page, perPage: $perPage) {
            media(
                type: MANGA
                format: MANGA
                averageScore_greater: $averageScoreGreater
                status: $status
                sort: $sort
                isAdult: $isAdult
            ) {
                id
                idMal
                bannerImage
                coverImage {
                    extraLarge
                    large
                    medium
                }
                staff {
                    nodes {
                        name {
                            full
                        }
                        primaryOccupations
                    }
                }
                status
                title {
                    userPreferred
                }
                description
                siteUrl
                countryOfOrigin
                averageScore
                popularity
                startDate {
                    year
                }
                endDate {
                    year
                }
            }
        }
    }
    `;

    const variables = `
    {
        "page": 0,
        "perPage": 30,
        "averageScoreGreater": 80,
        "status": "RELEASING",
        "sort": ["TRENDING"],
        "isAdult": false
    }
    `;

    return await sendQuery(query, variables);
}
