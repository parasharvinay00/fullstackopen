import { GoogleGenAI } from "@google/genai";
//we are using gemini SDK to call the api and get the reponse

const ai = new GoogleGenAI({ apiKey: 'AIzaSyCpskAm1fmAIkbQvvt4ouyUvf5BIQmUHdY' });

async function main() {
    console.log('Generating content...');
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "how your neurons works",
    });
    console.log('response.text?', response.text)
    //console.log(response.text);
}

main();