import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import Avatar from "../../assets/avatar.svg";
import Logo from "../../assets/Chat-Logo.png";
import Input from "../../components/Input/Input.js";
import Button from "../../components/Button/Button.js";

import { ReactComponent as EmojiIcon } from "../../assets/emoji-icon.svg";


function Dashboard() {
    const navigate = useNavigate();

    const [user] = useState(JSON.parse(localStorage.getItem('user:detail')));
    

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const [filteredConversations, setFilteredConversations] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchContact, setSearchContact] = useState('');

    const [isPickerVisible, setPickerVisible] = useState(false);

    const [showMessages, setShowMessages] = useState(false);
    const [showContacts, setShowContacts] = useState(false);
    
    const messageRef = useRef(null);

    useEffect(() => {
        setSocket(io(process.env.REACT_APP_SOCKET_URL));
    }, []);

    useEffect(() => {
        socket?.emit('addUser', user?.id);
        socket?.on('getUsers', users => {
            // console.log('activeUsers :>> ', users);
        });

        socket?.on('getMessage', data => {
            setMessages(prev => ({
                ...prev,
                messages: [...prev.messages, { user: data.user, message: data.message }]
            }));
        });
    }, [socket, user?.id]);

    useEffect(() => {
        messageRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages?.messages]);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user:detail'));
        const fetchConversations = async () => {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/conversations/${loggedInUser?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const resData = await res.json();
            setConversations(resData);
            setFilteredConversations(resData);
        };
        fetchConversations();   
    }, [users]);

    useEffect(() => {
        async function fetchUsers() {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${user?.id}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
            },
            });
            const resData = await res.json();
            setUsers(resData);
            setFilteredContacts(resData);
        }
        fetchUsers();
    }, [user?.id]);

    function signOut() {
        localStorage.removeItem('user:token');
        localStorage.removeItem('user:detail');
        navigate('/users/login');
    }

    async function fetchMessages(conversationId, receiver) {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const resData = await res.json();
        setMessages({ messages: resData, receiver, conversationId });
    }


    async function sendMessage(e) {
        socket?.emit('sendMessage', {
            senderId: user?.id,
            receiverId: messages?.receiver?.receiverId,
            message,
            conversationId: messages?.conversationId
        });

        await fetch(`${process.env.REACT_APP_API_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversationId: messages?.conversationId,
                senderId: user?.id,
                message,
                receiverId: messages?.receiver?.receiverId 
            })
        });
        setMessage('');
    }

    function handleSearchInputChange(e) {
        const value = e.target.value.toLowerCase();
        setSearchInput(value);

        const filtered = conversations.filter(({ user }) => 
            user.fullName.toLowerCase().includes(value) || 
            user.email.toLowerCase().includes(value)
        );

        setFilteredConversations(filtered);
    }

    function handleSearchContactChange(e) {
        const value = e.target.value.toLowerCase();
        setSearchContact(value);

        const filtered = users.filter(({ user }) => 
            user.fullName.toLowerCase().includes(value) || 
            user.email.toLowerCase().includes(value)
        );

        setFilteredContacts(filtered);
    }


    return (
        <div className="w-screen flex">


{/* ---------------- */}
{/* CONVERSATIONS */}
{/* ---------------- */}


            <div className={`w-[100%] h-screen bg-[#202020] overflow-y-scroll overflow-x-hidden
                ${showContacts ? 'xs:hidden' : 'block xs:w-[100%] md:w-[35%] lg:w-[30%] 2xl:w-[25%]'}
                ${showMessages ? 'xs:hidden md:block' : ''}`}>
          
                <div className="mt-6 pl-6 flex items-center xs:mt-6 xs:pl-6">
                    <img 
                        src={Logo} 
                        alt="Logo"
                        className="w-12 h-12 xs:w-12 xs:h-12"
                        />
                    <div className="text-4xl ml-4 text-gray-100 font-semibold xs:ml-4 xs:text-4xl">ChatWave</div>
                </div>

                <div className="relative mt-8 mb-4 px-6 w-full xs:mt-8 xs:mb-4 xs:px-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute left-10 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" stroke="gray" />
                        <path d="M21 21l-6 -6" stroke="gray" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        className="w-full pl-10 h-10 p-4 placeholder-[#808080] text-white rounded-2xl bg-[#303030] focus:border-gray-300 focus:ring-0 outline-none"
                    />
                </div>

                <div className="md:pr-2 mt-0">
                    <div>
                        {filteredConversations.length > 0 ?
                                filteredConversations.map(({ conversationId, user }) => {
                                    return (
                                        <div className="cursor-pointer text-[#ffffff] flex items-center py-4 
                                           hover:bg-[#252525]" 
                                           onClick={() => {
                                                fetchMessages(conversationId, user);
                                                setShowMessages(!showMessages);
                                            }}>
                                            
                                            <div className="flex items-center xs:ml-10 md:ml-6 xl:ml-10">
                                                <div>
                                                    <img 
                                                        src={Avatar} 
                                                        alt="Avatar" 
                                                        className="xs:w-14 xs:h-14 md:w-10 md:w-10 xl:w-14 xl:h-14"    
                                                    />
                                                </div>

                                                <div className="ml-6">
                                                    <h3 className="xs:text-2xl md:text-xl lg:text-2xl font-medium">{user?.fullName}</h3>
                                                    <p className="xs:text-md md:text-sm lg:text-lg font-light text-[#a5a5a5]">{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                );
                            }) : <div className='text-center text-lg font-normal mt-24 text-white'>No Conversations Found</div>
                        }
     
                    </div>
                </div>
                <div className="relative bottom-0 right-0">
                    <button 
                        className="absolute bg-blue-600 rounded-full flex items-center justify-center 
                            text-white shadow-lg w-16 h-16 top-144 right-4 2xl:hidden"
                        onClick={() => setShowContacts(!showContacts)}>
                        <svg  
                            xmlns="http://www.w3.org/2000/svg"  
                            width="26"  
                            height="26"  
                            viewBox="0 0 24 24"  
                            fill="none"  
                            stroke="currentColor"  
                            stroke-width="2"  
                            stroke-linecap="round"  
                            stroke-linejoin="round"  
                            class="icon icon-tabler icons-tabler-outline icon-tabler-message-circle-plus">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12.007 19.98a9.869 9.869 0 0 1 -4.307 -.98l-4.7 1l1.3 
                            -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 
                            -2.296 11.845 .48c1.992 1.7 2.93 4.04 2.747 6.34" />
                            <path d="M16 19h6" />
                            <path d="M19 16v6" />
                        </svg>  
                    </button>
                </div>
                
            </div>


{/* ---------------- */}
{/* MESSAGES */}
{/* ---------------- */}


            <div className={`h-screen bg-[#131313] flex-col items-center
                ${showContacts ? 'xs:hidden' : ''}
                ${showMessages ? 'flex xs:w-[100%]' : 'xs:hidden'}
                md:flex md:w-[65%] lg:w-[70%] 2xl:w-[55%]'}`}>


                {messages?.receiver?.fullName &&                
                    <div className="flex items-center w-[100%] px-5 py-4 border-b border-b-0.5 border-b-[#353535] md:px-10 md:py-4">
                        <button className="mr-5 md:hidden" onClick={() => setShowMessages(!showMessages)}>
                            <svg  
                                xmlns="http://www.w3.org/2000/svg"  
                                width="32"  
                                height="32"  
                                viewBox="0 0 24 24"  
                                fill="none"  
                                stroke="#ffffff"  
                                stroke-width="2" 
                                stroke-linecap="round"  
                                stroke-linejoin="round"  
                                className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M5 12l14 0" />
                                <path d="M5 12l6 6" />
                                <path d="M5 12l6 -6" />
                            </svg>
                        </button>

                        <div className="cursor-pointer">
                            <img
                                src={Avatar}  
                                alt="Avatar"
                                className="w-14 h-14 md:w-14 md:h-14"
                            />
                        </div>

                        <div className="ml-6 mr-auto">
                            <h3 className="text-2xl font-semibold text-white md:text-2xl">{messages?.receiver?.fullName}</h3>
                            <p className="text-md font-normal text-[#a5a5a5] md:text-md">{messages?.receiver?.email}</p>
                        </div>
                    </div>
                }

                <div className="h-[80%] w-full overflow-y-scroll overflow-x-hidden">
                    <div className="p-14">     
                        {messages?.messages?.length > 0 ?
                            messages.messages.map(({ message, user: { id } = {} }) => {                     
                                return (
                                    <>
                                    <div className={`max-w-[90%] md:max-w-[45%] w-fit break-words rounded-2xl px-4 py-3 mb-6 relative
                                        ${id === user?.id ? 'bg-primary rounded-tr-none text-white ml-auto' : 
                                        'bg-[#252525] rounded-tl-none text-white'}`}>
                                        {message}
                                    </div>

                                    <div ref={messageRef}></div>
                                    </>
                                );
                            }) : <div className="flex items-center justify-center h-screen">
                                    <div className="text-center text-lg font-normal items-center justify-center text-white">No messages here yet</div>
                                </div>
                        }
                    </div>
                </div>
                
                {messages?.receiver?.fullName &&
                <div className="w-full flex items-center justify-center">
                    <div className="relative w-full mb-6">
                        <EmojiIcon
                            className="cursor-pointer relative top-10 transform translate-y-0 z-10 xs:left-8 lg:left-10 xl:left-12 md:left-10"
                            onClick={() => setPickerVisible(!isPickerVisible)}/>

                        {isPickerVisible && (
                            <div style={{ position: 'absolute', bottom: '80px', left: '10px', zIndex: 10 }}>
                                <Picker
                                    data={data}
                                    previewPosition="none"
                                    onEmojiSelect={(e) => {
                                        setMessage(prev => prev + e.native);
                                    }}/>
                            </div>
                        )}

                        <Input
                            placeholder="Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="relative z-0"
                            inputClassName="w-[95%] p-4 bg-[#131313] placeholder-[#858585] text-white border-0.5 
                            border-[#404040] focus:border-[#606060] rounded-r-l-4xl focus:ring-0 outline-none 
                            xs:w-[95%] xs:mx-4 xs:pl-12 sm:mx-5 md:mx-6 md:mr-2 md:pl-12 lg:pl-12 xl:mx-8 2xl:mx:-6"
                        />
                    </div>

                    <div className={`p-3 cursor-pointer bg-primary rounded-full
                        hover:bg-[#005FC6] ${!message && "pointer-events-none"} xs:mx-2 sm:mr-3 md:ml-2 lg:ml-0 lg:mx-4 xl:ml-1 `}
                        onClick={() => sendMessage()}>
                        
                        <svg 
                            xmlns="http://www.w3.org/2000/svg"
                            height="20" 
                            width="20"
                            viewBox="0 0 48 48">
                            <path d="M4.02 42l41.98-18-41.98-18-.02 14 30 4-30 4z" fill="white" />
                            <path d="M0 0h48v48h-48z" fill="none" />
                        </svg>
                    </div>
                </div>
            }
            </div>

{/* ---------------- */}
{/* CONTACTS */}
{/* ---------------- */}

            <div className={`h-screen bg-[#202020] px-0 py-4 overflow-y-scroll overflow-x-hidden 
            ${showContacts ? 'block xs:w-[100%] md:w-[35%] lg:w-[30%] xl:w-[30%]' : 'hidden'}
            ${showMessages ? 'xs:hidden 2xl:w-[20%]' : ''}
            2xl:block 2xl:w-[20%]`}>

                
                <div className="w-[100%]">

                    <button className="ml-4 mt-4 2xl:hidden" onClick={() => setShowContacts(!showContacts)}>
                        <svg  
                            xmlns="http://www.w3.org/2000/svg"  
                            width="32"  
                            height="32"  
                            viewBox="0 0 24 24"  
                            fill="none"  
                            stroke="#ffffff"  
                            stroke-width="2" 
                            stroke-linecap="round"  
                            stroke-linejoin="round"  
                            className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M5 12l14 0" />
                            <path d="M5 12l6 6" />
                            <path d="M5 12l6 -6" />
                        </svg>
                    </button>

                    <div className="flex items-center my-0 mx-14 2xl:mt-6">
                        
                        <img 
                            src={Avatar}  
                            alt="Avatar" 
                            className="w-20 h-20 2xl:w-20 2xl:h-20" 
                            />
                        <div className="ml-6">
                            <h3 className="text-2xl font-semibold text-white">{user?.fullName}</h3>
                            <p className="text-md font-normal text-[#a5a5a5]">My Account</p>

                            <Button 
                                label="Logout" 
                                onClick={signOut} 
                                buttonClassName="mt-1 font-semibold text-md hover:text-red-700" />
                        </div>
                    </div>
                </div>

                <div className="relative w-full mt-2 mb-4 xs:mt-8 xs:mb-4 xs:px-6">

                    <svg  
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#808080"
                        strokeWidth="2"
                        strokeLineCap="round"
                        strokeLineJoin="round"
                        className="absolute left-10 top-1/2 transform -translate-y-1/2 pointer-events-non">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />  
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                    </svg>
                    
                    <input
                        type="text"
                        placeholder="Contacts"
                        value={searchContact}
                        onChange={handleSearchContactChange}
                        className="w-full pl-10 h-10 p-4 placeholder-[#808080] text-white rounded-2xl bg-[#303030] focus:border-gray-300 focus:ring-0 outline-none"
                    />
                </div>
                
                <div className="">
                    {
                        filteredContacts.length > 0 ?
                            filteredContacts.map(({ user }) => {
                                return (                                    
                                    <div className="cursor-pointer flex items-center py-4 text-[#ffffff] hover:bg-[#252525]">
                                        <div 
                                            className="cursor-pointer flex items-center ml-7" 
                                            onClick={() => { 
                                                fetchMessages('new', user); 
                                                setShowContacts(!showContacts); 
                                            }}>
                                            <div><img src={Avatar} width={50} height={50} alt="Avatar" /></div>
                                            <div className="ml-6">
                                                <h3 className="text-xl font-semibold">{user?.fullName}</h3>
                                                <p className="text-sm font-normal text-[#a5a5a5] ">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                            )
                        }) : <div className='text-center text-lg font-regular mt-24 text-white'>No Contacts Found</div>
                    }                   
                </div>
            </div>
        </div>
    );
}

export default Dashboard;