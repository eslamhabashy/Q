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
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Star, MapPin, Phone, Mail } from "lucide-react";

interface Lawyer {
    id: string;
    full_name: string;
    specialty: string;
    location: string;
    phone: string | null;
    email: string | null;
    years_experience: number | null;
    bio: string | null;
    avatar_url: string | null;
    is_verified: boolean;
    is_active: boolean;
    rating: number;
    created_at: string;
}

export default function LawyersPage() {
    const [lawyers, setLawyers] = useState<Lawyer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<Lawyer | null>(null);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        full_name: "",
        specialty: "",
        location: "",
        phone: "",
        email: "",
        years_experience: "",
        bio: "",
        is_verified: false,
        is_active: true,
    });

    useEffect(() => {
        fetchLawyers();
    }, []);

    const fetchLawyers = async () => {
        try {
            const { data, error } = await supabase
                .from("lawyers")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setLawyers(data || []);
        } catch (error: any) {
            toast.error("Error loading lawyers: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const lawyerData = {
                full_name: formData.full_name,
                specialty: formData.specialty,
                location: formData.location,
                phone: formData.phone || null,
                email: formData.email || null,
                years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
                bio: formData.bio || null,
                is_verified: formData.is_verified,
                is_active: formData.is_active,
            };

            if (editing) {
                const { error } = await supabase
                    .from("lawyers")
                    .update(lawyerData)
                    .eq("id", editing.id);

                if (error) throw error;
                toast.success("Lawyer updated successfully");
            } else {
                const { error } = await supabase
                    .from("lawyers")
                    .insert([lawyerData]);

                if (error) throw error;
                toast.success("Lawyer added successfully");
            }

            setShowDialog(false);
            resetForm();
            fetchLawyers();
        } catch (error: any) {
            toast.error("Error saving lawyer: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (lawyer: Lawyer) => {
        setEditing(lawyer);
        setFormData({
            full_name: lawyer.full_name,
            specialty: lawyer.specialty,
            location: lawyer.location,
            phone: lawyer.phone || "",
            email: lawyer.email || "",
            years_experience: lawyer.years_experience?.toString() || "",
            bio: lawyer.bio || "",
            is_verified: lawyer.is_verified,
            is_active: lawyer.is_active,
        });
        setShowDialog(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this lawyer?")) return;

        try {
            const { error } = await supabase
                .from("lawyers")
                .delete()
                .eq("id", id);

            if (error) throw error;
            toast.success("Lawyer deleted successfully");
            fetchLawyers();
        } catch (error: any) {
            toast.error("Error deleting lawyer: " + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            full_name: "",
            specialty: "",
            location: "",
            phone: "",
            email: "",
            years_experience: "",
            bio: "",
            is_verified: false,
            is_active: true,
        });
        setEditing(null);
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Lawyers</h1>
                    <p className="text-muted-foreground">Manage lawyers directory</p>
                </div>
                <Button onClick={() => { resetForm(); setShowDialog(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lawyer
                </Button>
            </div>

            {/* Lawyers List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {lawyers.map((lawyer) => (
                        <Card key={lawyer.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            {lawyer.full_name}
                                            {lawyer.is_verified && (
                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            )}
                                        </CardTitle>
                                        <CardDescription>{lawyer.specialty}</CardDescription>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(lawyer)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(lawyer.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{lawyer.location}</span>
                                    </div>
                                    {lawyer.phone && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            <span>{lawyer.phone}</span>
                                        </div>
                                    )}
                                    {lawyer.email && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            <span className="truncate">{lawyer.email}</span>
                                        </div>
                                    )}
                                    {lawyer.years_experience && (
                                        <div className="text-muted-foreground">
                                            {lawyer.years_experience} years experience
                                        </div>
                                    )}
                                    <div className="flex gap-2 mt-2">
                                        <span className={`text-xs px-2 py-1 rounded ${lawyer.is_active ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
                                            {lawyer.is_active ? "Active" : "Inactive"}
                                        </span>
                                        {lawyer.is_verified && (
                                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit Lawyer" : "Add New Lawyer"}</DialogTitle>
                        <DialogDescription>
                            {editing ? "Update lawyer details" : "Add a new lawyer to the directory"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="full_name">Full Name *</Label>
                                    <Input
                                        id="full_name"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="specialty">Specialty *</Label>
                                    <Input
                                        id="specialty"
                                        value={formData.specialty}
                                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                        placeholder="e.g., Criminal Law, Family Law"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="location">Location *</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g., Cairo, Alexandria"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="years_experience">Years of Experience</Label>
                                    <Input
                                        id="years_experience"
                                        type="number"
                                        value={formData.years_experience}
                                        onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_verified"
                                        checked={formData.is_verified}
                                        onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                                        className="rounded"
                                    />
                                    <Label htmlFor="is_verified" className="cursor-pointer">Verified</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="rounded"
                                    />
                                    <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {editing ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
