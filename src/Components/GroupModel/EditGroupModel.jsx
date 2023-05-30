import { Button, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, FormControl, Input, Stack, Box, useToast, Spinner, Text, ModalFooter } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import axios from 'axios';
import GroupSearchComponent from './GroupSearchComponent';
import { CloseIcon } from '@chakra-ui/icons';
import ShowToast from '../../toast/toast';
import ChatContext from '../../context/Chat/ChatContext';
import UserContext from '../../context/User/UserContext';
import ProfileModal from '../ChatComponents/ProfileModal';
import AddMember from './AddMember';

const EditGroupModel = ({ children, chat }) => {
    const [searched, setSearched] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatName, setChatName] = useState(chat?.chatName);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { fetchAllChats, setSelectedChat } = useContext(ChatContext)
    const { user } = useContext(UserContext)
    const searchUsers = async (e) => {
        if (e.target.value) {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/allUsers?search=${e.target.value}`, { withCredentials: true })
            setSearched(data);
        } else {
            setSearched([]);
        }
    }
    const changeName = async () => {
        if (chatName !== chat?.chatName) {
            setLoading(true)
            const groupId = chat?._id;
            try {
                setLoading(true)
                const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/renamegroup`, { groupId, chatName }, { withCredentials: true })
                await fetchAllChats();
                setSelectedChat(data);
                setLoading(false)
                onClose()
            } catch (error) {
                ShowToast(toast, 'Error', error.response.data.message, 'error');
                setLoading(false)
            }
        }
    }

    //Add New Member
    const addToList = async (addition) => {
        setLoading(true)
        const groupId = chat?._id;
        try {
            setLoading(true)
            const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/addtoGroup`, { groupId, userId: addition }, { withCredentials: true })
            await fetchAllChats();
            setSelectedChat(data);
            setSearched([]);
            setLoading(false)
        } catch (error) {
            ShowToast(toast, 'Error', error.response.data.message, 'error');
            setLoading(false)
        }
    }

    //Remove From List
    const removeFromList = async (deletion) => {
        setLoading(true)
        const groupId = chat?._id;
        try {
            setLoading(true)
            const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/removeFromGroup`, { groupId, userId: deletion }, { withCredentials: true })
            await fetchAllChats();
            setSelectedChat(data);
            setLoading(false)
        } catch (error) {
            ShowToast(toast, 'Error', error.response.data.message, 'error');
            setLoading(false)
        }
    }

    const deleteGroup = async () => {
        setLoading(true)
        const groupId = chat?._id;
        try {
            setLoading(true)
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/removeGroup/${groupId}`, { withCredentials: true })
            await fetchAllChats();
            setSelectedChat("");
            setLoading(false)
        } catch (error) {
            ShowToast(toast, 'Error', error.response.data.message, 'error');
            setLoading(false)
        }
    }


    const toast = useToast()

    return (
        <>
            {children ? <span onClick={onOpen}>{children}</span> : <MenuItem>User Details</MenuItem>}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent transition={'all 0.2s ease'}>
                    <ModalHeader>
                        Group Details
                    </ModalHeader>
                    <ModalCloseButton />

                    {loading ? <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '20vh', alignItems: 'center', justifyContent: 'center' }}>
                        <Spinner />
                    </div> :
                        <ModalBody paddingBottom={'30px'} display={'flex'} flexDirection={"column"} justifyContent={'space-evenly'} alignItems={'center'}>
                            <FormControl display={'flex'} alignItems={'center'} justifyContent={'center'} flexDir={'row'}>
                                <Input type='text' disabled={user?.loggedInUser?._id !== chat?.groupAdmin?._id} onChange={(e) => setChatName(e.target.value)} value={chatName} placeholder='Group Name' />
                                {user?.loggedInUser?._id === chat?.groupAdmin?._id && <Button ms={'10px'} _hover={{ background: 'cyan', color: 'white' }} onClick={changeName} value={chatName}>Update</Button>}
                            </FormControl>
                            {user?.loggedInUser?._id === chat?.groupAdmin?._id && <FormControl>
                                <Input type='text' mt={'10px'} onChange={searchUsers} placeholder='Add users' />
                            </FormControl>}


                            {(!searched.length >= 1 && chat?.users?.length >= 1) && <Text fontSize={'20px'} mt={'10px'}>Group Members {`(${chat?.users?.length})`}</Text>}
                            <Box display='flex' flexDirection='row' flexWrap={'wrap'} w='100%' alignItems={'center'} mt='20px' >
                                {!searched.length >= 1 && chat?.users?.map((item, ind) => {
                                    return (
                                        <Box w={'100%'} transition='all 0.2s ease' key={ind} cursor={user?.loggedInUser?._id !== chat?.groupAdmin?._id ? 'pointer' : 'null'} textAlign={'center'} alignItems={'center'} mt={'5px'} display={'flex'} flexDirection={'row'} justifyContent={user?.loggedInUser?._id === chat?.groupAdmin?._id ? 'space-between' : 'center'} background={'deepskyblue'} me={'5px'} color={'white'} borderRadius={'5px'} p={'10px'} fontSize={'12px'}>
                                            <ProfileModal user={item}>
                                                <Text fontSize='15px' cursor={'pointer'} >
                                                    {item?._id === user?.loggedInUser?._id ? `You` : item?.name}{item?._id === chat?.groupAdmin?._id && '(Admin)'}
                                                </Text> </ProfileModal>
                                            {user?.loggedInUser?._id === chat?.groupAdmin?._id && <CloseIcon ms={'5px'} onClick={() => { removeFromList(item._id) }} cursor={'pointer'} />}</Box>
                                    )
                                })}
                            </Box>



                            {searched?.length >= 1 && <Text fontSize={'20px'} mt={'10px'}>Search List</Text>}
                            <Stack mt={'20px'} w='100%'>
                                {searched?.map((i) => {
                                    // console.log(i);
                                    console.log(chat?.users?.some((item) => item._id === i._id));
                                    return (<>
                                        {!chat?.users?.some((item) => item._id === i._id) && <AddMember add={addToList} item={i} />}
                                    </>
                                    )
                                })
                                }
                            </Stack>

                        </ModalBody>}
                    <ModalFooter>
                        {user?.loggedInUser?._id === chat?.groupAdmin?._id && <Button width={'100%'} ms={'10px'} _hover={{ background: 'red', color: 'white' }} onClick={deleteGroup}>Delete Group</Button>}
                    </ModalFooter>
                </ModalContent>
            </Modal ></>
    )
}

export default EditGroupModel