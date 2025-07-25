import React, { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";

const OpenAIExample = () => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const configuration = new Configuration({
        apiKey: import.meta.env.VITE_OPENAI_KEY,
      });
      const openai = new OpenAIApi(configuration);

      try {
        const result = await openai.createChatCompletion({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: "Give me one motivational business tip.",
            },
          ],
        });
        setResponse(result.data.choices[0].message.content);
      } catch (error) {
        setResponse("❌ Error connecting to OpenAI.");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 text-lg">
      <h2 className="text-xl font-bold">OpenAI Response:</h2>
      <p>{response}</p>
    </div>
  );
};

export default OpenAIExample;
