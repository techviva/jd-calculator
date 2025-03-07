import React from 'react';
import { VStack, HStack, Flex } from '@chakra-ui/react';
import { Skeleton } from './skeleton';

const ProjectDetailsSkeleton = () => {
    return (
        <VStack
            justifyContent="center"
            alignItems="center"
            alignSelf="stretch"
            gap={4}
            width="100%"
        >
            <VStack
                alignItems="center"
                width="100%"
                borderRadius="4xl"
                bg="bg"
                p={5}
                alignSelf="stretch"
                gap={6}
            >
                <VStack alignItems="center">
                    <Skeleton height="30px" width="60%" />
                    <Flex width="fit-content" gap={2} alignItems="center">
                        <Skeleton height="30px" width="100px" />
                        <Skeleton height="30px" width="150px" />
                        <Skeleton height="30px" width="150px" />
                    </Flex>
                </VStack>
                <HStack width="100%" justifyContent="space-between" wrap="wrap" alignItems="flex-start" rowGap={2} pr={10}>
                    <Skeleton height="20px" width="30%" />
                    <Skeleton height="20px" width="30%" />
                    <Skeleton height="20px" width="30%" />
                    <Skeleton height="20px" width="30%" />
                </HStack>
                <VStack width="100%" border="1.5px solid" borderColor="border.muted" borderRadius="md" p={4}>
                    <Skeleton height="40px" width="100%" />
                    {Array.from({ length: 5 }).map((_, index) => (
                        <HStack key={index} p={4} width="100%" justifyContent="space-between" pr={10}>
                            <Skeleton height="20px" width="60%" />
                            <Skeleton height="20px" width="10%" />
                            <Skeleton height="20px" width="10%" />
                            <Skeleton height="20px" width="10%" />
                        </HStack>
                    ))}
                    <HStack p={4} justifyContent="space-between" width="100%">
                        <Skeleton height="20px" width="30%" />
                        <Skeleton height="20px" width="30%" />
                    </HStack>
                </VStack>
            </VStack>
        </VStack>
    );
};

export default ProjectDetailsSkeleton;