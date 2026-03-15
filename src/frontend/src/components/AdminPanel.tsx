import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  type Portfolio,
  type Project,
  useAddProject,
  useDeleteProject,
  useUpdatePortfolio,
  useUpdateSkills,
  useUploadResume,
} from "../hooks/useQueries";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  portfolio: Portfolio | null;
  projects: Project[];
}

export function AdminPanel({
  open,
  onClose,
  portfolio,
  projects,
}: AdminPanelProps) {
  const updatePortfolio = useUpdatePortfolio();
  const updateSkills = useUpdateSkills();
  const uploadResume = useUploadResume();
  const addProject = useAddProject();
  const deleteProject = useDeleteProject();

  const [name, setName] = useState(portfolio?.name ?? "");
  const [tagline, setTagline] = useState(portfolio?.tagline ?? "");
  const [about, setAbout] = useState(portfolio?.about ?? "");
  const [skillsText, setSkillsText] = useState(
    (portfolio?.skills ?? []).join(", "),
  );
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projLink, setProjLink] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleProfileSave = async () => {
    try {
      await updatePortfolio.mutateAsync({ name, tagline, about });
      const skills = skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await updateSkills.mutateAsync(skills);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress(0);
    try {
      await uploadResume.mutateAsync({
        file,
        onProgress: (pct) => setUploadProgress(pct),
      });
      toast.success("Resume uploaded!");
      setUploadProgress(100);
    } catch {
      toast.error("Upload failed");
      setUploadProgress(0);
    }
  };

  const handleAddProject = async () => {
    if (!projTitle.trim()) return;
    try {
      await addProject.mutateAsync({
        title: projTitle,
        description: projDesc,
        link: projLink,
      });
      setProjTitle("");
      setProjDesc("");
      setProjLink("");
      toast.success("Project added!");
    } catch {
      toast.error("Failed to add project");
    }
  };

  const handleDeleteProject = async (id: bigint) => {
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl bg-card/95 backdrop-blur-2xl border-primary/20 text-foreground max-h-[85vh] overflow-y-auto"
        data-ocid="admin.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            Admin Panel
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile">
          <TabsList
            className="bg-muted/50 border border-border"
            data-ocid="admin.tab"
          >
            <TabsTrigger value="profile" data-ocid="admin.tab">
              Profile
            </TabsTrigger>
            <TabsTrigger value="projects" data-ocid="admin.tab">
              Projects
            </TabsTrigger>
            <TabsTrigger value="resume" data-ocid="admin.tab">
              Resume
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label
                htmlFor="admin-name"
                className="text-muted-foreground text-xs uppercase tracking-wider"
              >
                Name
              </Label>
              <Input
                id="admin-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50 border-border"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="admin-tagline"
                className="text-muted-foreground text-xs uppercase tracking-wider"
              >
                Tagline
              </Label>
              <Input
                id="admin-tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="bg-background/50 border-border"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="admin-about"
                className="text-muted-foreground text-xs uppercase tracking-wider"
              >
                About
              </Label>
              <Textarea
                id="admin-about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                className="bg-background/50 border-border resize-none"
                data-ocid="admin.textarea"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="admin-skills"
                className="text-muted-foreground text-xs uppercase tracking-wider"
              >
                Skills (comma-separated)
              </Label>
              <Input
                id="admin-skills"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="React, TypeScript, Node.js..."
                className="bg-background/50 border-border"
                data-ocid="admin.input"
              />
            </div>
            <Button
              onClick={handleProfileSave}
              disabled={updatePortfolio.isPending || updateSkills.isPending}
              className="w-full bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"
              data-ocid="admin.save_button"
            >
              {updatePortfolio.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Profile
            </Button>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4 mt-4">
            <div className="space-y-3 p-4 rounded-xl border border-border bg-background/30">
              <h3 className="text-sm font-semibold text-foreground">
                Add New Project
              </h3>
              <Input
                placeholder="Project title"
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
                className="bg-background/50 border-border"
                data-ocid="admin.input"
              />
              <Textarea
                placeholder="Description"
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                rows={3}
                className="bg-background/50 border-border resize-none"
                data-ocid="admin.textarea"
              />
              <Input
                placeholder="https://github.com/..."
                value={projLink}
                onChange={(e) => setProjLink(e.target.value)}
                className="bg-background/50 border-border"
                data-ocid="admin.input"
              />
              <Button
                onClick={handleAddProject}
                disabled={addProject.isPending || !projTitle.trim()}
                size="sm"
                className="bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30"
                data-ocid="admin.submit_button"
              >
                {addProject.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                ) : (
                  <Plus className="h-3.5 w-3.5 mr-1" />
                )}
                Add Project
              </Button>
            </div>

            <div className="space-y-2">
              {projects.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No projects yet.
                </p>
              )}
              {projects.map((p, i) => (
                <div
                  key={String(p.id)}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <span className="text-sm text-foreground font-medium">
                    {p.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProject(p.id)}
                    disabled={deleteProject.isPending}
                    className="text-destructive hover:bg-destructive/10"
                    data-ocid={`admin.delete_button.${i + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resume" className="space-y-4 mt-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex flex-col items-center gap-3 p-10 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer group"
              data-ocid="admin.dropzone"
            >
              <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="text-muted-foreground text-sm text-center">
                Click to upload your resume (PDF)
              </p>
              <span className="text-xs text-muted-foreground/60">
                PDF format recommended
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleResumeUpload}
              data-ocid="admin.upload_button"
            />
            {uploadResume.isPending && (
              <div className="space-y-2" data-ocid="admin.loading_state">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1" />
              </div>
            )}
            {uploadResume.isSuccess && (
              <div
                className="flex items-center gap-2 text-sm text-primary"
                data-ocid="admin.success_state"
              >
                <CheckCircle className="h-4 w-4" />
                Resume uploaded successfully!
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
