'use client'
import { Button, CostItemModal, CostManagementSkeleton, DialogActionTrigger } from '@/components/ui'
import {
    Box,
    DialogTitle,
    Flex,
    Heading,
    HStack,
    Table,
    Text,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import { DialogBody, DialogContent, DialogRoot } from '@/components/ui'
import { useState, useEffect } from 'react'
import { DeleteIcon, EditIcon } from '@/components/icons'
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toaster } from '@/components/ui/toaster'
import { parseError } from '@/utils/errorParser'
import { CostFormData, CostItem } from '@/types'




export default function CostManagement() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [costData, setCostData] = useState<CostItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)
    const [itemToEdit, setItemToEdit] = useState<string | null>(null)

    const { open, onClose, setOpen } = useDisclosure()


    // Fetch cost data from Firestore
    const fetchCostData = async () => {
        try {
            setIsLoading(true)
            const costsCollection = collection(db, 'costs')
            const costsSnapshot = await getDocs(costsCollection)
            const costsData = costsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as CostItem[]

            setCostData(costsData)
        } catch (error) {
            console.error('Error fetching cost data:', error)
            toaster.create({
                title: 'Error loading cost items',
                description: parseError(error),
                type: 'error',
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Load cost data when component mounts
    useEffect(() => {
        fetchCostData()
    }, [])

    const onSubmit = async (data: CostFormData) => {
        try {
            setIsSubmitting(true)

            // Add timestamp and prepare data for Firestore
            const costData = {
                ...data,
                createdAt: serverTimestamp(),
            }

            // Add document to Firestore
            await addDoc(collection(db, 'costs'), costData)

            toaster.create({
                title: 'Cost item added',
                description: `${data.category} has been added successfully`,
                type: 'success',
            })

            // Refresh cost data
            fetchCostData()

            // Reset form and close dialog
            onClose()
        } catch (error) {
            console.error('Error adding cost item: ', error)
            toaster.create({
                title: 'Error adding cost item',
                description: parseError(error),
                type: 'error',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditItem = async (data: CostFormData) => {
        try {
            setIsSubmitting(true)
            const docRef = doc(db, 'costs', itemToEdit as string)
            await setDoc(docRef, data, { merge: true })
            toaster.create({
                title: 'Cost item updated',
                description: `${data.category} has been updated successfully`,
                type: 'success',
            })
            fetchCostData()
        } catch (error) {
            console.error('Error updating cost item: ', error)
            toaster.create({
                title: 'Error updating cost item',
                description: parseError(error),
                type: 'error',
            })
        } finally {
            setEditModalOpen(false)
            setItemToEdit(null)
            setIsSubmitting(false)
        }
    }


    // Handle deleting cost item
    const handleDeleteItem = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'costs', id))
            toaster.create({
                title: 'Cost item deleted',
                description: 'The item has been deleted successfully',
                type: 'success',
            })
            fetchCostData()
        } catch (error) {
            console.error('Error deleting cost item: ', error)
            toaster.create({
                title: 'Error deleting cost item',
                description: parseError(error),
                type: 'error',
            })
        } finally {
            setDeleteModalOpen(false)
            setItemToDelete(null)
        }
    }

    // Format the rate and unit for display
    const formatRateWithUnit = (rate: string, unit?: string) => {
        const parsedRate = parseFloat(rate)
        if (isNaN(parsedRate)) return 'Invalid rate'
        if (!unit) return `$${parsedRate.toFixed(2)}`
        return `$${parsedRate.toFixed(2)}${unit}`
    }

    const costItemsCategories = costData.map(item => item.category)


    if (isLoading) {
        return <CostManagementSkeleton />
    }
    return (
        <VStack
            alignItems="flex-start"
            width="100%"
            alignSelf="stretch"
            borderRadius="4xl"
            bg="bg"
            gap={6}
            p={5}
        >
            <HStack width="100%" justifyContent="space-between">
                <Heading as="h1" fontWeight="bold">
                    Cost Management
                </Heading>
                <CostItemModal
                    open={open}
                    setOpen={setOpen}
                    onSubmit={onSubmit}
                    submitting={isSubmitting}
                    categories={costItemsCategories}
                >
                    <Button colorPalette="green" fontSize="small">
                        Add New Cost Item
                    </Button>
                </CostItemModal>
            </HStack>

            <VStack width="100%" border="1.5px solid" borderColor="border.muted" borderRadius="md">
                <Table.Root size="sm" variant="line">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader
                                color="fg.subtle"
                                fontSize="xs"
                                htmlWidth="35%"
                                fontWeight="medium"
                            >
                                Category
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                                color="fg.subtle"
                                fontSize="xs"
                                htmlWidth="35%"
                                fontWeight="medium"
                            >
                                Description
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                                color="fg.subtle"
                                fontSize="xs"
                                htmlWidth="25%"
                                fontWeight="medium"
                            >
                                Rate
                            </Table.ColumnHeader>
                            <Table.ColumnHeader htmlWidth="5%"></Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {isLoading ? (
                            <Table.Row>
                                <Table.Cell colSpan={4} textAlign="center">
                                    Loading...
                                </Table.Cell>
                            </Table.Row>
                        ) : costData.length === 0 ? (
                            <Table.Row>
                                <Table.Cell colSpan={4} textAlign="center">
                                    No cost items available
                                </Table.Cell>
                            </Table.Row>
                        ) : (
                            costData.map(item => (
                                <Table.Row key={item.id}>
                                    <Table.Cell py={0}>{item.category}</Table.Cell>
                                    <Table.Cell py={0}>{item.description}</Table.Cell>
                                    <Table.Cell py={0}>
                                        {formatRateWithUnit(item.rate.toString(), item.unit)}
                                    </Table.Cell>
                                    <Table.Cell py={0}>
                                        <Flex gap={1} p={0} m={0}>
                                            <Button
                                                fontSize="small"
                                                variant="ghost"
                                                p={1}
                                                colorPalette="transparent"
                                                onClick={() => {
                                                    setItemToEdit(item.id)
                                                    setEditModalOpen(true)
                                                }}
                                            >
                                                <EditIcon width="18px" height="18px" />
                                            </Button>
                                            <Button
                                                fontSize="small"
                                                variant="ghost"
                                                p={1}
                                                colorPalette="transparent"
                                                onClick={() => {
                                                    setItemToDelete(item.id)
                                                    setDeleteModalOpen(true)
                                                }}
                                            >
                                                <DeleteIcon width="18px" height="18px" color="red" />
                                            </Button>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        )}
                    </Table.Body>
                </Table.Root>
            </VStack>

            <DialogRoot
                placement="center"
                open={deleteModalOpen}
                onOpenChange={() => setDeleteModalOpen(!deleteModalOpen)}
                unmountOnExit
            >
                <DialogContent borderRadius="3xl" py={4} width="fit-content">
                    <DialogBody pb="2">
                        <DialogTitle mb={2}>Delete Cost Item</DialogTitle>
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
                                    onClick={() => {
                                        if (itemToDelete) {
                                            handleDeleteItem(itemToDelete)
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </HStack>
                    </DialogBody>
                </DialogContent>
            </DialogRoot>

            {itemToEdit && (
                <CostItemModal
                    open={editModalOpen}
                    setOpen={(open) => {
                        setEditModalOpen(open)
                        if (!open) setItemToEdit(null)
                    }}
                    mode="edit"
                    onSubmit={handleEditItem}
                    submitting={isSubmitting}
                    defaultValues={costData.find(item => item.id === itemToEdit) || undefined}
                    categories={costItemsCategories}
                >
                    <span style={{ display: 'none' }}></span>
                </CostItemModal>
            )}
        </VStack>
    )
}

