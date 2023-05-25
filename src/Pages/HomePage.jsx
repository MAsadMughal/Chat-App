import React from 'react'
import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../Components/auth/Login';
import Signup from '../Components/auth/Signup';

const HomePage = () => {

  return (
    <Container centerContent maxW="xl">
      <Box p={3} maxW="xl" bg="white" textAlign="center" textColor="black" w="100%"
        m="30px 0 15px 0" borderRadius="lg" borderWidth="1px">
        <Text fontSize="4xl">
          CHAT UP!!
        </Text>
      </Box>
      <Box bg="white" w="100%" maxW="xl" p="3" borderRadius="lg" borderWidth="1px" >
        <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList>
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage