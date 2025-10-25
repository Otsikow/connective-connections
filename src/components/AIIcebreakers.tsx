import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageCircle } from "lucide-react";

interface AIIcebreakersProps {
  onSelectIcebreaker: (icebreaker: string) => void;
  className?: string;
}

const icebreakerSuggestions = [
  "Ask about their hobbies",
  "What's your favorite coffee spot?",
  "Tell me about your weekend plans",
  "What's the best book you've read lately?",
  "Any fun weekend activities?",
  "What's your go-to comfort food?",
  "Tell me about your favorite local spot",
  "What's something you're excited about?",
  "Any interesting projects you're working on?",
  "What's your ideal way to spend a Sunday?"
];

export const AIIcebreakers = ({ onSelectIcebreaker, className = "" }: AIIcebreakersProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState(icebreakerSuggestions.slice(0, 3));

  const handleSelect = (icebreaker: string, index: number) => {
    setSelectedIndex(index);
    onSelectIcebreaker(icebreaker);
    
    // Remove selected suggestion and add a new one
    setTimeout(() => {
      setSuggestions(prev => {
        const newSuggestions = [...prev];
        newSuggestions[index] = icebreakerSuggestions[Math.floor(Math.random() * icebreakerSuggestions.length)];
        return newSuggestions;
      });
      setSelectedIndex(null);
    }, 1000);
  };

  const generateNewSuggestions = () => {
    const shuffled = [...icebreakerSuggestions].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 3));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4" />
        <span>AI Icebreaker Suggestions</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateNewSuggestions}
          className="h-6 px-2 text-xs"
        >
          Refresh
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant={selectedIndex === index ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelect(suggestion, index)}
            className={`h-8 px-3 text-xs whitespace-nowrap transition-all ${
              selectedIndex === index 
                ? "bg-[#E8B956] text-charcoal hover:bg-[#d9a840]" 
                : "hover:bg-muted"
            }`}
            disabled={selectedIndex === index}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};
