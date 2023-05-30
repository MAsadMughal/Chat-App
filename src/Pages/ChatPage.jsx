import React, { useContext } from 'react'
import UserContext from '../context/User/UserContext'
import { Box, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from '../Components/ChatComponents/SideBar';
import MyChats from '../Components/ChatComponents/MyChats';
import ChatBox from '../Components/ChatComponents/ChatBox';
import ChatContext from '../context/Chat/ChatContext';

const ChatPage = () => {
    const { user, getUserDetails } = useContext(UserContext);
    const {loading}=useContext(ChatContext)
    const Navigate = useNavigate()

    const logout = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/logout`, { withCredentials: true })
        await getUserDetails();
        Navigate('/');
        window.location.reload();
    }

 
    return (
        <div style={{ width: '100%' }}>
            {user?.success && <SideBar logout={logout} />}
            <Box display={"flex"} justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user?.success && <MyChats />}
                {user?.success && <ChatBox />}
            </Box>
        </div>
    )
}

export default ChatPage