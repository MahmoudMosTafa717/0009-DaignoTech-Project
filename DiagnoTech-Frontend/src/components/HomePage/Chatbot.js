// import React, { useState, useRef, useEffect } from "react";
// import { Modal, Button, Form, InputGroup } from "react-bootstrap";
// import { BsChatDots, BsSend } from "react-icons/bs";
// import axios from "axios";
// import "./Chatbot.css"; 

// export const Chatbot = () => {
//   const [showChat, setShowChat] = useState(false);
//   const [messages, setMessages] = useState([
//     { text: "Hello! How can I help you today?", sender: "bot" }
//   ]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const handleClose = () => setShowChat(false);
//   const handleShow = () => setShowChat(true);

//   // Scroll to bottom of messages whenever messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
    
//     if (inputMessage.trim() === "") return;

//     // Add user message to chat
//     const userMessage = { text: inputMessage, sender: "user" };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInputMessage("");
//     setIsLoading(true);

//     try {
//       // Send message to backend API
//       const response = await axios.post(
//         "http://127.0.0.1:5000/api/chatBot/chat",
//         { message: inputMessage },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Add bot response to chat
//       if (response.data && response.data.reply) {
//         setTimeout(() => {
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { text: response.data.reply, sender: "bot" },
//           ]);
//           setIsLoading(false);
//         }, 500); // Small delay to make it feel more natural
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: "Sorry, I encountered an error. Please try again later.", sender: "bot" },
//       ]);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Chat Icon Button */}
//       <div className="chat-icon-container" onClick={handleShow}>
//         <div className="chat-icon">
//           <BsChatDots />
//         </div>
//       </div>

//       {/* Chat Modal */}
//       <Modal
//         show={showChat}
//         onHide={handleClose}
//         centered
//         className="chatbot-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <img src={require("../../img/logo.png")} alt="Logo" width="30" height="30" className="me-2" />
//             DiagnoTech Assistant
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="chat-body">
//           <div className="messages-container">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`message ${msg.sender === "bot" ? "bot" : "user"}`}
//               >
//                 {msg.text}
//               </div>
//             ))}
//             {isLoading && (
//               <div className="message bot typing">
//                 <div className="typing-indicator">
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         </Modal.Body>
//         <Modal.Footer className="chat-footer">
//           <Form onSubmit={handleSendMessage} className="w-100">
//             <InputGroup>
//               <Form.Control
//                 placeholder="Type your message..."
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 autoFocus
//               />
//               <Button variant="primary" type="submit" disabled={isLoading}>
//                 <BsSend />
//               </Button>
//             </InputGroup>
//           </Form>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default Chatbot;