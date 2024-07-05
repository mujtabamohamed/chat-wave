import React from "react";

function Button({
    label='Button',
    type='',
    buttonClassName = '',
    disabled = false,
    onClick,
}) {
    return(
        <button 
            type={type}
            className={`text-white font-medium rounded-xl text-center ${buttonClassName}`}
            disabled={disabled} onClick={onClick}>{label}</button>
    );
}

export default Button;