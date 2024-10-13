import { useEffect, useState } from "react"
import { database } from "../firebase";
import { set, ref, get, update } from "firebase/database";
import axios from "axios";
import { PORT } from "../../App";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { EVENT } from "../types/boardGames";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import CustomText from "../components/text";

const querySearch = 'Comic con';
const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

const EventsPage = () => {
    const [events, setEvents] = useState<EVENT[]>();
    const storageRef = ref(database, 'Events');

    useEffect(() => {
        if (!events)
            get(storageRef).then((snapshot) =>{
                if (snapshot.exists()) {
                    setEvents(snapshot.val())
                }
            })
        // // // // if (!events){
        //     if (events)
    
        // // }
        // //Now after fetching data
        // //Put it in firebase
        // if (events)

        // console.log(JSON.stringify(events));
    },[])

    const getEvents = () => {
        axios.post(`http://localhost:${PORT}/events`, {
            query: querySearch
        }).then((res) => {
            // console.log(res.data)
            setEvents((e) => [...e, ...res.data])
            set(storageRef, res.data)
        })
        .catch((err) => console.log(err))
    }


    return (
        <SafeAreaView edges={['top']} style={{backgroundColor:'black'}}>
<ScrollView>
        <View style={{marginBottom: 120, backgroundColor:'black'}}>
            {events && events.map((event) => {
                return (
                    <View style={{alignItems:'center', justifyContent:'space-between', margin: 10, backgroundColor: 'white', padding: 10, height:height/4, borderRadius: 25}}>
                       <View style={{flex:1, flexDirection:'row', }}>
                        <View style={{flexDirection: 'column', width: width * 0.6, justifyContent:'space-between'}}>
                                <Text style={{fontSize: 20, fontWeight: 800}}>{event.title}</Text>
                                <Text>{event.description.slice(0, 99) + (event.description.length >= 99 && '...')}</Text>
                                <Text style={{fontWeight: '700'}}>{event.address[0] + ', ' + event.address[1]}</Text>
                                <Text>{event.date.when}</Text>

                        </View>
                        <Image source={{uri: event.thumbnail}} style={{width:width/4, height:width/4}}></Image>
                        </View>
                        <TouchableOpacity>
                            <View style={{backgroundColor: 'green', margin: 10}}>
                                <CustomText text="Start Chat"></CustomText>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            })}
        </View>
        </ScrollView>
        </SafeAreaView>
    )
}

export default EventsPage;