const LoadingPage = () => {
    return (
        <div className="App">
        <h1>Loading...</h1>
        <div>
            <video autoPlay loop muted playsInline style={{width: '100%', height: 'auto'}}>
                <source src='/loading.webm' type="video/webm"/>
                Your browser does not support the video tag.
            </video>
        </div>
        </div>
        );
        }

        export default LoadingPage;