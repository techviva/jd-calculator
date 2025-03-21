"use client";
import { Button, Flex, Strong, Textarea } from "@chakra-ui/react";
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from "./dialog";
import { useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
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

            if (note?.id) {
                const noteRef = doc(db, "notes", note?.id);
                await updateDoc(noteRef, {
                    content,
                    updatedAt: serverTimestamp()
                });

                toaster.create({
                    title: "Note updated",
                    description: "Your note has been updated",
                    type: "success"
                });
            } else {
                await addDoc(collection(db, "notes"), {
                    content,
                    projectId,
                    createdAt: serverTimestamp(),
                    createdBy: user?.displayName
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
