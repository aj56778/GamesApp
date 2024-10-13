import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from '../firebase';
import { Text, TextInput, View } from "react-native";

const signIn = ['EMAIL', 'PASSWORD']



export const Signin = () => {
    return (
        <View>
            <View style={{marginVertical:200, backgroundColor:''}}>
            <Text style={{marginHorizontal: 100, textAlign: "center"}}>
                SIGN-IN
            </Text>
            {signIn.map((item) => 
                <View style={{margin: 10,backgroundColor: '#c2eaf0', borderRadius: 10, marginHorizontal: 75, padding: 10, shadowColor: 'black', shadowRadius: 4, shadowOpacity: 0.5, shadowOffset: 0.9}}>
                    <Text style={{textAlign: "center", padding:9}}>
                        {item}
                    </Text>
                    <TextInput style={{backgroundColor: 'white', borderRadius: 5, textAlign: 'center'}} placeholder={item.toLowerCase()}></TextInput>
                </View>
            )}
            </View>
        </View>
    )
}