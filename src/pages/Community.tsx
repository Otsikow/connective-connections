import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, MapPin, Calendar, MessageSquare, Crown } from "lucide-react";
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
import { usePageTitle } from "@/hooks/usePageTitle";
import { generateAvatarUrl } from "@/lib/avatar";
import { ToastAction } from "@/components/ui/toast";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

type SupabaseGroupResponse = Tables<"groups"> & {
  group_members?: { count: number }[];
};

const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  usePageTitle("Community Hubs");

  const { userId, tier, requireProFeature } = useSubscription();
  const isPremiumMember = tier === "pro";
  const isChatLocked = !userId || !isPremiumMember;

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
        description: "Showing featured community groups while setup completes.",
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

      const mapped = (data as SupabaseGroupResponse[] | null)?.map((g) => ({
        ...g,
        memberCount: g.group_members?.[0]?.count ?? 1,
      }));

      setGroups(mapped ?? []);
    } catch (err) {
      console.error("Error loading groups:", err);
      setGroups(fallbackGroups);
      toast({
        title: "Offline preview",
        description:
          "We couldn't load live groups, showing featured communities instead.",
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

  const ensureChatAccess = useCallback(
    (destination: string) => {
      if (!userId) {
        toast({
          title: "Sign in to join chats",
          description:
            "Log in or create a free account to message community groups.",
          action: (
            <ToastAction
              altText="Sign in"
              onClick={() => navigate("/login", { state: { next: destination } })}
            >
              Sign in
            </ToastAction>
          ),
        });
        return false;
      }

      if (!isPremiumMember) {
        return requireProFeature();
      }

      return true;
    },
    [isPremiumMember, navigate, requireProFeature, toast, userId]
  );

  const handleJoinChat = useCallback(
    (groupId: string) => {
      const dest = `/messages/community/${groupId}`;
      if (!ensureChatAccess(dest)) return;
      navigate(dest);
    },
    [ensureChatAccess, navigate]
  );

  const handleCreateGroupClick = useCallback(() => {
    const dest = "/community";
    if (!ensureChatAccess(dest)) return;
    setIsDialogOpen(true);
  }, [ensureChatAccess]);

  const createGroupLabel = !userId
    ? "Sign in to create a group"
    : isPremiumMember
    ? "Create a Group"
    : "Unlock premium groups";

  const getCategoryColor = (category: string) => {
    const styles: Record<string, string> = {
      "Book Club":
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      "Hiking Team":
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "Language Swap":
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "Business & Networking":
        "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      "Food & Cooking":
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      "Sports & Fitness":
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
      Technology:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
      Music:
        "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
      Other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    };

    return (
      styles[category] ??
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="text-[hsl(var(--highlight-text))]" size={24} />
          <h1 className="text-xl font-bold">Community Groups</h1>
        </div>

        <Avatar
          className="w-10 h-10 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <AvatarImage src={generateAvatarUrl("community header member")} />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Create Group Button */}
        <Button
          variant={isChatLocked ? "outline" : "default"}
          className={cn(
            "flex h-12 w-full items-center justify-center gap-2 font-semibold transition-colors",
            isChatLocked && "text-muted-foreground"
          )}
          onClick={handleCreateGroupClick}
        >
          <Crown size={20} />
          {createGroupLabel}
        </Button>

        {/* Groups Label */}
        <p className="text-sm text-muted-foreground">{groupsLabel}</p>

        {/* Groups */}
        <div className="space-y-4">
          {isLoading &&
            [...Array(3)].map((_, index) => (
              <Card key={index} className="border-border overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </CardContent>
              </Card>
            ))}

          {!isLoading && errorMessage && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4 text-sm text-destructive">
                {errorMessage}
              </CardContent>
            </Card>
          )}

          {!isLoading && !errorMessage && groups.length === 0 && (
            <Card className="border-dashed border-border bg-muted/30">
              <CardContent className="p-6 text-center space-y-2">
                <Users size={40} className="mx-auto text-muted-foreground" />
                <p className="font-semibold">
                  Be the first to start a group in your area
                </p>
                <p className="text-sm text-muted-foreground">
                  Tap the Create a Group button to bring people together.
                </p>
              </CardContent>
            </Card>
          )}

          {!isLoading &&
            !errorMessage &&
            groups.map((group) => (
              <Card key={group.id} className="border-border overflow-hidden">
                {/* Image */}
                {group.image_url ? (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={group.image_url}
                      alt={group.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/10 flex items-center justify-center">
                    <Users size={64} className="text-[hsl(var(--highlight-text))]/30" />
                  </div>
                )}

                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg">{group.name}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users size={16} />
                          {group.memberCount} member
                          {group.memberCount === 1 ? "" : "s"}
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

                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar size={16} />
                    {nextMeetingLabel(group.next_meeting)}
                  </div>

                  <Button
                    variant={isChatLocked ? "outline" : "default"}
                    className={cn(
                      "flex w-full items-center justify-center gap-2 font-semibold transition-colors",
                      isChatLocked && "text-muted-foreground"
                    )}
                    onClick={() => handleJoinChat(group.id)}
                  >
                    <MessageSquare size={18} />
                    {!userId
                      ? "Sign in to chat"
                      : isPremiumMember
                      ? "Join Chat"
                      : "Join chat (Premium)"}
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Dialog */}
      <CreateGroupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onGroupCreated={() => void fetchGroups()}
      />
    </div>
  );
};

export default Community;
