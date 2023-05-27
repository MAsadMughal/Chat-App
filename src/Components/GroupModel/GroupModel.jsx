import { Button, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, FormControl, Input, Stack, Box, useToast, Spinner } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import axios from 'axios';
import GroupSearchComponent from './GroupSearchComponent';
import { CloseIcon } from '@chakra-ui/icons';
import ShowToast from '../../toast/toast';
import ChatContext from '../../context/Chat/ChatContext';

const GroupModel = ({ children }) => {
    const [searched, setSearched] = useState([]);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState([]);
    const [chatName, setChatName] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { fetchAllChats } = useContext(ChatContext)
    const searchUsers = async (e) => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/allUsers?search=${e.target.value}`, { withCredentials: true })
        console.log(data)
        setSearched(data);
    }
    const addToList = (addition) => {
        if (!added.some((item) => item._id === addition._id)) {
            setAdded([...added, addition])
        }
    }
    const removeFromList = async (deletion) => {
        const updatedItems = added.filter((item) => item._id !== deletion._id);
        setAdded(updatedItems);
    }
    const toast = useToast()
    const createGroup = async () => {
        if (!chatName) {
            ShowToast(toast, 'Error', 'Please Enter Your Group Name', 'error');
            return;
        } if (added.length <= 1) {
            ShowToast(toast, 'Error', 'Add At Least two members.', 'error');
            return;
        }

        const users = added.map((item) => item._id)
        try {
            setLoading(true)
            await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/createGroup`, { users, chatName }, { withCredentials: true });
            await fetchAllChats()
            setChatName('')
            setAdded([]);
            onClose();
            setLoading(false)
        } catch (error) {
            setLoading(false)
            ShowToast(toast, 'Error', error?.response?.data?.message, 'error');
        }


    }
    return (
        <>
            {children ? <span onClick={onOpen}>{children}</span> : <MenuItem>User Details</MenuItem>}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent transition={'all 0.2s ease'}>
                    <ModalHeader>
                        Create Group
                    </ModalHeader>
                    <ModalCloseButton />

                    {loading ? <Spinner /> : <ModalBody paddingBottom={'30px'} display={'flex'} flexDirection={"column"} justifyContent={'space-evenly'} alignItems={'center'}>
                        <FormControl>
                            <Input type='text' onChange={(e) => setChatName(e.target.value)} value={chatName} placeholder='Group Name' />
                        </FormControl>
                        <FormControl>
                            <Input type='text' mt={'10px'} onChange={searchUsers} placeholder='Add users' />
                        </FormControl>
                        <Box display='flex' flexDirection='row' flexWrap={'wrap'} w='100%' alignItems={'center'} mt='20px' >
                            {added?.map((item, ind) => {
                                return (
                                    <Box transition='all 0.2s ease' key={ind} textAlign={'center'} mt={'5px'} background={'deepskyblue'} me={'5px'} color={'white'} borderRadius={'5px'} p={'10px'} fontSize={'12px'}>{item?.name} &nbsp;&nbsp;&nbsp;<CloseIcon onClick={() => { removeFromList(item) }} cursor={'pointer'} /></Box>
                                )
                            })}
                        </Box>
                        <Stack mt={'20px'} w='100%'>
                            {searched?.map((i) => {
                                return (<>
                                    {!added?.some((item) => item._id === i._id) && <GroupSearchComponent add={addToList} item={i} />}
                                </>
                                )
                            })
                            }
                        </Stack>

                        <Button onClick={createGroup} background={'deepskyblue'} color={'white'} _hover={{ background: 'cyan', color: 'white' }} alignSelf={'end'} mt={'30px'}>Create Chat</Button>
                    </ModalBody>}
                </ModalContent>
            </Modal ></>
    )
}

export default GroupModel