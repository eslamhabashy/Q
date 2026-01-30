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
import { Plus, Pencil, Trash2, Loader2, Languages } from "lucide-react";

interface FAQ {
    id: string;
    question_ar: string;
    question_en: string;
    answer_ar: string;
    answer_en: string;
    category: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
}

export default function FAQsPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<FAQ | null>(null);
    const [saving, setSaving] = useState(false);
    const [viewLang, setViewLang] = useState<"ar" | "en">("en");
    const supabase = createClient();

    const [formData, setFormData] = useState({
        question_ar: "",
        question_en: "",
        answer_ar: "",
        answer_en: "",
        category: "",
        order_index: "0",
        is_active: true,
    });

    const categories = ["General", "Rental", "Employment", "Family", "Business", "Legal Process"];

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            const { data, error } = await supabase
                .from("faqs")
                .select("*")
                .order("order_index", { ascending: true });

            if (error) throw error;
            setFaqs(data || []);
        } catch (error: any) {
            toast.error("Error loading FAQs: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const faqData = {
                question_ar: formData.question_ar,
                question_en: formData.question_en,
                answer_ar: formData.answer_ar,
                answer_en: formData.answer_en,
                category: formData.category,
                order_index: parseInt(formData.order_index),
                is_active: formData.is_active,
            };

            if (editing) {
                const { error } = await supabase
                    .from("faqs")
                    .update(faqData)
                    .eq("id", editing.id);

                if (error) throw error;
                toast.success("FAQ updated successfully");
            } else {
                const { error } = await supabase
                    .from("faqs")
                    .insert([faqData]);

                if (error) throw error;
                toast.success("FAQ added successfully");
            }

            setShowDialog(false);
            resetForm();
            fetchFAQs();
        } catch (error: any) {
            toast.error("Error saving FAQ: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (faq: FAQ) => {
        setEditing(faq);
        setFormData({
            question_ar: faq.question_ar,
            question_en: faq.question_en,
            answer_ar: faq.answer_ar,
            answer_en: faq.answer_en,
            category: faq.category,
            order_index: faq.order_index.toString(),
            is_active: faq.is_active,
        });
        setShowDialog(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;

        try {
            const { error } = await supabase
                .from("faqs")
                .delete()
                .eq("id", id);

            if (error) throw error;
            toast.success("FAQ deleted successfully");
            fetchFAQs();
        } catch (error: any) {
            toast.error("Error deleting FAQ: " + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            question_ar: "",
            question_en: "",
            answer_ar: "",
            answer_en: "",
            category: "",
            order_index: "0",
            is_active: true,
        });
        setEditing(null);
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">FAQs</h1>
                    <p className="text-muted-foreground">Manage frequently asked questions</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setViewLang(viewLang === "en" ? "ar" : "en")}
                    >
                        <Languages className="h-4 w-4 mr-2" />
                        {viewLang === "en" ? "English" : "Arabic"}
                    </Button>
                    <Button onClick={() => { resetForm(); setShowDialog(true); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                    </Button>
                </div>
            </div>

            {/* FAQs List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {faqs.map((faq) => (
                        <Card key={faq.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs px-2 py-1 rounded bg-accent">
                                                {faq.category}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Order: {faq.order_index}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg">
                                            {viewLang === "en" ? faq.question_en : faq.question_ar}
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            {viewLang === "en" ? faq.answer_en : faq.answer_ar}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <span className={`text-xs px-2 py-1 rounded ${faq.is_active ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
                                        {faq.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
                        <DialogDescription>
                            {editing ? "Update FAQ in both languages" : "Add a new FAQ in English and Arabic"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* English Section */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Languages className="h-4 w-4" />
                                    English Version
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <Label htmlFor="question_en">Question (English) *</Label>
                                        <Input
                                            id="question_en"
                                            value={formData.question_en}
                                            onChange={(e) => setFormData({ ...formData, question_en: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="answer_en">Answer (English) *</Label>
                                        <Textarea
                                            id="answer_en"
                                            value={formData.answer_en}
                                            onChange={(e) => setFormData({ ...formData, answer_en: e.target.value })}
                                            rows={3}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Arabic Section */}
                            <div className="border rounded-lg p-4" dir="rtl">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Languages className="h-4 w-4" />
                                    النسخة العربية
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <Label htmlFor="question_ar">السؤال (عربي) *</Label>
                                        <Input
                                            id="question_ar"
                                            value={formData.question_ar}
                                            onChange={(e) => setFormData({ ...formData, question_ar: e.target.value })}
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="answer_ar">الإجابة (عربي) *</Label>
                                        <Textarea
                                            id="answer_ar"
                                            value={formData.answer_ar}
                                            onChange={(e) => setFormData({ ...formData, answer_ar: e.target.value })}
                                            rows={3}
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Category *</Label>
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
                                    <Label htmlFor="order_index">Order Index</Label>
                                    <Input
                                        id="order_index"
                                        type="number"
                                        value={formData.order_index}
                                        onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                                    />
                                </div>
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
