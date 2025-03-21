"use client";
import { Button, Flex, Strong, Textarea } from "@chakra-ui/react";
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from "./dialog";
import { useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { toaster } from "./toaster";
import { db } from "@/lib/firebase";
import { NoteType } from "@/types";
import { parseError } from "@/utils/errorParser";
import { formatNoteDate } from "@/utils/functions";
import { useAuth } from "@/contexts/AuthContext";

type NoteDialogProps = {
    open: boolean,
    setOpen: (value: boolean) => void,
    onClose: () => void,
    content: string,
    note?: NoteType,
    projectId: string,
    onNotesChange: () => void
}

export const NoteDialog = ({ open, onClose, setOpen, content, note, projectId, onNotesChange }: NoteDialogProps) => {
    const [editedContent, setEditedContent] = useState(note?.content || content);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const saveNote = async (content: string) => {
        try {
            setIsLoading(true);
            const projectRef = doc(db, "projects", projectId);
            const projectDoc = await getDoc(projectRef);

            if (!projectDoc.exists()) {
                throw new Error("Project not found");
            }

            const projectData = projectDoc.data();
            const notes = projectData.notes || [];

            if (note?.id) {
                const updatedNotes = notes.map((n: NoteType) =>
                    n.id === note.id ? {
                        ...n,
                        content,
                        updatedAt: new Date().toISOString()
                    } : n
                );

                await updateDoc(projectRef, { notes: updatedNotes });

                toaster.create({
                    title: "Note updated",
                    description: "Your note has been updated",
                    type: "success"
                });
            } else {
                // Add new note
                const newNote = {
                    id: crypto.randomUUID(),
                    content,
                    projectId,
                    createdAt: new Date(),
                    createdBy: user?.displayName || "User"
                };

                await updateDoc(projectRef, {
                    notes: [...notes, newNote]
                });

                toaster.create({
                    title: "Note created",
                    description: "Your note has been saved successfully",
                    type: "success"
                });
            }
            onClose();
            onNotesChange();
        } catch (error) {
            console.error("Error saving note:", error);
            toaster.create({
                title: "Error saving note",
                description: parseError(error),
                type: "error"
            });
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    };

    return (
        <DialogRoot open={open} onOpenChange={() => setOpen(!open)} placement="center">
            <DialogContent>
                <DialogHeader>
                    <Strong fontSize="medium">    {note?.createdAt?.toDate
                        ? formatNoteDate(note.createdAt.toDate())
                        : formatNoteDate(new Date())}</Strong>
                </DialogHeader>
                <DialogBody>
                    <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        minHeight="200px"
                        p={3}
                    />
                </DialogBody>
                <DialogFooter>
                    <Flex width="100%" justifyContent="space-between">
                        <Button colorPalette="gray" onClick={onClose}>Cancel</Button>
                        <Button colorPalette="green" onClick={() => saveNote(editedContent)} disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
                    </Flex>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    )
}
