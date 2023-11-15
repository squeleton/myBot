const PORT = 4000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = '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';

app.post('/completions', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {role:"user", content: "A partir de ahora eres mi asistente personal, mi nombre es isaias, soy un emprendedor y coah"},
                {role:"system", content: "Gracias por la informacion isaias"},
                {role: "user", content: req.body.message}],
            max_tokens: 100,
        })
    };
    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        res.send(data)
    } catch (error) {
        console.error(error)
    }
});
console.log("hi")

app.listen(PORT, () => console.log('your server is running in port ' + PORT));