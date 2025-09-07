import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Atlas Films",
      lastMessage: "Merci pour votre candidature. Nous aimerions vous rencontrer.",
      time: "10:30",
      unread: 2,
      avatar: "/placeholder.svg",
      type: "Producteur",
      online: true
    },
    {
      id: 2,
      name: "Creative Agency",
      lastMessage: "Félicitations! Vous êtes sélectionné pour la campagne.",
      time: "09:15",
      unread: 0,
      avatar: "/placeholder.svg",
      type: "Agence",
      online: false
    },
    {
      id: 3,
      name: "Sarah Directrice Casting",
      lastMessage: "Pouvez-vous nous envoyer d'autres photos?",
      time: "Hier",
      unread: 1,
      avatar: "/placeholder.svg",
      type: "Directeur de casting",
      online: true
    },
    {
      id: 4,
      name: "TV Production",
      lastMessage: "Le tournage aura lieu la semaine prochaine.",
      time: "Hier",
      unread: 0,
      avatar: "/placeholder.svg",
      type: "Production TV",
      online: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Atlas Films",
      content: "Bonjour! Nous avons reçu votre candidature pour le rôle principal de notre film historique.",
      time: "09:30",
      isOwn: false
    },
    {
      id: 2,
      sender: "Moi",
      content: "Bonjour! Merci beaucoup pour votre message. Je suis très intéressé(e) par ce projet.",
      time: "09:35",
      isOwn: true
    },
    {
      id: 3,
      sender: "Atlas Films",
      content: "Parfait! Votre profil correspond exactement à ce que nous recherchons. Seriez-vous disponible pour un entretien cette semaine?",
      time: "09:40",
      isOwn: false
    },
    {
      id: 4,
      sender: "Moi",
      content: "Oui, je suis disponible toute la semaine. Quel jour vous conviendrait le mieux?",
      time: "09:45",
      isOwn: true
    },
    {
      id: 5,
      sender: "Atlas Films",
      content: "Merci pour votre candidature. Nous aimerions vous rencontrer jeudi à 14h dans nos bureaux à Tunis. Est-ce que cela vous convient?",
      time: "10:30",
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would normally send the message to your backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">Communiquez avec les producteurs et directeurs de casting</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Rechercher une conversation..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-muted ${
                      selectedConversation === conversation.id ? "bg-primary/10 border-r-2 border-primary" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute -bottom-0 -right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{conversation.name}</p>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-muted-foreground">{conversation.time}</span>
                            {conversation.unread > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                        <Badge variant="outline" className="text-xs mt-1">{conversation.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConv && (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={selectedConv.avatar} />
                          <AvatarFallback>{selectedConv.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {selectedConv.online && (
                          <div className="absolute -bottom-0 -right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedConv.name}</h3>
                        <p className="text-xs text-muted-foreground">{selectedConv.type}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 ${
                          message.isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[60px] resize-none"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;