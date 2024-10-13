import {View, Text, Image, StyleSheet, Touchable, TouchableOpacity, ImageBackground, TextInput, Dimensions} from 'react-native'
import { FlatList, GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState} from 'react'
import { TBoardGameData } from '../types/boardGames';
import { useDispatch, useSelector } from 'react-redux';
import { gameBoardStore, userData } from '../core/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import {child, get, onValue, ref, set } from 'firebase/database';
import { database } from '../firebase';
import { Login } from './Login';
import auth from '@react-native-firebase/auth'
import CustomText from '../components/text';
import Divider from '../components/divide';
import axios from 'axios';
import { PORT } from '../../App';
import {Buffer} from 'buffer'
import { Chat } from "@pubnub/chat";
import Geolocation from '@react-native-community/geolocation';
const globalFont = 'Roboto'
import {Dropdown} from 'react-native-element-dropdown';


const dimension = Dimensions.get('screen').width

type TBoardGame ={ 
    item: TBoardGameData,
    horizontal?: boolean,
    people?:TPeople[],
    others?: boolean
}

export type TPeople = {
    name: string,
    id?: string,
    image?: string,
    size?: number,
    blueBorder?:boolean,
    others?:boolean
}

const UserPic = () => {
    const profilePic = useSelector((state:any) => state.userInteraction.profilePic);
    
    return <People name={'You' ?? ''} image={'data:image/jpeg;base64,'+profilePic} ></People>
}

const People:React.FC<TPeople>= ({name,image, id, size, blueBorder, others}) => {
    const [friendsImage, setFriendsImage] = useState<string>();
    useEffect(() => {
        if (id){
            axios.post(`http://localhost:${PORT}/image`, {
                user: id,
                type: 'PROFILE_PIC'
            }).then((item) => {
                const imageBuffer = item.data.data;
                const image = Buffer.from(imageBuffer).toString('base64');
                setFriendsImage(image);
            }); 
        }
    },[id])

    useEffect(() => {
        if (friendsImage)
        console.log(friendsImage);
    }, [friendsImage])
    
    return (
        <View>
            
            <Image source={{uri: image ?? 'data:image/jpeg;base64,'+friendsImage}} width={size??70} height={size??70} style={{borderRadius:50, margin: 8, backgroundColor: 'white', borderColor: blueBorder && 'blue', borderWidth: blueBorder && 1, marginTop: others && 2}}>
            </Image>
            <CustomText props={{textAlign: 'center'}} text={name}></CustomText>
            
        </View>
    )
}

type TButton = {
    color: string,
    title: string,
    shadow: boolean
}

type TButtons = {
    buttons: TButton[]
}

const Buttons:React.FC<TButtons> = ({buttons}) => {
    return (
        <View style={{marginHorizontal: 7, marginVertical:15}}>
            <FlatList data={buttons} renderItem={({item}) => 
                <TouchableOpacity>
                    <View style={{backgroundColor:item.color, width: 150, height: 100, alignItems:'center', borderRadius: 20, margin: 4, shadowColor:'grey', shadowOpacity:0.7, shadowRadius:2, shadowOffset: {
                        height:2
                    }}}> 
                        <Text style={{fontFamily: globalFont, marginVertical: 'auto', fontSize: 20}}>{item.title}</Text>
                    </View>
                </TouchableOpacity>
            }/>
        </View>
    )
}

