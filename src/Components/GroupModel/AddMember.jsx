import { Avatar, Box, Button, Text } from '@chakra-ui/react'
import React from 'react'
import './ChatComponent.css'
import { AddIcon, } from '@chakra-ui/icons'

const AddMember = ({ item, add }) => {
    return (
        <Box transition={'all 0.3s ease'} display='flex' background={'ButtonFace'} className='searchComponent' justifyContent={'space-around'} alignItems='center' mb={'5px'} padding={'10px'} width={"100%"} borderRadius={'10px'} flexDirection='row'>
            <Avatar size='md' name={item?.name} src={item?.pic?.public_id !== 'no public_id' && item?.pic?.url} />
            <Box ms={'20px'} display='flex' flexDirection='column'>
                <Text>{item?.name}</Text>
                <Text><b>Email: </b>{item?.email}</Text>
            </Box>
            <Button onClick={() => add(item._id)} display='flex' flexDirection='column'>
                <AddIcon />
            </Button>
        </Box>
    )
}

export default AddMember