import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/Input/Input.js";
import Button from "../../components/Button/Button.js";
import Logo from "../../assets/Chat-Logo.png";

import { ReactComponent as EmailIcon } from "../../assets/email-icon.svg";
import { ReactComponent as UserIcon } from "../../assets/user-icon.svg";
import { ReactComponent as LockIcon } from "../../assets/lock-icon.svg";
import { ReactComponent as EyeIcon } from "../../assets/eye-icon.svg";
import { ReactComponent as EyeOffIcon } from "../../assets/eye-off-icon.svg";


function Form({
    isSignInPage = true,
}) {

    const [showPassword, setShowPassword] = useState(false);

    const[data, setData] = useState({
        ...(!isSignInPage && {
            fullName: ''
        }),
        email: '',
        password: '',
    })

    const navigate = useNavigate();

    async function handleSubmit (e) {

        e.preventDefault();
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/${isSignInPage ? 'login' : 'register'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const contentType = res.headers.get("content-type");

            if (contentType && contentType.indexOf("application/json") !== -1) {
                const resData = await res.json();

                if(res.status === 400) {
                    alert(resData);
                    
                } else if (res.status === 200) {
                    if (resData.token) {
                      localStorage.setItem('user:token', resData.token);
                      localStorage.setItem('user:detail', JSON.stringify(resData.user));
                      navigate('/');

                    } else {
                        console.error("No token found in response", resData);
                    }
                }

            } else {
                const resText = await res.text();
                alert(resText);
                navigate('/');
            }

        } catch (error) {
            console.error("Error during submission:", error);
        } 
    }

    
    function toggleShowPassword() {
        setShowPassword(!showPassword);
    };

    return (
        <div className="bg-[#131313] h-screen flex flex-col items-center justify-center px-8 xs:px-4 sm:px-8 lg:px-4 xl:px-72 2xl:px-96 3xl:px-128 4xl:px-144">
            <div className="bg-[#131313] flex flex-col items-center justify-center xl:flex-row xl:justify-between w-full xl:w-[100%] 2xl:w-[100%]">
                <div className="flex flex-col items-center justify-center mb-4 xs:mb-6 sm:mb-8 lg:mb-10 xl:mb-0 xl:mr-8 3xl:mr-16">
                <img 
                    src={Logo}  
                    alt="Logo"
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-56 xl:h-56 2xl:w-56 2xl:h-56" 
                />
                <div className="text-[20px] text-gray-100 font-semibold sm:mt-2 sm:text-3xl lg:text-4xl xl:text-4xl 2xl:text-4xl 2xl:mt-4">
                    ChatWave
                </div>
                </div>

                <form className="flex flex-col items-center w-full xl:w-auto 2xl:w-auto" onSubmit={(e) => handleSubmit(e)}>
                <div className="text-xl mb-4 font-medium text-white xs:text-2xl xs:mb-6 sm:mb-6 sm:text-2xl lg:text-3xl lg:mb-8 xl:mb-10 2xl:mb-10">
                    {isSignInPage ? 'Hi, Welcome Back!👋' : '🤝Start talking today!'}
                </div>

                {!isSignInPage && (
                    <Input
                    name="name"
                    placeholder="Enter your full name"
                    className="xs:w-[350px] sm:w-[350px] mb-4 w-[250px] lg:w-[400px] xl:w-[420px] 2xl:w-[420px]" 
                    inputClassName="p-4 bg-[#131313] placeholder-[#808080] focus:border-[#808080]
                        focus:ring-0 outline-none text-white pl-10"
                    value={data.fullName}
                    onChange={(e) => setData({ ...data, fullName: e.target.value })}
                    icon={
                        <UserIcon 
                        className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    }
                    />
                )}

                <Input
                    name="email"
                    type='email'
                    placeholder="Enter your email"
                    className="xs:w-[350px] sm:w-[350px] mb-4 w-[250px] lg:w-[400px] xl:w-[420px] 2xl:w-[420px]"
                    inputClassName="p-4 bg-[#131313] placeholder-[#808080] focus:border-[#808080] 
                    focus:ring-0 outline-none text-white pl-10"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    icon={
                    <EmailIcon 
                        className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    }
                />

                <div className="relative xs:w-[350px] sm:w-[350px] mb-8 w-[250px] sm:mb-6 lg:w-[400px] lg:mb-10 xl:w-[420px] 2xl:w-[420px]" >
                    <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className=""
                    inputClassName="p-4 bg-[#131313] placeholder-[#808080] focus:border-[#808080] 
                        focus:ring-0 outline-none text-white pl-10"
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    icon={
                        <LockIcon 
                        className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    }
                    />

                    <button 
                    type="button" 
                    onClick={toggleShowPassword} 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                </div>

                <Button
                    label={isSignInPage ? 'Sign in' : 'Sign up'}
                    type='submit'
                    buttonClassName="bg-[#1476ff] py-2 w-[250px] hover:bg-[#146ae2] xs:w-[350px] sm:w-[350px] lg:w-[400px] xl:w-[420px] 2xl:w-[420px]"
                />

                <div className="text-[#c9c9c9] font-normal text-sm mt-3 sm:text-sm sm:mt-3 lg:text-[16px] lg:mt-4 ">
                    {isSignInPage ? "Don't have an account? " : "Have an account already? "}
                    <span 
                    className="text-blue-500 cursor-pointer hover:underline" 
                    onClick={() => { navigate(`/users/${isSignInPage ? 'signup' : 'login'}`) }}>
                    {isSignInPage ? "Sign up" : "Sign in"}
                    </span>
                </div>
                </form>
            </div>
            </div>


    );
    
}

export default Form;