export const BoardGames: React.FC<TBoardGame> = ({item, horizontal, people, others}) => {
    const {image} = item;
    const buttons:TButton[] = [{
        color:'rgb(255, 214, 112)',
        title: 'Let\'s Play',
        shadow: true
    },
    {
        color:'rgb(244, 184, 96)',
        title: 'Learn More',
        shadow: true

    }]
    // console.log(people)
    return (
        <View  style={{
            backgroundColor: 'white',
            margin: 5,
            borderRadius: 20,
            flexDirection: horizontal ? 'row' : 'column',
            marginBottom:20,
            shadowColor: 'black',
            shadowOpacity: 0.8,
            shadowOffset: {
                width:0,
                height:0
            },
            shadowRadius:5
        }}>
            <TouchableOpacity>
                <View style={{flexDirection: 'row'}}>
                    <ImageBackground source={{uri: image,}} 
                    imageStyle={{
                        borderRadius: 20
                    }}
                    style={{
                        width: dimension/2,
                        height: dimension/2,
                        shadowColor: 'black',
                        shadowOpacity:0.5, 
                        shadowRadius:2, 
                        shadowOffset: {
                            width: 2,
                            height: others && 2
                        }
                    }}/>

                    {others && <Buttons buttons={buttons} />}
                </View>
            </TouchableOpacity>
            <View style={{height: 50, paddingLeft: 5}}>

                

            {!horizontal  && 
            <View style={{height:60, marginVertical: 5}}>
                <CustomText text={'Who wants to play?'} props={{fontWeight: 800}}></CustomText>
            <FlatList 
            data={people} 
            renderItem={({item}) => <People name={item.name} image={item.image} size={40} blueBorder={true} others={true}/>} 
            horizontal/>
            </View>}  

            {horizontal && people && people?.length > 0 && 
            <View style={{height: dimension/2}}>
                <FlatList data={people} numColumns={2} renderItem={
                    ({item}) => {
                        const {name, image} = item;
                        return (
                            <>
                            <TouchableOpacity style={{marginBottom:10}}>
                                <People image={image} name={name} size={75} blueBorder={true}/>
                                </TouchableOpacity>
                                
                            </>
                        )
                    }

                }/>
            </View>}          
              
            </View>
        </View> 
    )
}

type TPlans = {
    boardGames: TBoardGameData[],
    people?: TPeople[]
}

const OthersPlans:React.FC<TPlans> = ({boardGames, people}) => {
    return (
        <FlatList 
        data={boardGames}
        renderItem={({item}) => <BoardGames item={item} people={people} others={true}/>}
        keyExtractor={(item) => item.gameId}
        />
    )
}
const MyPlans:React.FC<TPlans> = ({boardGames, people}) => {
    return (
        <FlatList 
        data={boardGames}
        renderItem={({item}) => <BoardGames item={item} horizontal={true} people={people}/>}
        keyExtractor={(item) => item.gameId}
        />
    )
}

const LoginButton = () => {
    const dispatch = useDispatch();

    return (
    <TouchableOpacity onPress={() => {
        dispatch(userData.actions.setVisible(true))
        dispatch(userData.actions.setLoginType('Sign in'))
        }}>
        <View style={{flexDirection: 'row-reverse'}}>
        <Image source={require('./../user_icon.png')}style={{width:35, height:35, borderRadius: 25, borderColor: 'black', borderWidth:1, marginRight:20, backgroundColor:'white'}}/>
        </View>
    </TouchableOpacity>)
}

const checkFriends = (friends:{name: string, id: string}[], friend:string) => {
    return friends.find((users) => {
        users.id ===friend
    })
}

