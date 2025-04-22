"use client"

import type React from "react"

import { ArrowLeft, MoreVertical, Paperclip, Phone, Send, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock user data with anime avatars
const currentUser = {
  id: "user1",
  name: "You",
  avatar: "/placeholder.jpg?height=40&width=40&text=You",
}

const contacts = [
  {
    id: "user5",
    name: "Mikasa",
    avatar: "/placeholder-user.jpg?height=40&width=40&text=⚔️",
    lastMessage: "Necesitamos proteger a Eren",
    lastMessageTime: "Lunes",
    online: false,
  },
]

// Mock message data
const initialMessages = [
  {
    id: "msg1",
    senderId: "user2",
    text: "¡Hola! ¿Cómo estás?",
    timestamp: "10:30 AM",
  },
  {
    id: "msg2",
    senderId: "user1",
    text: "Estoy bien, gracias. Trabajando en la API de anime.",
    timestamp: "10:32 AM",
  },
  {
    id: "msg3",
    senderId: "user2",
    text: "Eso suena interesante. ¿Qué tipo de API es?",
    timestamp: "10:33 AM",
  },
  {
    id: "msg4",
    senderId: "user1",
    text: "Es una API RESTful para datos de anime con Socket.io para actualizaciones en tiempo real.",
    timestamp: "10:35 AM",
  },
  {
    id: "msg5",
    senderId: "user2",
    text: "¡Sugoi! ¡Eso es justo lo que estaba buscando! ¿Puedes contarme más sobre los endpoints?",
    timestamp: "10:36 AM",
  },
]

export default function ChatPage() {
  const [activeContact, setActiveContact] = useState(contacts[0])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("chats")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    if (messages[messages.length - 1]?.senderId === "user1") {
      const timeout = setTimeout(() => {
        setIsTyping(true)

        // After "typing", send a response
        const responseTimeout = setTimeout(() => {
          setIsTyping(false)
          const responses = [
            "¡Eso es genial! ¡Me encantan las APIs de anime!",
            "¿Puedes contarme más sobre la integración con Socket.io?",
            "¿Hay documentación disponible para la API?",
            "¡Sugoi! ¡Esto es increíble!",
            "¿Nani?! ¡Eso es impresionante!",
          ]

          const newMsg = {
            id: `msg${messages.length + 1}`,
            senderId: activeContact.id,
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }

          setMessages((prev) => [...prev, newMsg])
        }, 3000)

        return () => clearTimeout(responseTimeout)
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [messages, activeContact.id])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const newMsg = {
      id: `msg${messages.length + 1}`,
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-200">
      {/* Navigation */}
      <nav className="border-b border-purple-900/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="text-lg font-bold text-white">Nebura Client</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth" className="text-gray-300 hover:text-purple-400 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-6 px-4">
        <Card className="border-purple-900/50 bg-gray-900 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 h-[calc(100vh-12rem)]">
            {/* Sidebar */}
            <div className="border-r border-purple-900/50 md:col-span-1">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800 rounded-none">
                  <TabsTrigger value="chats" className="data-[state=active]:bg-gray-700">
                    Chats
                  </TabsTrigger>
                  <TabsTrigger value="contacts" className="data-[state=active]:bg-gray-700">
                    Contacts
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chats" className="m-0">
                  <div className="p-3">
                    <Input
                      placeholder="Buscar chats..."
                      className="bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                    />
                  </div>
                  <div className="overflow-y-auto h-[calc(100vh-16rem)]">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`flex items-center p-3 cursor-pointer hover:bg-gray-800 transition-colors ${activeContact.id === contact.id ? "bg-gray-800" : ""}`}
                        onClick={() => setActiveContact(contact)}
                      >
                        <div className="relative">
                          <Avatar className="border-2 border-purple-500/50">
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="text-white font-medium">{contact.name}</h3>
                            <span className="text-xs text-gray-400">{contact.lastMessageTime}</span>
                          </div>
                          <p className="text-sm text-gray-400 truncate">{contact.lastMessage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="contacts" className="m-0">
                  <div className="p-3">
                    <Input
                      placeholder="Buscar contactos..."
                      className="bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                    />
                  </div>
                  <div className="overflow-y-auto h-[calc(100vh-16rem)]">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center p-3 cursor-pointer hover:bg-gray-800 transition-colors"
                        onClick={() => {
                          setActiveContact(contact)
                          setActiveTab("chats")
                        }}
                      >
                        <div className="relative">
                          <Avatar className="border-2 border-purple-500/50">
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-white font-medium">{contact.name}</h3>
                          <p className="text-sm text-gray-400">{contact.online ? "En línea" : "Desconectado"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-3 flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-purple-900/50 p-4 flex justify-between items-center bg-gray-900">
                <div className="flex items-center">
                  <Avatar className="border-2 border-purple-500/50">
                    <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
                    <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h3 className="text-white font-medium">{activeContact.name}</h3>
                    <p className="text-xs text-gray-400">{activeContact.online ? "En línea" : "Desconectado"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-400 hover:bg-gray-800">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-400 hover:bg-gray-800">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-400 hover:bg-gray-800">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-950">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser = message.senderId === currentUser.id
                    return (
                      <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                        {!isCurrentUser && (
                          <Avatar className="mr-2 flex-shrink-0 border-2 border-purple-500/50">
                            <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
                            <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] ${isCurrentUser ? "bg-purple-600" : "bg-gray-800"} rounded-lg p-3`}
                        >
                          <p className="text-white">{message.text}</p>
                          <p className="text-xs text-right mt-1 text-gray-300">{message.timestamp}</p>
                        </div>
                      </div>
                    )
                  })}
                  {isTyping && (
                    <div className="flex justify-start">
                      <Avatar className="mr-2 flex-shrink-0 border-2 border-purple-500/50">
                        <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
                        <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-800 rounded-lg p-3 flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t border-purple-900/50 p-4 bg-gray-900">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-purple-400 hover:bg-gray-800"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Card>

        {/* Socket.io Connection Info */}
        <div className="mt-6 p-4 bg-gray-900 border border-purple-900/50 rounded-lg">
          <h3 className="text-white font-medium mb-2">Conexión con Socket.io</h3>
          <p className="text-gray-400 text-sm">
            Esta es una interfaz de demostración. En una implementación real, este chat estaría conectado a un backend de Socket.io para mensajería en tiempo real.
          </p>
          <div className="mt-3 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-300">Conexión con Socket.io lista para implementación</span>
          </div>
        </div>
      </div>
    </main>
  )
}

