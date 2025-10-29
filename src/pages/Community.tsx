import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Search,
  User,
  Users,
  Crown,
  MapPin,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { fallbackGroups, type GroupWithMembers } from "@/data/groups";

type SupabaseGroupResponse = Tables<"groups"> & {
  group_members?: { count: number }[];
};

const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isPremium] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupWithMembers[]>([]);

  const isSupabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  );

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    if (!isSupabaseConfigured) {
      setGroups(fallbackGroups);
      toast({
        title: "Offline preview",
        description: "Showing featured community groups while we finish setup.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("groups")
        .select("*, group_members(count)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mappedGroups = (data as SupabaseGroupResponse[] | null)?.map(
        (group) => ({
          ...group,
          memberCount: group.group_members?.[0]?.count ?? 1,
        })
      );

      setGroups(mappedGroups ?? []);
    } catch (error: unknown) {
      console.error("Error loading groups:", error);
      setGroups(fallbackGroups);
      toast({
        title: "Offline preview",
        description:
          "We couldn't load live groups, so we're showing featured communities instead.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isSupabaseConfigured, toast]);

  useEffect(() => {
    void fetchGroups();
  }, [fetchGroups]);

  const nextMeetingLabel = useCallback((nextMeeting: string | null) => {
    if (!nextMeeting) return "Next meeting to be announced";

    const date = new Date(nextMeeting);
    if (Number.isNaN(date.getTime())) return "Next meeting to be announced";

    return `Next meeting: ${date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }, []);

  const groupsLabel = useMemo(() => {
    if (isLoading) return "Loading groups...";
    if (groups.length === 0) return "No groups in your area yet";
    return `${groups.length} local group${groups.length === 1 ? "" : "s"} near you`;
  }, [groups.length, isLoading]);

  const getCategoryColor = (category: string) => {
    const categoryStyles: Record<string, string> = {
      "Book Club":
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      "Books & Literature":
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      "Hiking Team":
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "Outdoor & Adventure":
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "Language Swap":
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "Language & Culture":
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "Business & Networking":
        "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      "Arts & Photography":
        "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
      "Food & Cooking":
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      "Sports & Fitness":
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
      Technology:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
      Music:
        "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
      Gaming:
        "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-300",
      "Health & Wellness":
        "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
      Other:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    };
    return (
      categoryStyles[category] ??
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="text-[#E8B956]" size={24} />
          <h1 className="text-xl font-bold">Community Groups</h1>
        </div>
        <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate("/profile")}>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Premium Create Group Button */}
        {isPremium && (
          <Button
            className="w-full rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-black font-semibold h-12 flex items-center justify-center gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Crown size={20} />
            Create a Group
          </Button>
        )}

        {/* Groups Info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{groupsLabel}</p>
        </div>

        {/* Groups List */}
        <div className="space-y-4">
          {isLoading && (
            <>
              {[...Array(3)].map((_, index) => (
                <Card key={`skeleton-${index}`} className="border-border overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full rounded-full" />
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {!isLoading && errorMessage && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4 text-sm text-destructive">{errorMessage}</CardContent>
            </Card>
          )}

          {!isLoading && !errorMessage && groups.length === 0 && (
            <Card className="border-dashed border-border bg-muted/30">
              <CardContent className="p-6 text-center space-y-2">
                <Users size={40} className="mx-auto text-muted-foreground" />
                <p className="font-semibold">Be the first to start a group in your area</p>
                <p className="text-sm text-muted-foreground">
                  Tap the Create a Group button to bring people together around a shared interest.
                </p>
              </CardContent>
            </Card>
          )}

          {!isLoading &&
            !errorMessage &&
            groups.map((group) => (
              <Card key={group.id} className="border-border overflow-hidden">
                {/* Group Image */}
                {group.image_url ? (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={group.image_url}
                      alt={group.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#E8B956]/20 to-[#E8B956]/5 relative flex items-center justify-center">
                    <Users size={64} className="text-[#E8B956]/30" />
                  </div>
                )}

                <CardContent className="p-4 space-y-4">
                  {/* Group Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg leading-tight">{group.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users size={16} />
                            {group.memberCount} member{group.memberCount === 1 ? "" : "s"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={16} />
                            {group.location}
                          </span>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(group.category)} variant="secondary">
                        {group.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {group.description}
                    </p>
                  </div>

                  {/* Meeting Info */}
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Calendar size={16} />
                    {nextMeetingLabel(group.next_meeting)}
                  </div>

                  {/* Join Chat Button */}
                  <Button
                    className="w-full rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-black font-semibold"
                    onClick={() => navigate(`/messages?community=${group.id}`)}
                  >
                    <MessageSquare size={18} className="mr-2" />
                    Join Chat
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex items-center justify-around z-10">
        <button
          className="flex flex-col items-center gap-1 text-muted-foreground"
          onClick={() => navigate("/home")}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-muted-foreground"
          onClick={() => navigate("/messages")}
        >
          <MessageSquare size={24} />
          <span className="text-xs">Messages</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#E8B956]">
          <Users size={24} />
          <span className="text-xs font-medium">Community</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-muted-foreground"
          onClick={() => navigate("/matches")}
        >
          <Search size={24} />
          <span className="text-xs">Search</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-muted-foreground"
          onClick={() => navigate("/profile")}
        >
          <User size={24} />
          <span className="text-xs">Profile</span>
        </button>
      </nav>

      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onGroupCreated={() => void fetchGroups()}
      />
    </div>
  );
};

export default Community;
