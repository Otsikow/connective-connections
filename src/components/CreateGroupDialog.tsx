import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated?: () => void;
}

const categories = [
  "Books & Literature",
  "Outdoor & Adventure",
  "Language & Culture",
  "Business & Networking",
  "Arts & Photography",
  "Food & Cooking",
  "Sports & Fitness",
  "Technology",
  "Music",
  "Gaming",
  "Health & Wellness",
  "Other"
];

export const CreateGroupDialog = ({ open, onOpenChange, onGroupCreated }: CreateGroupDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    nextMeeting: "",
    imageUrl: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      location: "",
      nextMeeting: "",
      imageUrl: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive"
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    if (!formData.location.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("You must be logged in to create a group");
      }

      // Create the group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          location: formData.location.trim(),
          next_meeting: formData.nextMeeting || null,
          image_url: formData.imageUrl || null,
          is_premium: false,
          creator_id: user.id
        } as any)
        .select()
        .single();

      if (groupError) {
        throw groupError;
      }

      toast({
        title: "Success!",
        description: "Your group has been created successfully",
      });

      resetForm();
      onOpenChange(false);
      
      // Callback to refresh the groups list
      if (onGroupCreated) {
        onGroupCreated();
      }
    } catch (error: unknown) {
      console.error("Error creating group:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create group. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Group</DialogTitle>
          <DialogDescription>
            Build your community by creating a new group. Fill in the details below to get started.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Group Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Book Club Enthusiasts"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Tell us about your group, what activities you plan, and who should join..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                disabled={isLoading}
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                placeholder="e.g., Downtown Library, Various Trails"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nextMeeting">Next Meeting (Optional)</Label>
              <Input
                id="nextMeeting"
                type="datetime-local"
                value={formData.nextMeeting}
                onChange={(e) => handleInputChange("nextMeeting", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Provide a URL to an image for your group
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
