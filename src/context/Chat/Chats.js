import React, { useState, useEffect, useContext } from 'react'
import ChatContext from './ChatContext';
import axios from 'axios';
import UserContext from '../User/UserContext';

const Chats = (props) => {
    const { user } = useContext(UserContext)
    let [loading, setLoading] = useState(false)
    let [selectedChat, setSelectedChat] = useState();
    let [chats, setChats] = useState([])
    let [currentChatUser, setCurrentChatUser] = useState("")


    const fetchAllChats = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/fetchChats`, { withCredentials: true })
            setChats(data);
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (selectedChat && !selectedChat?.isGroupChat) {
            setCurrentChatUser(selectedChat?.users[0]?._id === user?.loggedInUser?._id ? selectedChat?.users[1] : selectedChat?.users[0]);
        } else {
            setCurrentChatUser('')
        }
    }, [selectedChat])





    return (
        <ChatContext.Provider value={{ loading, currentChatUser, setLoading, selectedChat, setSelectedChat, chats, setChats, fetchAllChats }}>{props.children}</ChatContext.Provider>
    )
}

export default Chats