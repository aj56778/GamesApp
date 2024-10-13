import { useEffect, useState } from "react"
import { Text, View , Modal, Touchable, TouchableOpacity, StyleSheet, Dimensions, Image} from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../core/store";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth} from "firebase/auth";
import { database } from "../firebase";
import auth from '@react-native-firebase/auth'
import { ref, set, push } from "firebase/database";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Chat } from "@pubnub/chat";


const credentials = {
    name: 'Tester',
    email: 'Tester@testing.com',
    password: 'Testing',
    from: 'Who knows, who cares',
    birthdate: 'August 30, 2003'
}

GoogleSignin.configure({
    webClientId:'com.googleusercontent.apps.298717650937-c8ij2qdmnda5f4okdsdoj7jpg083n181',
    accountName: 'Dating App'
})
export const Login:React.FC = () => {
    
    const signInWithGoogle = async() => {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const signIn = (await GoogleSignin.signIn()).data;

        if (signIn){
            const {idToken, user} = signIn;
            const {name} = user;
            const googleCredential = auth.GoogleAuthProvider.credential(signIn.idToken)
            return auth().signInWithCredential(googleCredential);
        }
    }
    const [option, setOption] = useState<string>();
    const loginType = useSelector((state: any) => state.userInteraction.loginType)
    const visible = useSelector((state: any) => state.userInteraction.visible)
    const dispatch = useDispatch();
    // const auth = getAuth()

    const [email, setEmail] = useState<string>(credentials.email)
    const [password, setPassword] = useState<string>(credentials.password)
    const [name, setName] = useState<string>(credentials.name)
    const [from, setFrom] = useState<string>(credentials.from)
    const [birthdate, setBirthdate] = useState<string>(credentials.birthdate)

    useEffect(() => {
        if (auth().currentUser?.uid) {
            dispatch(userData.actions.setVisible(false))
        }
    }, [])

    useEffect(() => {
        if (loginType === 'Sign in') {
            setOption('New user?')
        } else {
            setOption('Already have an account?')
        }
    }, [loginType]);

    const {width, height} = Dimensions.get('window');

    const submit = () => {
        if (loginType === 'Sign in') {
            auth().signInWithEmailAndPassword( email, password)
            .then((userCred) => {
                console.log(userCred.user.uid);
                dispatch(userData.actions.setVisible(false))
            }).catch((err) => console.log(err))
        } else {
            auth().createUserWithEmailAndPassword(email, password)
            .then((userCred) => {
                const userId = userCred.user.uid;
                set((ref(database, 'Users/' + userId)), {
                    name: name,
                    from: from,
                    birthdate: birthdate     
                })
                dispatch(userData.actions.setVisible(false))
            }).catch(err => console.log(err))
        }
    }

    return (
        <View >
        <Modal visible={visible} animationType="slide" >
            <View style={{
                flex:1,
                backgroundColor: 'transparent',
                justifyContent:'center',
                alignItems:'center'
            }}>

            
            <View 
            style={{
            backgroundColor:'rgba(204, 215, 228, 0.1)', width:width, height:height, paddingVertical:Dimensions.get('screen').height/4, alignItems: 'center' }}>
                <View 
                style={{
                    backgroundColor:'rgba(255,255,255,0.1)',
                    borderRadius: 25,
                    padding: 10,
                }}>
                <Text style={{fontSize: 20}}>{loginType}</Text>
                <TouchableOpacity onPress={() => loginType === 'Sign in' 
                ? dispatch(userData.actions.setLoginType('Sign up')) 
                : dispatch(userData.actions.setLoginType('Sign in'))}>
                    <Text 
                    style={{fontSize: 19, color:'blue'}}>{option}</Text>
                </TouchableOpacity>
                {loginType === 'Sign in' && 
                <View>
                    <TextInput placeholder="Email Address" style={styles.LoginInfo} cursorColor={'black'} selectionColor={'black'} onBlur={(email) => setEmail(email.nativeEvent.text)}></TextInput>
                    <TextInput textContentType='password' secureTextEntry={true} placeholder="Password" style={styles.LoginInfo} cursorColor={'black'} selectionColor={'black'} onBlur={(password) => setPassword(password.nativeEvent.text)}></TextInput>
                </View>} 
                {loginType === 'Sign up' && <View>
                <TextInput textContentType='name'  placeholder="Name" style={styles.LoginInfo} cursorColor={'black'} selectionColor={'black'} onBlur={(text) => setName(text.nativeEvent.text)}></TextInput>
                <TextInput placeholder="Email Address" style={styles.LoginInfo} cursorColor={'black'} selectionColor={'black'} onBlur={(email) => setEmail(email.nativeEvent.text)}></TextInput>
                <TextInput textContentType='password' secureTextEntry={true} placeholder="Password" style={styles.LoginInfo} cursorColor={'black'} selectionColor={'black'} onBlur={(password) => setPassword(password.nativeEvent.text)}></TextInput>
                <TextInput textContentType='addressCity' placeholder="Where are you from?" style={styles.LoginInfo} cursorColor={'black'} selectionColor={'black'}onBlur={(text) => setFrom(text.nativeEvent.text)}></TextInput>
                <TextInput textContentType='birthdate' placeholder="When were you born?" style={styles.LoginInfo} cursorColor={'black'} selectionColor={'black'}onBlur={(text) => setBirthdate(text.nativeEvent.text)}></TextInput>
                </View>} 
                <TouchableOpacity onPress={() => submit()}
                style={{marginHorizontal: 'auto',
                backgroundColor:'#7393B3',
                borderRadius: 25,
                padding:5
                 }}
                >
                    
                        <Text style={{fontSize: 20}}>{
                        loginType === 'Sign in' ? 'Login':
                        'Sign up'}
                        </Text>
                    
                </TouchableOpacity>
           </View>
           <TouchableOpacity onPress={() => signInWithGoogle()}>
                <Image source={require('./../google.png')} style={{width: 90, height:90}}/>
            </TouchableOpacity>
           </View>
           </View>
        </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    LoginInfo: {
        textDecorationLine: 'underline',
        padding: 10,
        color: 'black',
        fontSize: 20,
        margin:10
     }
})