export const HomeScreen = () => {
    const [myPlans, setMyPlans] = useState<boolean>(true);
    const dispatch = useDispatch();
    const people:TPeople[] = useSelector((state:any) => state.games.people)
    const games:TBoardGameData[] = useSelector((state:any) => state.games.data)
    const [everyone, setEveryone] = useState<TPeople[]>([]);
    const [chat, setChat] = useState<Chat>()

    Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        enableBackgroundLocationUpdates: true
    })
    //User location
    const [users, setUsers] = useState<{name:string, id:string}[]>([]);
    const [myFriends, setMyFriends] = useState<{name:string, id:string}[]>([]);
    const [addFriend, setAddFriend] = useState<{name:string, id:string}>();

    useEffect(() => {
        setUsers([]);
        onValue(ref(database, 'Users/'), (snapshot) =>{
            snapshot.forEach((child) => {
                console.log(child.key)
                setUsers((users) => [...users, {id: child.key, name: child.val().name}])
            })
        }) 
        setMyFriends([])
        onValue(ref(database, 'Users/'+auth().currentUser?.uid+'/friends'), (snapshot) =>{
            snapshot.forEach((child) => {
                setMyFriends((users) => [...users, {name: child.val().name, id:child.val().id}])
            })
        })
        axios.post(`http://localhost:${PORT}/image`, {
            user: auth().currentUser?.uid,
            type: 'PROFILE_PIC'
        }).then((response) => {
            console.log('success')
            const imageBuffer = response.data.data
            const image = Buffer.from(imageBuffer).toString('base64');
            // setSource(image)
            dispatch(userData.actions.setProfilePic(image))
        }).catch((err) => console.error(err))
    }, [])
    useEffect(() => {
        const dataFetch = async () => {
            get(child(ref(database), 'boardGames/')).then((snapshot) => {
                if (snapshot.exists()) {
                    dispatch(gameBoardStore.actions.setData(snapshot.val()));
                } else {
                    console.log("err no data or wrong ref")
                }
            }).catch(console.log);
            for (var i = 0; i < 10; i ++) {
                let name = await fetch('https://randomuser.me//api').then((res) => res.json()).then(({results}) => {
                    return results[0].name.first
                })
                setEveryone(everyone => [...everyone, {
                    name: name,
                    image: 'https://robohash.org/' + name
                }]);
            }
            dispatch(gameBoardStore.actions.setPeople(everyone))
        }
        if (people.length == 0 || games.length == 0)
            dataFetch() 
    }, [people])

    useEffect(() => {
        if (addFriend && checkFriends(myFriends, addFriend.id)){
            set(ref(database, 'Users/'+auth().currentUser?.uid+'/friends'), 
                [...myFriends, {name: addFriend.name, id: addFriend.id}]
        )}
        else {
            console.log('not added already friend')
        }
    }, [addFriend])
    return (
        <SafeAreaView style={{backgroundColor:'white'}} edges={['top']}>
        <View style={{backgroundColor:'white'}}>
        <ScrollView stickyHeaderIndices={[4]}>
            <View style={{
            marginHorizontal:'auto',
            justifyContent: 'center',
            alignItems: 'center'}}>
                <Dropdown 
                searchPlaceholder='search friend'
                containerStyle={{
                    borderRadius:25,
                    borderColor:'black',
                    borderWidth:2,
                }}
                itemContainerStyle={{
                    borderTopColor:'black',
                    borderTopWidth:2,
                    borderRadius:25,
                }}
                style={{
                    borderColor:'black',
                    borderWidth:2,
                    borderRadius:25,
                    paddingHorizontal:50,
                    width:Dimensions.get('screen').width/2}}
                labelField={'name'} valueField={'name'}placeholder='add friend' data={users} search value={addFriend} onChange={(item) => setAddFriend({
                    name: item.name,
                    id: item.id})}/>
            </View>
        <LoginButton/>

            <View style = {{marginBottom: 20, flexDirection: 'row'}} >
                <UserPic/>
                <View style={{marginHorizontal:5,borderColor:'black', borderWidth:2, shadowColor: '#F2613F', shadowRadius:5, shadowOpacity:1, shadowOffset: {width:0, height:0}}}></View>
                <FlatList data={myFriends} renderItem={({item}) => {
                const {name, id} = item;
                console.log({name, id})
                return <People name={name} id={id}/>
            }} horizontal/>
            </View>
            {/* *Divider */}
            <Divider/>
            <View style={{
                alignItems:'center'
            }}>
            <View style={{
                flexDirection:'row',
                alignItems:'center',
                padding: 2,
                paddingVertical: 9,
                backgroundColor: '#9B3922',
                borderRadius: 20,
                margin:10,
            }}>
                <TouchableOpacity onPress={() => setMyPlans(true)} style={{
                    marginHorizontal: 14,
                    backgroundColor: myPlans ? '#481E14' : 'transparent',
                    padding: 8,
                    borderRadius: 20
                }}>
                    <CustomText size={20} color={'white'} text='My Plans' props={{fontWeight:'700'}}></CustomText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMyPlans(false)} style={{
                    marginHorizontal: 14,
                    backgroundColor: !myPlans ? '#481E14' : 'transparent',
                    padding: 8,
                    borderRadius: 20
                }}>
                    <CustomText size={20} color={'white'} text='Others Plans' props={{fontWeight:'700'}}></CustomText>
                </TouchableOpacity>
            </View>
            </View>
            <Login/>
            <View>
            {myPlans && <MyPlans boardGames={games.slice(0,8)} people={people?.slice(0,7)}/>}
            {!myPlans && <OthersPlans boardGames={games.slice(0,8)}  people={people?.slice(0,5)}/>}
            <View style={{margin:Dimensions.get('screen').height/20}}></View>
            </View>
        </ScrollView>

        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    boardGames: {
        margin: 15,
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        shadowColor: 'grey',
        shadowRadius: 1,
        shadowOpacity: 0.2,
    },
    titleText: {
        fontSize: 19
    }
})