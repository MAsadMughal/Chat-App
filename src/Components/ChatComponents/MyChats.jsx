import { Box, Button, Skeleton, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react'
import ShowToast from '../../toast/toast';
import axios from 'axios';
import ChatContext from '../../context/Chat/ChatContext';
import { AddIcon } from '@chakra-ui/icons';
import UserContext from '../../context/User/UserContext';
import GroupModel from '../GroupModel/GroupModel';

const MyChats = () => {
  const { loading,  selectedChat, setSelectedChat, chats,  fetchAllChats } = useContext(ChatContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchAllChats();
  }, [])

  return (
    <Box borderRadius={'lg'} borderWidth={'1px'} width={{ base: '100%', md: '31%' }} display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }} flexDirection={'column'} p='3' bg={'white'}>
      <Box display={'flex'} flexDirection={'row'} flexWrap={'nowrap'} alignItems={'center'} justifyContent={'space-between'}>
        <Text fontSize={{ base: '20px', md: '21px', lg: '25px', xl: '28px' }}>My Chats</Text>
        <GroupModel>
          <Button><Text fontSize={{ base: '12px', md: '13px', lg: '15px', xl: '15px' }}>New Group</Text>&nbsp;&nbsp;<AddIcon /></Button>
        </GroupModel>
      </Box>

      {loading ? <Stack>
        <Skeleton borderRadius={'10px'} height={'60px'} />
        <Skeleton borderRadius={'10px'} height={'60px'} />
        <Skeleton borderRadius={'10px'} height={'60px'} />
        <Skeleton borderRadius={'10px'} height={'60px'} />
        <Skeleton borderRadius={'10px'} height={'60px'} />
      </Stack> : <Box display={'flex'} flexDir={'column'} p={'3'} mt={'20px'} background={'#f8f8f8'} h='100%' w='100%' borderRadius={'lg'} overflowY={'scroll'} >
        {chats?.map((item, ind) => {
          return (<Box transition={'all 0.3s ease'} mt={'10px'} w={'100%'} onClick={() => setSelectedChat(item)} cursor={'pointer'}
            bg={selectedChat?._id === item?._id ? '#38B2AC' : '#E8E8E8'}
            color={selectedChat?._id === item?._id ? 'white' : null}
            px='3' py='3' borderRadius={'lg'} key={item?._id}>
            <Text>
              {item?.isGroupChat ? item?.chatName : (item?.users[0]?._id === user.loggedInUser._id ? item?.users[1]?.name : item?.users[0]?.name)}
            </Text>
          </Box>)
        })}

      </Box>}
    </Box >
  )
}

export default MyChats