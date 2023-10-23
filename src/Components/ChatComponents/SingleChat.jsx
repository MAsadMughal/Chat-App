import { Avatar, Box, FormControl,Textarea, Input, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatContext from '../../context/Chat/ChatContext';
import axios from 'axios';
import './Chat.css';
import UserContext from '../../context/User/UserContext';
import DateForChat from './DateForChat'
import io from 'socket.io-client';
import ShowToast from '../../toast/toast';
const ENDPOINT = 'http://localhost:1215';
var socket, selectedChatCompare;

const SingleChat = () => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [notsame, setNotSame] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const { selectedChat } = useContext(ChatContext);
    const { user } = useContext(UserContext);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null)
    const toast = useToast()

    useEffect(() => {
        socket = io(ENDPOINT);

        socket.emit('setup', user.loggedInUser);
        socket.on('connected', () => {
            setSocketConnected(true);
        })
        socket.on('typing', () => setTyping(true));
        socket.on('stop typing', () => setTyping(false));
    }, [])

    const fetchMessages = async () => {
        setMessages([]);
        setNewMessage('')
        if (selectedChat) {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/fetchMessages/${selectedChat._id}`, { withCredentials: true });
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
        }
    }



    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behaviour: 'smooth' });
    }, [messages, typing])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])


    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        if (!socketConnected) return;

        if (!typing) {
            socket.emit('typing', selectedChat._id);
        }
    }


    const sendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage) {
            try {
                socket.emit('stop typing', selectedChat._id)
                const chatId = selectedChat._id;
                const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/sendMessage`, { chatId, content: newMessage }, { withCredentials: true });
                socket.emit('new message', data);
                setMessages([...messages, data]);
                setNewMessage('');
            } catch (error) {
                ShowToast(toast, 'Error', error.response.data.message, 'error')
            }
        }
    }

    useEffect(() => {
        socket.on('message received', async (message) => {
            if (!selectedChatCompare || selectedChatCompare._id !== message?.chat?._id) {
                message?.content && setNotSame(true);
                // notsame && message?.content && ShowToast(toast, message?.chat?.isGroupChat ? message?.chat?.chatName : message?.sender?.name, message?.content, 'success')
                toast.closeAll();
                // notsame && message?.content && message?.chat?.isGroupChat ? toast({
                //     title: message?.chat?.chatName,
                //     description: `${message?.sender?.name}=> ${message?.content}`,
                //     status: 'success',
                //     duration: 2000,
                //     position: 'top'
                //     // isClosable: true,
                // }) :
                // notsame && !(message?.chat?.isGroupChat) && message?.content && toast({
                notsame && message?.content && toast({
                    title: message?.sender?.name,
                    description: message?.content,
                    status: 'success',
                    duration: 2000,
                    position: 'top'
                    // isClosable: true,
                })
                setTimeout(() => {
                    setNotSame(false)
                }, 500);
            } else {
                setMessages([...messages, message]);
            }
        })
    })

    return (<>
        {selectedChat ? <Box w='100%' h='100%' overflowY={'scroll'}>

            {loading ?
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner speed='300ms' color='aqua' w='20' h='20' />
                </div> :
                <Box width={'100%'} min-height={'100vh'} display={'flex'} flexDir={'column'} overflowY={'scroll'} mb={'10px'} justifyContent={'flex-end'}>
                    {messages?.map((item, ind) => {
                        var date = new Date(item.createdAt);
                        var prevDate = new Date(messages[ind !== 0 && ind - 1]?.createdAt);
                        const prevMonth = prevDate.toLocaleString('default', { month: 'short' });
                        const prevYear = prevDate.toLocaleString('default', { year: 'numeric' });
                        const prevDay = prevDate.getDate() + " " + prevMonth + " " + prevYear;

                        const time = formatAMPM(date);
                        const month = date.toLocaleString('default', { month: 'short' });
                        const year = date.toLocaleString('default', { year: 'numeric' });
                        const day = date.getDate() + " " + month + " " + year;

                        const senderId = item?.sender?._id;
                        const userId = user.loggedInUser._id;
                        return (
                            <React.Fragment key={ind}>
                                {(prevDay !== day || ind === 0) && <DateForChat dateforMessage={day} />}
                                {
                                    (senderId === userId) ?
                                        <Box display={'flex'} ms='20%' flexDir={'row'} mt='10px' me={'10px'} alignSelf={'flex-end'} wordBreak={'break-word'} overflow={'hidden'}>
                                            <Box p='3' borderRadius={'lg'} ms={'5px'} me='5px' color={'white'} bg='Highlight'>
                                                <Text>{item?.content}</Text>
                                                <Text fontWeight={'600'} textAlign={'end'}>{time}</Text>
                                            </Box>
                                            <Tooltip label={'You'} >
                                                <Avatar src={item?.sender?.pic?.url} />
                                            </Tooltip>
                                            <div ref={scrollRef}></div>
                                        </Box>
                                        :
                                        <Box display={'flex'} flexDir={'row'} mt='10px' ms={'10px'} me='100px' wordBreak={'break-word'} overflow={'hidden'} >
                                            <Tooltip label={item?.sender?.name}>
                                                <Avatar src={item?.sender?.pic?.url} />
                                            </Tooltip>
                                            <Box p='3' borderRadius={'lg'} color={'white'} ms={'5px'} me='5px' bg={'deepskyblue'}>
                                                <Text>{item?.content}</Text>
                                                <Text fontWeight={'600'} textAlign={'end'}>{time}</Text>
                                            </Box>
                                            <div ref={scrollRef}></div>
                                        </Box>
                                }
                                {ind === messages.length - 1 && typing &&
                                    <div id="wave">
                                        <span className="dot one"></span>
                                        <span className="dot two"></span>
                                        <span className="dot three"></span>
                                    </div >}
                                <div ref={scrollRef}></div>

                            </React.Fragment>
                        )
                    })}

                </Box>
            }
        </Box > :
            <Box w='100%' h='100%' width='100%' display='flex' flexDirection='column' height='100%' alignItems='center' justifyContent='center'>
                <Text fontSize={'23px'}>Click on A User to Start Chat</Text>
            </Box>
        }
        {!loading && selectedChat && <FormControl position={'sticky'} px={'10px'} pb='10px' >
            <Textarea placeholder='Type Your Message' value={newMessage} variant={'filled'} onChange={typingHandler} onKeyDown={sendMessage} />
        </FormControl>
        }
    </>
    )
}

export default SingleChat


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}