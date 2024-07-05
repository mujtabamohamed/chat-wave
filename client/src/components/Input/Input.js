import React from "react";

function Input({
    label = '',
    name = '',
    type = '',
    className = '',
    inputClassName = '',
    isRequired = true,
    placeholder = '',
    value = "",
    onChange = () => {},
    icon,
}) {
    return (
        <div className={`relative ${className}`}>
            {icon}
            <input 
                type={type} 
                id={name}  
                className={`border border-[#444444] text-sm rounded-lg w-full ${inputClassName}`} 
                placeholder={placeholder} 
                required={isRequired}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default Input;
