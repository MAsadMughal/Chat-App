import { Avatar, Box, Button, Text } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import ChatContext from '../../context/Chat/ChatContext'
import { ArrowBackIcon } from '@chakra-ui/icons';
import UserContext from '../../context/User/UserContext';
import ProfileModal from './ProfileModal';
import EditGroupModel from '../GroupModel/EditGroupModel';
import SingleChat from './SingleChat';

const ChatBox = () => {
  const { selectedChat, setSelectedChat, currentChatUser } = useContext(ChatContext);
  const { user } = useContext(UserContext);

  return (

    <Box bg={'white'} borderRadius={'lg'} borderWidth={'1px'} display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }} w={{ base: '100%', md: '68%' }} flexDirection={'column'} flexWrap={'nowrap'} justifyContent={'space-between'} >
      <Box display={'flex'} boxShadow={'md'} flexDirection={'row'} flexWrap={'nowrap'} p={selectedChat && '10px'} borderBottomRadius={'20px'} w='100%' alignItems={'center'} justifyContent={'space-between'}>
        <Button onClick={() => { setSelectedChat("") }} display={{ base: 'flex', md: 'none' }}>
          <ArrowBackIcon cursor={'pointer'} fontSize={{ base: '20px', md: '30px' }} />
        </Button>
        {!selectedChat?.isGroupChat && <Text fontSize={{ base: '20px', md: '21px', lg: '25px', xl: '28px' }}>{currentChatUser?.name}</Text>}
        {selectedChat?.isGroupChat && <Text fontSize={{ base: '20px', md: '21px', lg: '25px', xl: '28px' }}>{selectedChat?.chatName}</Text>}

        {selectedChat && !selectedChat?.isGroupChat ? <ProfileModal user={currentChatUser}>
          <Avatar cursor={'pointer'} src={currentChatUser?.pic?.public_id !== 'no public_id' && currentChatUser?.pic?.url} name={currentChatUser?.name} />
        </ProfileModal>
          : null}
        {selectedChat?.isGroupChat && <EditGroupModel chat={selectedChat}>
          <Avatar cursor={'pointer'} src={selectedChat?.groupAdmin?.pic?.url} /></EditGroupModel>
        }
      </Box>
      <SingleChat />
    </Box>
  )
}

export default ChatBox