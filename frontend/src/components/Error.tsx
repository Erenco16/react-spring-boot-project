interface ErrorProps{
    errorClass: string,
    errorMsg: string;
}

const Error = ({errorClass, errorMsg}: ErrorProps) => {
    return (
        <div className={`message-box ${errorClass}`}>
            <p>{errorMsg}</p>
        </div>
    )
}

export default Error;