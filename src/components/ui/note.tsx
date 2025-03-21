"use client";
import {
    Box,
    Card,
    Flex,
    HStack,
    Strong,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "../icons";
import { useState } from "react";
import { NoteDialog } from "./note-dialog";
import { db } from "@/lib/firebase";
import { toaster } from "@/components/ui/toaster";
import { parseError } from "@/utils/errorParser";
import { NoteType } from "@/types";
import { formatNoteDate } from "@/utils/functions";
import { DialogActionTrigger, DialogBody, DialogContent, DialogRoot, DialogTitle } from "./dialog";
import { Button } from "./button";
import { deleteDoc, doc } from "firebase/firestore";



export const Note = ({
    note,
    projectId,
    onNotesChange
}: {
    note: NoteType,
    projectId: string,
    onNotesChange: () => void
}) => {
    const { open, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const deleteNote = async () => {

        try {
            setIsLoading(true);
            await deleteDoc(doc(db, "notes", note.id));

            toaster.create({
                title: "Note deleted",
                description: "The note has been deleted successfully",
                type: "success"
            });

            onNotesChange();
        } catch (error) {
            console.error("Error deleting note:", error);
            toaster.create({
                title: "Error deleting note",
                description: parseError(error),
                type: "error"
            });
        } finally {
            setIsLoading(false);
            setDeleteModalOpen(false);
        }
    };

    return (
        <>
            <Card.Root width="100%" border="none" bg="bg">
                <Card.Body p={1} pl={0}>
                    <HStack mb="2" gap="3" alignItems="center">
                        <Text fontSize="x-small" color="green">
                            {note.createdAt?.toDate
                                ? formatNoteDate(note.createdAt.toDate())
                                : formatNoteDate(new Date())}
                        </Text>
                        <Flex gap={2} alignItems="center">
                            <EditIcon
                                color="green"
                                width="10px"
                                height="10px"
                                cursor="pointer"
                                onClick={onOpen}
                            />
                            <DeleteIcon
                                color="red"
                                width="10px"
                                height="10px"
                                cursor="pointer"
                                onClick={() => setDeleteModalOpen(true)}
                            />
                        </Flex>
                    </HStack>
                    <Card.Description lineClamp={2}>
                        <Strong color="fg" fontSize="small">{note.createdBy} added a note</Strong>{" "}
                        {note.content}
                    </Card.Description>
                </Card.Body>
                <Card.Footer p={0}>
                    <Text
                        fontSize="x-small"
                        color="green"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={onOpen}
                    >
                        Read More
                    </Text>
                </Card.Footer>
            </Card.Root>

            <NoteDialog
                open={open}
                onClose={onClose}
                setOpen={(value) => value ? onOpen() : onClose()}
                content={note.content}
                projectId={projectId}
                note={note}
                onNotesChange={onNotesChange}
            />

            <DialogRoot
                placement="center"
                open={deleteModalOpen}
                onOpenChange={() => setDeleteModalOpen(!deleteModalOpen)}
                unmountOnExit
            >
                <DialogContent borderRadius="3xl" py={4} width="fit-content">
                    <DialogBody pb="2">
                        <DialogTitle mb={2}>Delete Note</DialogTitle>
                        <Text>Are you sure? You can&apos;t undo this action afterwards</Text>
                        <HStack justify="space-between" pt={4}>
                            <Box width="fit-content" p={0} m={0}>
                                <DialogActionTrigger>
                                    <Button fontSize="small" colorPalette="gray">
                                        Cancel
                                    </Button>
                                </DialogActionTrigger>
                            </Box>
                            <Box width="fit-content" p={0} m={0}>
                                <Button
                                    colorPalette="red"
                                    fontSize="small"
                                    disabled={isLoading}
                                    onClick={() => {
                                        deleteNote();
                                    }}
                                >
                                    {isLoading ? "Deleting..." : "Delete"}
                                </Button>
                            </Box>
                        </HStack>
                    </DialogBody>
                </DialogContent>
            </DialogRoot>

        </>
    )
}

