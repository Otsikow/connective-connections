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
  MapPin,
} from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void> | void;
  onSelectIcebreaker: (icebreaker: string) => void;
  suggestions?: string[];
  className?: string;
  isDisabled?: boolean;
}

const FALLBACK_SUGGESTIONS = [
  "Ask about their hobbies",
  "What's your favorite coffee spot?",
  "Tell me about your weekend plans",
];

export const MessageInput = ({
  onSendMessage,
  onSelectIcebreaker,
  suggestions,
  className = "",
  isDisabled = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (isDisabled || !message.trim()) {
      return;
    }

    try {
      await onSendMessage(message.trim());
      setMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (isDisabled) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleVoiceMessage = () => {
    if (isDisabled) {
      return;
    }
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  const handleTTS = () => {
    if (isDisabled) {
      return;
    }
    // TODO: Implement text-to-speech
    // Placeholder: Could integrate with Web Speech API
  };

  const handleScheduleMeetup = () => {
    if (isDisabled) {
      return;
    }
    // TODO: Implement schedule meetup
    // Placeholder: Could open calendar picker modal
  };

  const handleEmoji = () => {
    if (isDisabled) {
      return;
    }
    // TODO: Implement emoji picker
    // Placeholder: Could open emoji picker component
  };

  const handleImage = () => {
    if (isDisabled) {
      return;
    }
    // TODO: Implement image upload
    // Placeholder: Could trigger file input for image selection
  };

  const handleLocation = () => {
    if (isDisabled) {
      return;
    }
    // TODO: Implement location sharing
    // Placeholder: Could use geolocation API
  };

  return (
    <div className={`bg-card border-t border-border px-4 py-3 space-y-3 ${className}`}>
      {/* AI Icebreakers */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>💡</span>
        <span>{suggestions?.length ? "Smart suggestions for this chat" : "AI Icebreaker Suggestions"}</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {(suggestions?.length ? suggestions : FALLBACK_SUGGESTIONS).map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelectIcebreaker(suggestion)}
            className="h-8 px-3 text-xs whitespace-nowrap hover:bg-muted"
            disabled={isDisabled}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isDisabled}>
            <Button variant="outline" size="sm" className="h-10 w-10 p-0" disabled={isDisabled}>
              <Plus className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={handleEmoji} disabled={isDisabled}>
              <Smile className="w-4 h-4 mr-2" />
              Emoji
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImage} disabled={isDisabled}>
              <Image className="w-4 h-4 mr-2" />
              Photo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLocation} disabled={isDisabled}>
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleVoiceMessage} disabled={isDisabled}>
              <Mic className="w-4 h-4 mr-2" />
              Voice Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTTS} disabled={isDisabled}>
              <Volume2 className="w-4 h-4 mr-2" />
              Text-to-Speech
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleScheduleMeetup} disabled={isDisabled}>
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
          disabled={isDisabled}
        />

        <Button
          onClick={() => void handleSend()}
          disabled={isDisabled || !message.trim()}
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
