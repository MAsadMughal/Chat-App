import React, { useState, useEffect } from 'react'
import ChatContext from './ChatContext';
import axios from 'axios';

const Chats = (props) => {

    let [loading, setLoading] = useState(false)
    let [selectedChat, setSelectedChat] = useState();
    let [chats, setChats] = useState([])


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




    return (
        <ChatContext.Provider value={{ loading, setLoading, selectedChat, setSelectedChat, chats, setChats, fetchAllChats }}>{props.children}</ChatContext.Provider>
    )
}

export default Chats