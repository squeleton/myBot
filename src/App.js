import {useState, useEffect} from "react";

const App = () => {
    const [value, setValue] = useState(null);
    const [message, setMessage] = useState(null);
    const [chatsAnteriores, setChatsAnteriores] = useState([]);
    const [currentTitle, setCurrent] = useState(null);

    const createNewChat = () => {
        setMessage(null)
        setValue("")
        setCurrent(null)
    };

    const handleClick= (uniqueTitle) => {
        setCurrent(uniqueTitle)
        setMessage(null)
        setValue("")
    }

    const getMessages = async () => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: value
            }),
            headers:{
                "Content-Type": "application/json"
            }
        }

        try{
            const response = await fetch('http://localhost:4000/completions', options)
            const data = await response.json()
            setMessage(data.choices[0].message)
        } catch (error){
            console.log(error)
        }
    }

    useEffect(()=> {
        console.log(currentTitle,value,message)
        if (!currentTitle && value && message) {
            setCurrent(value)
        }
        if (currentTitle && value && message){
            setChatsAnteriores(chatsAnteriores => (
                [...chatsAnteriores,
                    {
                        title:currentTitle,
                        role: "user",
                        content: value
                    },{
                    title: currentTitle,
                    role: message.role,
                    content:message.content
                }]
            ))
        }
    }, [message, currentTitle])

    console.log(chatsAnteriores);

    const currentChat = chatsAnteriores.filter(chatsAnteriores => chatsAnteriores.title ===currentTitle)
    const uniqueTitles = Array.from (new Set(chatsAnteriores.map(chatsAnteriores => chatsAnteriores.title)))
    console.log(uniqueTitles)
    return (
        <div className="app">
            <section className = "side-bar">
                <button onClick={createNewChat} >New chat</button>
                <ul className="history">
                    {uniqueTitles?.map((uniqueTitle,index) => <li key={index} onClick={()=>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
                </ul>
                <nav>
                    <p>Realizado por Alexander Hernandez</p>
                </nav>
            </section>
            <section className="main">
                {!currentTitle && <h1>AlexGPT</h1>}
                <ul className="feed">
                    {currentChat?.map((chatMessage, index) => (
                        <li key={index}>
                            <p className={`role ${chatMessage.role === "user" ? 'user' : 'assistant'}`}></p>
                            <p>{chatMessage.content}</p>
                        </li>
                    ))}
                </ul>
                <div className="bottom-section">
                    <div className="contenedor">
                        <input value={value} onChange={(e) => setValue(e.target.value)}/>
                        <div id="submit" onClick={getMessages}>▶</div>
                    </div>
                    <p className="info">Chat GPT 14 Version. My goal is to make IA systems more natural and safe to interact with.</p>
                </div>
            </section>
        </div>
    );
}

export default App;
