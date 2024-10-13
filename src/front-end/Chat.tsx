import auth from '@react-native-firebase/auth'
import { useEffect, useState } from "react"
import { Dimensions, SafeAreaView, Text, Touchable, TouchableOpacity, View } from "react-native"
import { ScrollView, TextInput } from "react-native-gesture-handler";
import {DatabaseReference, child, get, onValue, push, ref, set, update } from 'firebase/database';
import { database } from "../firebase";

//Store will contain a list of all channels and events user is part of and when 
//user navigates to chat, all the channels get updated on load.

//Later project
const ChatScreen = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [parties, setParties] = useState<string[]>([]);
    const [channels, setChannels] = useState<string[]>([]);
    const [message, setMessage] = useState<string>()
    const [unformattedMessages, setUnformattedMessages] = useState<string[]>([]);
    const [currentMessageRef, setCurrentMessageRef] = useState<DatabaseReference>();
    const [channel, setChannel] = useState<string>('');
    const [showChannel, setShowChannel] = useState<boolean>(true);
   
    useEffect(() => {
        setCurrentMessageRef(ref(database, 'Messages/'+channel));

        if (auth().currentUser?.uid ) {
            onValue(ref(database, 'Messages/test_channel'), (snapshot) => {
                setUnformattedMessages([]);
                setUsers([]);
                setMessages([]);
                snapshot.val().message.map((m: string) => {
                    setUnformattedMessages((unformatted) => [...unformatted, m])
                    const userNMessage = m.split(':sends:>')
                    setUsers((users) => [...users, userNMessage[0]]);
                    setMessages((messages) => [...messages, m.split(':sends:>')[1]])
                })
                setParties(snapshot.val().parties);
            })
            onValue(ref(database, 'Users/'+auth().currentUser?.uid + '/myChannels'), (snapshot) => {
                setChannels(snapshot.val())
            })

        }

    }, [auth().currentUser, channel])

   
    const submit = async() => {
        console.log(currentMessageRef)
        if (currentMessageRef && auth().currentUser?.email){
            const messageFormatted = auth().currentUser?.email + ':sends:>'+message;
            console.log(messageFormatted)
            await update(currentMessageRef, {
                message: [...unformattedMessages, messageFormatted]
            }).catch((e)=>console.log(e));
            onValue(currentMessageRef, (snapshot) => {
                setUnformattedMessages([]);
                setUsers([]);
                setMessages([])
                snapshot.val().message.map((m: string) => {
                    setUnformattedMessages((unformatted) => [...unformatted, m])
                    setUsers((users) => [...users, m.split(':sends:>')[0]])
                    setMessages((messages) => [...messages, m.split(':sends:>')[1]])
                })
            })
            
            
        }
    }
    const createChannel = () => {
        set(ref(database, 'Users/'+auth().currentUser?.uid+'/myChannels/'),
        ['test_channel'])
        setCurrentMessageRef(ref(database, 'Messages/test_channel'));
    }
    // const getUserName = async (userId: string) => {
    //     const userDataRef = ref(database, '/Users/' + userId);
    //     await onValue(userDataRef, (snapshot) => {
    //         snapshot.forEach((childSnapshot) => {
    //             const childData = childSnapshot.val();
    //             return childData.name;
    //           });
    //     });
    //     return ''
    // }

    const Channels = () => {
        return (
            <SafeAreaView>
                <View style={{borderBottomColor:'white', backgroundColor:'white', 
                shadowColor: 'black', shadowRadius:9, shadowOpacity:1, shadowOffset: {
                    width: 0, 
                    height: 0
                },
                padding: 10
            }}>
                    <Text style={{fontSize:25, marginLeft: 10}}>My Channels</Text>
                </View>
                <ScrollView>
                    {channels?.map((channel) => 
                    <TouchableOpacity onPress={() => {
                        setChannel(channel)
                        setShowChannel(false)
                        }}>
                    <View style={{padding:10, borderBottomColor: 'grey', borderBottomWidth: 1}}
                    key={channel}>
                    <Text style={{fontSize:20}}>{channel}</Text>
                    </View>
                    </TouchableOpacity>)}
                </ScrollView>
            </SafeAreaView>
        )
    }

    const Chats = () => {
        return (
            <>
            <View style={{flexDirection:'row', margin: 10}}>
                <TouchableOpacity onPress={() => setShowChannel(true)}>
                    <View style={{justifyContent: 'center',borderColor: 'red', borderWidth: 3, borderRadius: 25, width: 30, height: 30}}>
                        <Text style={{textAlign:'center'}}>{'<'}</Text>
                        </View>
                </TouchableOpacity>
                {parties.map((party) => <Text>{party}, </Text>)}
            </View>
            <View style={{borderBottomColor: 'white', borderBottomWidth:1,  shadowColor: 'black', 
            shadowOpacity:1,
            shadowOffset: {
                width:0,
                height: 0
            }, shadowRadius: 2,}}>

            </View>
            <ScrollView style={{height:Dimensions.get('screen').height*0.65,
                borderBottomColor:'grey', borderBottomWidth: 2}}>
            <View style={{marginTop: 10}}>
                {messages.map((mess, index) => {
                    return (
                        <View>
                            <View style={users[index] === auth().currentUser?.email ?
                                {alignItems:'flex-end'} : {alignItems:'flex-start'}}>
                                {users[index - 1] !== users[index] && <Text>{users[index]}</Text>}
                            <View style={{
                                    backgroundColor: users[index] !== auth().currentUser?.email ? 'rgba(210, 125, 45, 0.7)' : 'rgba(10, 125, 45, 0.7)',
                                    borderRadius: 10,
                                    alignItems:'center',
                                    padding:5,
                                    margin: 5
                                }}>
                                <Text>{mess}</Text>
                            </View>
                        </View> 
                        </View>
                    )
                })}
                
            </View>
            </ScrollView>
            <View style={{flex:0, alignItems:'flex-end'}}>
            <TextInput placeholder="Message" onChangeText={(text) => setMessage(text)}>
                </TextInput>
                <TouchableOpacity onPress={submit}>
                    <View>
                        <Text>SEND</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={createChannel}>
                    <View>
                        <Text>CREATE CHAT</Text>
                    </View>
                </TouchableOpacity>
                </View></>  
        )
    }
    return (
        <SafeAreaView>
            
            {showChannel && <Channels/>}
            {!showChannel && <Chats/>}
            
        </SafeAreaView>
    )
}

export default ChatScreen;