import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Send, 
  Smile, 
  Mic, 
  Volume2, 
  Calendar,
  Image,
  FileText,
  MapPin
} from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onSelectIcebreaker: (icebreaker: string) => void;
  className?: string;
}

export const MessageInput = ({ onSendMessage, onSelectIcebreaker, className = "" }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceMessage = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  const handleTTS = () => {
    // TODO: Implement text-to-speech
    console.log("TTS feature");
  };

  const handleScheduleMeetup = () => {
    // TODO: Implement schedule meetup
    console.log("Schedule meetup");
  };

  const handleEmoji = () => {
    // TODO: Implement emoji picker
    console.log("Emoji picker");
  };

  const handleImage = () => {
    // TODO: Implement image upload
    console.log("Image upload");
  };

  const handleLocation = () => {
    // TODO: Implement location sharing
    console.log("Location sharing");
  };

  return (
    <div className={`bg-card border-t border-border px-4 py-3 space-y-3 ${className}`}>
      {/* AI Icebreakers */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>💡</span>
        <span>AI Icebreaker Suggestions</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {[
          "Ask about their hobbies",
          "What's your favorite coffee spot?",
          "Tell me about your weekend plans"
        ].map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelectIcebreaker(suggestion)}
            className="h-8 px-3 text-xs whitespace-nowrap hover:bg-muted"
          >
            {suggestion}
          </Button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 w-10 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={handleEmoji}>
              <Smile className="w-4 h-4 mr-2" />
              Emoji
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImage}>
              <Image className="w-4 h-4 mr-2" />
              Photo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLocation}>
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleVoiceMessage}>
              <Mic className="w-4 h-4 mr-2" />
              Voice Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTTS}>
              <Volume2 className="w-4 h-4 mr-2" />
              Text-to-Speech
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleScheduleMeetup}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meetup
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 rounded-full bg-background border-border"
        />

        <Button 
          onClick={handleSend}
          disabled={!message.trim()}
          className="h-10 w-10 rounded-full bg-[#E8B956] hover:bg-[#d9a840] p-0 disabled:opacity-50"
        >
          <Send className="w-4 h-4 text-charcoal" />
        </Button>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Recording... Tap to stop
        </div>
      )}
    </div>
  );
};
