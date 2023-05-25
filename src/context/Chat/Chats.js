import React, { useState, useEffect } from 'react'
import ChatContext from './ChatContext';

const Chats = (props) => {

    let [loading, setLoading] = useState(false)







    return (
        <ChatContext.Provider value={{ loading, setLoading }}>{props.children}</ChatContext.Provider>
    )
}

export default Chats