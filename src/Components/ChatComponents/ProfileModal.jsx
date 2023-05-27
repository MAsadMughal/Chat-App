import React, { useContext } from 'react'
import { Button, Image, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import UserContext from '../../context/User/UserContext';


const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            {children ? <span onClick={onOpen}>{children}</span> : <MenuItem>User Details</MenuItem>}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Profile Details
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody paddingBottom={'30px'} display={'flex'} flexDirection={"column"} justifyContent={'space-evenly'} alignItems={'center'}>
                        <Image src={user?.pic?.url} borderRadius={'50%'} height={"20vh"} />
                        <Text fontSize={'30px'} fontFamily={'sans-serif'}>{user?.name} </Text>
                        <Text fontSize={'20px'} fontFamily={'sans-serif'}>{user?.email} </Text>
                        <Button onClick={onClose} alignSelf={'end'} mt={'30px'}>close</Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>

    )
}

export default ProfileModal