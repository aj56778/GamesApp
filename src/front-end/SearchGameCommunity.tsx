import { ScrollView, View} from "react-native";
import { useSelector } from "react-redux"
import { TBoardGameData } from "../types/boardGames";
import { BoardGames } from "./HomeScreen";

export const SearchGameCommunity = () => {
    const boardGames: TBoardGameData[] = useSelector((state: any) => state.data) ?? [];
    

    return (
        <ScrollView>
            <View>
                {boardGames.map((item) => <BoardGames item = {item}/>
                )}
            </View>
        </ScrollView>
    )
}