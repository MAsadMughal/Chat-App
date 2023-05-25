import React, { useState, useEffect } from 'react'
import axios from 'axios';
import UserContext from "./UserContext";

const User = (props) => {

    let [user, setUser] = useState({})
    let [loading, setLoading] = useState(false)

    useEffect(() => {
        getUserDetails();
    }, [])


    const getUserDetails = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/me`, { withCredentials: true });
            setUser(data);
            setLoading(false)
        } catch (e) {
            setLoading(false)
            // setError('');
        }
    }





    return (
        <UserContext.Provider value={{ user, getUserDetails, loading, setLoading }}>{props.children}</UserContext.Provider>
    )
}

export default User