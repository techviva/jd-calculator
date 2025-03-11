import { VStack, HStack, Flex, Box, } from '@chakra-ui/react'
import { Skeleton, SkeletonText } from './skeleton'

export default function ProjectDetailsSkeleton() {
    return (
        <VStack
            alignItems="center"
            width="100%"
            borderRadius="4xl"
            bg="bg"
            p={5}
            alignSelf="stretch"
            gap={6}
        >
            {/* Header section with project title and action buttons */}
            <VStack alignItems="flex-start" width="100%" gap={4}>
                <HStack width="100%" justifyContent="space-between">
                    <Skeleton height="28px" width="200px" />
                    <Flex gap={1}>
                        <Skeleton height="24px" width="24px" borderRadius="md" />
                        <Skeleton height="24px" width="24px" borderRadius="md" />
                    </Flex>
                </HStack>

                {/* Action buttons row */}
                <Flex width="100%" gap={3} alignItems="center" >
                    <Skeleton height="34px" width="120px" borderRadius="md" />
                    <Skeleton height="34px" width="150px" borderRadius="md" />
                    <Skeleton height="34px" width="140px" borderRadius="md" ml="auto" />
                </Flex>
            </VStack>

            {/* Project details section */}
            <HStack width="100%" justifyContent="flex-start" wrap="wrap" alignItems="flex-start" gap={60} rowGap={2} pr={10}>
                <Box width="150px">
                    <SkeletonText mt='4' noOfLines={2} gap={2} height={3} />
                </Box>
                <Box width="150px">
                    <SkeletonText mt='4' noOfLines={2} gap={2} height={3} />
                </Box>
                <Box width="200px">
                    <SkeletonText mt='4' noOfLines={2} gap={2} height={3} />
                </Box>
            </HStack>

            {/* Materials table section */}
            <VStack width="100%" border="1.5px solid" borderColor="border.muted" borderRadius="md">
                {/* Table header */}
                <Box width="100%" p={3} bg="bg">
                    <HStack>
                        <Skeleton height="18px" width="70%" />
                        <Skeleton height="18px" width="5%" />
                        <Skeleton height="18px" width="10%" />
                        <Skeleton height="18px" width="10%" />
                    </HStack>
                </Box>

                {/* Table rows */}
                {Array.from({ length: 5 }).map((_, index) => (
                    <Box key={index} width="100%" p={3}>
                        <HStack width="100%">
                            <Skeleton height="16px" width="70%" />
                            <Skeleton height="16px" width="5%" />
                            <Skeleton height="16px" width="10%" />
                            <Skeleton height="16px" width="10%" />
                        </HStack>
                    </Box>
                ))}

                {/* Table footer */}
                <HStack p={4} justifyContent="space-between" width="100%">
                    <Skeleton height="20px" width="80px" />
                    <Skeleton height="20px" width="80px" />
                </HStack>
            </VStack>
        </VStack>
    )
}
