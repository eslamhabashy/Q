"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Download, Loader2 } from "lucide-react";

interface Template {
    id: string;
    title: string;
    description: string | null;
    category: string;
    file_url: string;
    file_name: string;
    file_size: number | null;
    download_count: number;
    is_active: boolean;
    created_at: string;
}

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<Template | null>(null);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        file: null as File | null,
    });

    const categories = ["Rental", "Employment", "Family", "Business", "Other"];

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from("document_templates")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error: any) {
            toast.error("Error loading templates: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let fileUrl = editing?.file_url || "";
            let fileName = editing?.file_name || "";
            let fileSize = editing?.file_size || 0;

            // Upload file if new file is selected
            if (formData.file) {
                const fileExt = formData.file.name.split(".").pop();
                const filePath = `${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("templates")
                    .upload(filePath, formData.file);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from("templates")
                    .getPublicUrl(filePath);

                fileUrl = urlData.publicUrl;
                fileName = formData.file.name;
                fileSize = formData.file.size;
            }

            const templateData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                file_url: fileUrl,
                file_name: fileName,
                file_size: fileSize,
            };

            if (editing) {
                // Update
                const { error } = await supabase
                    .from("document_templates")
                    .update(templateData)
                    .eq("id", editing.id);

                if (error) throw error;
                toast.success("Template updated successfully");
            } else {
                // Create
                const { error } = await supabase
                    .from("document_templates")
                    .insert([templateData]);

                if (error) throw error;
                toast.success("Template created successfully");
            }

            setShowDialog(false);
            setFormData({ title: "", description: "", category: "", file: null });
            setEditing(null);
            fetchTemplates();
        } catch (error: any) {
            toast.error("Error saving template: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (template: Template) => {
        setEditing(template);
        setFormData({
            title: template.title,
            description: template.description || "",
            category: template.category,
            file: null,
        });
        setShowDialog(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this template?")) return;

        try {
            const { error } = await supabase
                .from("document_templates")
                .delete()
                .eq("id", id);

            if (error) throw error;
            toast.success("Template deleted successfully");
            fetchTemplates();
        } catch (error: any) {
            toast.error("Error deleting template: " + error.message);
        }
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return "N/A";
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Document Templates</h1>
                    <p className="text-muted-foreground">Manage legal document templates</p>
                </div>
                <Button onClick={() => { setEditing(null); setFormData({ title: "", description: "", category: "", file: null }); setShowDialog(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Template
                </Button>
            </div>

            {/* Templates List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {templates.map((template) => (
                        <Card key={template.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>{template.title}</CardTitle>
                                        <CardDescription>{template.description}</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" onClick={() => handleEdit(template)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => handleDelete(template.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="bg-accent px-2 py-1 rounded">{template.category}</span>
                                    <span>{template.file_name}</span>
                                    <span>{formatFileSize(template.file_size)}</span>
                                    <span>{template.download_count} downloads</span>
                                    <span className={template.is_active ? "text-green-600" : "text-red-600"}>
                                        {template.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit Template" : "Add New Template"}</DialogTitle>
                        <DialogDescription>
                            {editing ? "Update template details" : "Upload a new document template"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="file">File {editing && "(leave empty to keep current file)"}</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".pdf,.docx"
                                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                                    required={!editing}
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={uploading}>
                                {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {editing ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
