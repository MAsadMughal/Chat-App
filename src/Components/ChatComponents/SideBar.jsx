import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Skeleton, Spinner, Stack, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import UserContext from '../../context/User/UserContext';
import ShowToast from '../../toast/toast';
import ProfileModal from './ProfileModal';
import SearchComponent from './SearchComponent';
import ChatContext from '../../context/Chat/ChatContext';

const SideBar = ({ logout }) => {
    const toast = useToast();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const { user } = useContext(UserContext);
    const { setChats, fetchAllChats } = useContext(ChatContext);
    const { isOpen, onOpen, onClose } = useDisclosure()


    const searchChats = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/allUsers?search=${search}`, { withCredentials: true })
            setSearchResult(data);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            ShowToast(toast, 'Error', error?.response?.data?.message, 'error');
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/accessChat`, { userId }, { withCredentials: true })
            await fetchAllChats();
            setLoadingChat(false)
            onClose();
        } catch (error) {
            setLoadingChat(false)
            ShowToast(toast, 'Error', error?.response?.data?.message, 'error');
        }
    }
    
    return (
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} bg="white" w="100%" p="5px 10px 5px 10px" borderWidth={"1.5px"}>
            <Tooltip label="Search users to have a chat." hasArrow placement='bottom-end'>
                <Button onClick={onOpen} variant={"ghost"}>
                    <SearchIcon />
                    <Text display={{ base: "none", md: "flex" }} px='4'> Search Users</Text>
                </Button>
            </Tooltip>
            <Text fontSize={'2xl'}><b>Chat UP!!</b>
            </Text>
            <div>
                <Menu>
                    <MenuButton>
                        {/* //BellICON */}
                    </MenuButton>
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar size='sm' cursor={"pointer"} name={user?.loggedInUser?.name} src={user?.loggedInUser?.pic?.public_id !== 'no public_id' && user?.loggedInUser?.pic?.url} />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user.loggedInUser}>
                            <MenuItem>Profile</MenuItem>
                        </ProfileModal>
                        <Divider />
                        <MenuItem onClick={async () => await logout()}>Logout</MenuItem>
                        {/* <MenuItem></MenuItem> */}
                    </MenuList>
                </Menu>




                <Drawer isOpen={isOpen} placement='left' onClose={onClose} >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerHeader>Search Users</DrawerHeader>

                        <DrawerBody padding={'10px'}>
                            <Box display={'flex'} flexDirection={'row'} alignItems='center' >
                                <Input onChange={(e) => setSearch(e.target.value)} placeholder='Search here...' />
                                <Button onClick={searchChats} ms={'10px'}>Go</Button>
                            </Box>
                            {/* {searchResult} */}
                            <br />
                            {loadingChat ? <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '20vh', alignItems: 'center', justifyContent: 'center' }}>
                                <Spinner />
                            </div> : <>
                                {loading ? <>
                                    <Stack>
                                        <Skeleton borderRadius={'10px'} height={'60px'} />
                                        <Skeleton borderRadius={'10px'} height={'60px'} />
                                        <Skeleton borderRadius={'10px'} height={'60px'} />
                                        <Skeleton borderRadius={'10px'} height={'60px'} />
                                        <Skeleton borderRadius={'10px'} height={'60px'} />
                                        <Skeleton borderRadius={'10px'} height={'60px'} />
                                        <Skeleton borderRadius={'10px'} height={'60px'} />
                                    </Stack>
                                </> :
                                    searchResult?.map((item, key) => {
                                        return (
                                            <SearchComponent key={key} accessChat={accessChat} item={item} />
                                        )
                                    })}
                            </>}
                        </DrawerBody>

                    </DrawerContent>
                </Drawer>
            </div>
        </Box>)
}

export default SideBar