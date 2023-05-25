import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
import './ChatComponent.css'

const SearchComponent = ({ item }) => {

    return (
        <Box display='flex' background={'ButtonFace'} className='searchComponent' alignItems='center' mb={'5px'} padding={'10px'} width={"100%"} borderRadius={'10px'} flexDirection='row'>
            <Avatar size='md' src={item?.pic?.url} />
            <Box ms={'20px'} display='flex' flexDirection='column'>
                <Text>{item?.name}</Text>
                <Text><b>Email: </b>{item?.email}</Text>
            </Box>
        </Box>
    )
}

export default SearchComponent