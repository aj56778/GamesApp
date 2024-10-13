import { useDispatch, useSelector } from "react-redux";
import auth from '@react-native-firebase/auth';
import {get, ref, set, update, onValue} from 'firebase/database';
import { database } from "../firebase";
import { useEffect, useState } from "react";
import { Dimensions, Image, ImageBackground, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagePicker, {launchImageLibrary, ImageLibraryOptions, ImagePickerResponse} from 'react-native-image-picker'
import axios from "axios";
import ImgToBase64 from 'react-native-image-base64-png';
import { NativeModules } from "react-native";
const {RNImgToBase64} = NativeModules
import { userData as userStore } from "../core/store";
import { PORT } from "../../App";
import { IMAGE_TYPES } from "../types/boardGames";
import {Buffer} from 'buffer'
import { GestureEvent, PanGestureHandler, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
type TUser = {
    name: string;
    birthdate: string;
    from: string;
}


const Profile = () => {
    const [currentType, setCurrentType] = useState<string>(IMAGE_TYPES.PROFILE_PIC)
    const [userData, setUserData] = useState<TUser>();
    const [image, setImage] = useState<string>('');
    const [imageBase64, setImageBase64] = useState<string>()
    const user = auth().currentUser?.uid;
    const [source, setSource] = useState<string>();
    const profilePic = useSelector((state:any) => state.userInteraction.profilePic)
    const dispatch = useDispatch()

    useEffect(() => {
        // console.log(imageBase64)
        const userDataRef = ref(database, '/Users/' + user);
        onValue(userDataRef, (snapshot) => {
            setUserData(snapshot.val());
        });
        //Doesnt work
        axios.post(`http://localhost:${PORT}/images`, {user: user}).then((images) => {
            console.log('Images', images);
        })

    }, [])

    useEffect(() => {
        if (!profilePic){
        axios.post(`http://localhost:${PORT}/image`, {
            user: user,
            type: currentType
        }).then((response) => {
            console.log('success')
            const imageBuffer = response.data.data
            const image = Buffer.from(imageBuffer).toString('base64');
            setSource(image)
            dispatch(userStore.actions.setProfilePic(image))
        }).catch((err) => console.error(err))
    }
    }, [user])
    
    const choosePhoto = async() => {
        const option:ImageLibraryOptions = {
            mediaType: 'photo'
        }
        try {
           await launchImageLibrary(option, async(response: ImagePickerResponse) => {
                if (response && response.assets){
                    let responseImage = response?.assets[0]?.uri;
                    if (responseImage){
                        setImage(responseImage)
                    }
                }
                if (image){
                    ImgToBase64.getBase64String(image).then(async(base64) => {
                    setImageBase64(base64);
                    axios.post(`http://localhost:${PORT}/images`, {
                        user: user,
                        type: IMAGE_TYPES.PROFILE_PIC
                    })
                    await axios.post(`http://localhost:${PORT}/`, {
                        user: user,
                        type: currentType,
                        imageBase64: base64
                    }).then(() => console.log('worked'))
                    .catch((e) => console.error(e))
                    dispatch(userStore.actions.setProfilePic(imageBase64));
                    })
                    .catch((er) => console.log(er))
                }
            })
        } catch(err) {
            console.log(err)
        }
        
    }

    const gestureHandler = (e:GestureEvent<PanGestureHandlerEventPayload> ) => {
        if (e.nativeEvent.velocityY < 0)  {
            //Swiping up
            switch(currentType) {
                case IMAGE_TYPES.PROFILE_PIC : 
                    setCurrentType(IMAGE_TYPES.ACTIVITY_1)
                    break;
                case IMAGE_TYPES.ACTIVITY_1 : 
                    setCurrentType(IMAGE_TYPES.PROFILE_PIC)
                    break;
            }
        }
        if (e.nativeEvent.velocityY > 0)  {
            //Swiping up
            switch(currentType) {
                case IMAGE_TYPES.PROFILE_PIC : 
                    setCurrentType(IMAGE_TYPES.ACTIVITY_1)
                    break;
                case IMAGE_TYPES.ACTIVITY_1 : 
                    setCurrentType(IMAGE_TYPES.PROFILE_PIC)
                    break;
            }
        }
        
    }
    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
        <SafeAreaView edges={['bottom']}>
            <ImageBackground source={{ uri: `data:image/jpeg;base64,${profilePic ?? source}` }} style={{height: Dimensions.get('screen').height}}>
            <View style={{backgroundColor: 'rgba(255,255,255,0.8)',
            // width:Dimensions.get('screen').width/2,
            top: Dimensions.get('screen').height * 3/5,
            paddingLeft: Dimensions.get('screen').width/30,
            borderStartEndRadius: 20,
            borderEndEndRadius: 20,
            padding:10,
            marginRight: 'auto'
            }}>
            <Text style={{
                fontFamily: 'Roboto',
                fontSize: 60,
                fontWeight:'800'
            }}>{userData?.name}</Text>
            <Text>{userData?.birthdate}</Text>
            <Text>{userData?.from}</Text>
            {/* {image && <Image source ={{uri: image}} width={90} height={90}></Image>} */}
            {/* {source && <Image source ={{ uri: `data:image/jpeg;base64,${source}` }} width={90} height={90}></Image>} */}
            <TouchableOpacity onPress={choosePhoto}>
                <Text>Button</Text>
            </TouchableOpacity>
        </View>
        <View style={{
            marginTop:Dimensions.get('screen').height/1.5,
            marginHorizontal: 'auto'
        }}>
        <Image source={require('./../down_arrow.png')} style={{backgroundColor:'rgba(255,255,255,0.7)',width:50, height:50, borderRadius:50}}></Image>

        </View>
            </ImageBackground>
        
        </SafeAreaView>
        </PanGestureHandler>
    )
}

export default Profile;