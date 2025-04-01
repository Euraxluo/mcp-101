'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
  });

  return (
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto py-4">
      <div className="flex-grow overflow-y-auto p-4 bg-white rounded-lg shadow-md">
        {messages?.map(message => (
          <div key={message.id} className={`mb-4 p-2 rounded ${message.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}>
            <strong>{`${message.role}: `}</strong>
            {message.parts.map(part => {
              switch (part.type) {
                case 'text':
                  return part.text;
                default:
                  return null;
              }
            })}
            <br />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex mt-4">
        <input
          className="flex-1 p-2 border border-gray-300 rounded"
          value={input} onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </form>
    </div>
  );
}