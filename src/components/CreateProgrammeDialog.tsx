import { useState, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";

interface CreateProgrammeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProgrammeCreated?: () => void;
}

const programmeTypes = ["Bachelor", "Master", "PhD", "Certificate", "Diploma"] as const;
type ProgrammeType = typeof programmeTypes[number];

const isValidUrl = (urlString: string): boolean => {
  if (!urlString || urlString.trim() === "") return true; // Empty is valid (optional)
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isValidImageUrl = (urlString: string): boolean => {
  if (!urlString || urlString.trim() === "") return true;
  if (!isValidUrl(urlString)) return false;
  
  // Check for common image extensions or known image hosting services
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i;
  const imageHostingServices = /(unsplash\.com|cloudinary\.com|imgur\.com|images\.unsplash\.com)/i;
  
  return imageExtensions.test(urlString) || imageHostingServices.test(urlString) || true; // Allow any valid URL
};

export const CreateProgrammeDialog = ({ 
  open, 
  onOpenChange, 
  onProgrammeCreated 
}: CreateProgrammeDialogProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Bachelor" as ProgrammeType,
    duration: "",
    imageUrl: "",
    isPublished: true,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === "imageUrl" && typeof value === "string") {
      // Clear any previous URL error when user types
      setUrlError(null);
      
      // Validate URL format if not empty
      if (value && !isValidUrl(value)) {
        setUrlError("Please enter a valid URL (must start with http:// or https://)");
      } else if (value && !isValidImageUrl(value)) {
        setUrlError("Please enter a valid image URL");
      }
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "Bachelor",
      duration: "",
      imageUrl: "",
      isPublished: true,
    });
    setUrlError(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("You must be logged in to upload images");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("programme-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        // If bucket doesn't exist, fall back to URL-only mode
        if (uploadError.message.includes("Bucket not found")) {
          toast({
            title: "Upload not available",
            description: "Please use a URL to add an image instead.",
            variant: "destructive",
          });
          return;
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("programme-images")
        .getPublicUrl(fileName);

      handleInputChange("imageUrl", publicUrl);
      setUrlError(null);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload image. Please try using a URL instead.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a programme name",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description",
        variant: "destructive",
      });
      return;
    }

    // Validate URL if provided
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      setUrlError("Please enter a valid URL (must start with http:// or https://)");
      toast({
        title: "Invalid URL",
        description: "The image URL is not valid. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be logged in to create a programme");
      }

      // Clean up the image URL
      const cleanImageUrl = formData.imageUrl.trim() || null;

      // Create the programme
      const { error: programmeError } = await supabase
        .from("programmes")
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim(),
          type: formData.type,
          duration: formData.duration.trim() || null,
          image_url: cleanImageUrl,
          is_published: formData.isPublished,
          creator_id: user.id,
        });

      if (programmeError) {
        throw programmeError;
      }

      toast({
        title: "Success!",
        description: formData.isPublished 
          ? "Your programme has been created and published successfully"
          : "Your programme has been created as a draft",
      });

      resetForm();
      onOpenChange(false);

      // Callback to refresh the programmes list
      if (onProgrammeCreated) {
        onProgrammeCreated();
      }
    } catch (error: unknown) {
      console.error("Error creating programme:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create programme. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearImageUrl = () => {
    handleInputChange("imageUrl", "");
    setUrlError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Programme</DialogTitle>
          <DialogDescription>
            Add a new programme to your portfolio. Fill in the details below to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Programme Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Bachelor of Computer Science"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">
                Programme Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {programmeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the programme, its objectives, and what students will learn..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                disabled={isLoading}
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (Optional)</Label>
              <Input
                id="duration"
                placeholder="e.g., 4 years, 2 semesters"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label>Programme Image (optional)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Upload an image or paste a public URL. Max 5 MB.
              </p>
              
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading || isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading}
                  className="gap-2"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload
                </Button>
              </div>

              <div className="relative">
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  disabled={isLoading}
                  className={urlError ? "border-red-500 pr-10" : "pr-10"}
                />
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={clearImageUrl}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {urlError && (
                <p className="text-xs text-red-500">{urlError}</p>
              )}
              {formData.imageUrl && !urlError && isValidUrl(formData.imageUrl) && (
                <div className="mt-2 rounded-lg border border-border overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      setUrlError("Could not load image from this URL");
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="publish" className="text-base">
                  Publish Programme
                </Label>
                <p className="text-sm text-muted-foreground">
                  Visible to agents and students in course search.
                </p>
              </div>
              <Switch
                id="publish"
                checked={formData.isPublished}
                onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                disabled={isLoading}
              />
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
            <Button type="submit" disabled={isLoading || !!urlError}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create programme"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
