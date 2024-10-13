export type TBoardGameData = {
    gameId: string,
    name: string,
    image: string,
    thumbnail: string,
    minPlayers: number,
    maxPlayers: number,
    playingTime: number,
    isExpansion: boolean,
    yearPublished: number,
    bggRating: number,
    averageRating: number,
    rank: number,
    numPlays: number,
    rating: number,
    owned: boolean,
    preOrdered: boolean,
    forTrade: boolean,
    previousOwned: boolean,
    want: boolean,
    wantToPlay: boolean,
    wantToBuy: boolean,
    wishList: boolean,
    userComment: string,
}

export const IMAGE_TYPES = {
    PROFILE_PIC: 'PROFILE_PIC',
    ACTIVITY_1: 'ACTIVITY_1'
}

export type EVENT = {
    address: string[],
    date: {
        start_date: string,
        when: string
    },
    description: string,
    event_location_map: {
        image: string,
        link: string,
        serpapi_link: string
    },
    link: string,
    thumbnail: string,
    ticketInfo: {
        link: string,
        link_type: string,
        source: string,
    }[],
    title: string,
    venue: {
        link: string,
        name: string,
        rating: string,
        review: 6
    }
}