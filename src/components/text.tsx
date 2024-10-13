import { Text, TextStyle } from "react-native";


type TCustomText = {
    size?: number,
    color?: string,
    fontFamily?: string,
    text: string,
    props?: TextStyle
}
const CustomText:React.FC<TCustomText> = ({size, color, fontFamily, text, props}) => {

    return <Text style={{
        fontSize: size ?? 15,
        color: color ?? 'black',
        fontFamily: fontFamily ?? 'Roboto',
        ...props
    }}>{text} </Text>
}

export default CustomText;