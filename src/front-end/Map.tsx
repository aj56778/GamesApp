import Geolocation from "@react-native-community/geolocation";
import { useEffect, useState } from "react";
import { Dimensions, Image, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";

const Maps = () => {
    const [userLat, setLat] = useState<number>(0);
    const [userLong, setLong] = useState<number>(0);
    const userImage = useSelector((state: any) => state.userInteraction.profilePic)
    setTimeout(() => 
        Geolocation.getCurrentPosition((location) => {
            setLat(location.coords.latitude);
            setLong(location.coords.longitude);
    }), 20000)
    console.log([userLat, userLong])
    useEffect(()=>{
        Geolocation.getCurrentPosition((location) => {
            setLat(location.coords.latitude);
            setLong(location.coords.longitude);
        });
    }, []);

    return (
        <MapView 
        style={{width: Dimensions.get('screen').width, height: Dimensions.get('screen').height}}
        region={{
            latitude: userLat,
            longitude: userLong,
            latitudeDelta:0.01, //idk
            longitudeDelta: 0.01 //idk
        }}>
            <Marker coordinate={{latitude: userLat, longitude: userLong}}
            title="You"
            >
                {userImage && <Image source={{uri:`data:image/jpeg;base64,`+userImage }} style={{width: 45, height: 45, borderRadius: 25}}/>}
            </Marker>
        </MapView>
    )
}
export default Maps