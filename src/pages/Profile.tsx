import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Settings, MapPin, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const interests = ["Hiking", "Photography", "Coffee", "Reading", "Travel"];
  const badges = ["First Connection", "Event Attendee", "Community Builder"];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Profile</h1>
        <button className="p-2 hover:bg-muted rounded-full">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold mb-2">Jane Doe</h2>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin size={16} />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={16} />
            <span>Joined November 2025</span>
          </div>
        </div>

        {/* Trust Score */}
        <Card className="border-border">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Trust Score</h3>
              <p className="text-sm text-muted-foreground">Build trust by attending events</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-[#E8B956]" fill="#E8B956" />
              <span className="text-2xl font-bold">85</span>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">About Me</h3>
            <p className="text-muted-foreground leading-relaxed">
              Love exploring new coffee shops and hiking trails. Always up for a good book discussion or planning the next adventure. New to the city and excited to meet genuine people!
            </p>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card className="border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">Badges</h3>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-[#E8B956]/10 rounded-full">
                  <Star size={16} className="text-[#E8B956]" />
                  <span className="text-sm font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default Profile;
