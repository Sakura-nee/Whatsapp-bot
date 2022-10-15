'use stric'

const anilist_id = function() {
    const query = `query ($id: Int) {
        Media(id: $id, type: ANIME) {
            id
            idMal
            title {
                native
                romaji
                english
            }
            synonyms
            isAdult
            type
            genres
            status
            format
            source
            duration
            bannerImage
            coverImage {
                large
                medium
            }
        }
    }`
    return query;
}

const search = function() {
    const query = `query ($page: Int, $perPage: Int, $search: String) {
        Page(page: $page, perPage: $perPage) {
            pageInfo {
                total
                perPage
            }
            media(search: $search, type: ANIME, sort: FAVOURITES_DESC) {
                id
                title {
                    romaji
                }
                type
                genres
                status
                format
                source
                duration
                episodes
                bannerImage
                season
                seasonYear
                startDate {
                    year
                    month
                    day
                }
                nextAiringEpisode {
                    id
                    episode
                    timeUntilAiring
                    airingAt
                }
                coverImage {
                    large
                    medium
                }
            }
        }
    }`
    return query;
}

module.exports = {
    anilist_id: anilist_id,
    anilist_search: search
}