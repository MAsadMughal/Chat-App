import React, { useContext, useEffect, useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import ShowToast from '../../toast/toast'
import axios from 'axios'
import Loader from '../../Loader/Loader'
import UserContext from '../../context/User/UserContext'

const Signup = () => {
    const toast = useToast()
    const [show, setShow] = useState(false)
    const [showr, setShowR] = useState(false)
    const { loading, setLoading, getUserDetails } = useContext(UserContext)
    const [img, setImg] = useState("")
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
        repassword: "",
        pic: ""
    })
    const { name, email, password, pic, repassword } = userDetails;
    useEffect(() => {
        if (img) {
            let reader = new FileReader();
            reader.onloadend = () => {
                setUserDetails((prevValue) => ({
                    ...prevValue,
                    pic: reader.result,
                }));
            };
            reader.readAsDataURL(img);
        }
    }, [img]);

    const handleInput = (e) => {
        setUserDetails((prevVal) => ({
            ...prevVal,
            [e.target.name]: e.target.value
        }))
    }

    const handleImage = (e) => {
        setImg(e.target.files[0]);
    }

    const signup = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            ShowToast(toast, "Error", "Fill all the Fields!", "error");
        } else if (password !== repassword) {
            ShowToast(toast, "Error", "Passwords Don't Match!", "error");
        }
        else {
            try {
                setLoading(true)
                await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/signup`, { name, email, password, pic: pic ? pic : null }, { withCredentials: true })
                await getUserDetails();
                setLoading(false)
            } catch (error) {
                setLoading(false)
                ShowToast(toast, "Error", error?.response?.data?.message, "error");
            }
        }
    }

    return (
        <VStack spacing="5px">
            {loading ? <Loader /> : <>
                <FormControl id="name">
                    <FormLabel>Name</FormLabel>
                    <Input onChange={handleInput} name="name" value={name} placeholder='Enter Your Name' />
                </FormControl>
                <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input onChange={handleInput} name="email" value={email} placeholder='Enter Your Email' />
                </FormControl>
                <FormControl id="password" >
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input onChange={handleInput} name="password" value={password} type={show ? 'text' : 'password'} placeholder='Enter Your Password' />
                        <InputRightElement width={"4.5rem"}><Button size='sm' onClick={() => { setShow(!show) }} h='1.5rem' marginRight={"5px"}>{show ? `Hide` : `Show`}</Button></InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl id="re-password" >
                    <FormLabel>Repeat Password</FormLabel>
                    <InputGroup>
                        <Input onChange={handleInput} name="repassword" value={repassword} type={showr ? 'text' : 'password'} placeholder='Repeat Password' />
                        <InputRightElement width={"4.5rem"}><Button size='sm' onClick={() => { setShowR(!showr) }} h='1.5rem' marginRight={"5px"}>{showr ? `Hide` : `Show`}</Button></InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl id="pic" style={{ marginBottom: "5px" }} >
                    <FormLabel>Photo (Optional)</FormLabel>
                    <Input onChange={handleImage} name="pic" type='file' p='1' accept='image/*' placeholder='Choose File' />
                </FormControl>
                <img width="200px" alt="" src={pic && pic} />
                <Button onClick={signup} colorScheme='blue' w='100%' style={{ marginTop: "15px" }} color="white">Register</Button>
            </>}
        </VStack>
    )
}

export default Signup