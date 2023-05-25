import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import ShowToast from '../../toast/toast'
import axios from 'axios'
import Loader from '../../Loader/Loader'
import UserContext from '../../context/User/UserContext'


const Login = () => {
  const toast = useToast();
  const [show, setShow] = useState(false)
  const { loading, setLoading, getUserDetails } = useContext(UserContext)

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  })
  const handleInput = (e) => {
    setLoginDetails((prevVal) => ({
      ...prevVal,
      [e.target.name]: e.target.value
    }))
  }
  const { email, password } = loginDetails;

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      ShowToast(toast, "Error", "Fill all the Fields!", "error");
    }
    else {
      try {
        setLoading(true)
        await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/login`, { email, password }, { withCredentials: true })
        await getUserDetails()
        setLoading(false)
      } catch (error) {
        setLoading(false)
        ShowToast(toast, "Error", error?.response?.data?.message, "error");
      }
    }
  }



  return (
    <VStack spacing="5px">{loading ? <Loader /> : <>
      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input onChange={handleInput} name="email" value={email} placeholder='Enter Your Email' />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input onChange={handleInput} name="password" value={password} type={show ? 'text' : 'password'} placeholder='Enter Your Password' />
          <InputRightElement width={"4.5rem"}><Button size='sm' onClick={() => { setShow(!show) }} h='1.5rem' marginRight={"5px"}>{show ? `Hide` : `Show`}</Button></InputRightElement>
        </InputGroup>
      </FormControl>
      <Button onClick={login} colorScheme='blue' w='100%' style={{ marginTop: "15px" }} color="white">Login</Button>
    </>}
    </VStack>
  )
}

export default Login