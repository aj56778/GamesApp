import { View } from "react-native";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get('screen').width
const Divider = () => {
    return <View style={{marginBottom: 10,borderColor: 'black', borderWidth:2, width: screenWidth * 5/6, borderRadius: 50, alignSelf: 'center', shadowColor: '#F2613F', shadowRadius:5, shadowOpacity:1, shadowOffset: {width:0, height:0}}}></View>
}

export default Divider