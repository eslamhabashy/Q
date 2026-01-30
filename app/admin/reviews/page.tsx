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
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";

interface Review {
    id: string;
    customer_name: string;
    rating: number;
    review_text: string;
    service_type: string | null;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<Review | null>(null);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        customer_name: "",
        rating: "5",
        review_text: "",
        service_type: "",
        is_featured: false,
        is_active: true,
    });

    const serviceTypes = ["Chat", "Lawyer Consultation", "Document Template", "Other"];

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from("reviews")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error: any) {
            toast.error("Error loading reviews: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const reviewData = {
                customer_name: formData.customer_name,
                rating: parseInt(formData.rating),
                review_text: formData.review_text,
                service_type: formData.service_type || null,
                is_featured: formData.is_featured,
                is_active: formData.is_active,
            };

            if (editing) {
                const { error } = await supabase
                    .from("reviews")
                    .update(reviewData)
                    .eq("id", editing.id);

                if (error) throw error;
                toast.success("Review updated successfully");
            } else {
                const { error } = await supabase
                    .from("reviews")
                    .insert([reviewData]);

                if (error) throw error;
                toast.success("Review added successfully");
            }

            setShowDialog(false);
            resetForm();
            fetchReviews();
        } catch (error: any) {
            toast.error("Error saving review: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (review: Review) => {
        setEditing(review);
        setFormData({
            customer_name: review.customer_name,
            rating: review.rating.toString(),
            review_text: review.review_text,
            service_type: review.service_type || "",
            is_featured: review.is_featured,
            is_active: review.is_active,
        });
        setShowDialog(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            const { error } = await supabase
                .from("reviews")
                .delete()
                .eq("id", id);

            if (error) throw error;
            toast.success("Review deleted successfully");
            fetchReviews();
        } catch (error: any) {
            toast.error("Error deleting review: " + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            customer_name: "",
            rating: "5",
            review_text: "",
            service_type: "",
            is_featured: false,
            is_active: true,
        });
        setEditing(null);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
                    <p className="text-muted-foreground">Manage customer reviews and testimonials</p>
                </div>
                <Button onClick={() => { resetForm(); setShowDialog(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Review
                </Button>
            </div>

            {/* Reviews List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {reviews.map((review) => (
                        <Card key={review.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <CardTitle>{review.customer_name}</CardTitle>
                                            {renderStars(review.rating)}
                                        </div>
                                        <CardDescription>{review.review_text}</CardDescription>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(review)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(review.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    {review.service_type && (
                                        <span className="text-xs px-2 py-1 rounded bg-accent">
                                            {review.service_type}
                                        </span>
                                    )}
                                    {review.is_featured && (
                                        <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                                            Featured
                                        </span>
                                    )}
                                    <span className={`text-xs px-2 py-1 rounded ${review.is_active ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
                                        {review.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit Review" : "Add New Review"}</DialogTitle>
                        <DialogDescription>
                            {editing ? "Update review details" : "Add a new customer review"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="customer_name">Customer Name *</Label>
                                    <Input
                                        id="customer_name"
                                        value={formData.customer_name}
                                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="rating">Rating *</Label>
                                    <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[5, 4, 3, 2, 1].map((num) => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num} Star{num > 1 ? "s" : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="review_text">Review Text *</Label>
                                <Textarea
                                    id="review_text"
                                    value={formData.review_text}
                                    onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                                    rows={4}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="service_type">Service Type</Label>
                                <Select value={formData.service_type} onValueChange={(value) => setFormData({ ...formData, service_type: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select service type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {serviceTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="rounded"
                                    />
                                    <Label htmlFor="is_featured" className="cursor-pointer">Featured</Label>
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
