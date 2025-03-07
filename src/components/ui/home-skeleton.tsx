
import { HStack } from '@chakra-ui/react'
import React from 'react';
import { VStack, Flex, Box } from '@chakra-ui/react';
import { Skeleton } from './skeleton';


export default function HomeSkeleton() {
    return (
        <HStack
            height="max-content"
            width="100%"
            alignItems="flex-start"
            alignSelf="stretch"
            gap={4}
            py={2}
            wrap={{ base: 'wrap', lg: 'nowrap' }}
        >
            <VStack
                align="flex-start"
                width={{ base: '80%', lg: '60%' }}
                gap={2}
                pb={2}
                mt={{ base: 4, lg: 0 }}
                mr={{ base: 4, lg: 'auto' }}
            >
                <Skeleton height="40px" width="50%" />
                <Skeleton height="20px" width="30%" mt={-1} />
                <Flex gap={4} width="100%" wrap="wrap">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Box key={index} width="30%" p={4} borderRadius="3xl" bg="bg" boxShadow="sm">
                            <Skeleton height="20px" width="70%" mb={2} />
                            <Skeleton height="16px" width="90%" />
                        </Box>
                    ))}
                </Flex>
                <Box width="100%" p={6} borderRadius="3xl" bg="bg">
                    <HStack
                        pb={4}
                        borderBottom="2px solid"
                        borderColor="gray.emphasized"
                        mb={2}
                        justifyContent="space-between"
                    >
                        <Box width="fit-content">
                            <Skeleton height="20px" width="50%" />
                            <Skeleton height="30px" width="70%" />
                        </Box>
                        <Box>
                            <Flex alignItems="center">
                                <Skeleton height="10px" width="10px" borderRadius="full" mr={2} />
                                <Skeleton height="16px" width="50px" />
                            </Flex>
                            <Flex alignItems="center">
                                <Skeleton height="10px" width="10px" borderRadius="full" mr={2} />
                                <Skeleton height="16px" width="50px" />
                            </Flex>
                        </Box>
                    </HStack>
                    <Skeleton height="200px" />
                </Box>
            </VStack>
            <VStack
                gap={4}
                maxWidth={{ lg: '400px' }}
                minWidth="200px"
                width={{ base: '80%', lg: 'fit-content' }}
                alignItems="center"
                p={4}
                borderRadius="3xl"
                bg="spot"
                maxHeight={{ lg: '80dvh' }}
                height="100%"
                overflowY="auto"
                alignSelf={{ lg: 'flex-start' }}
            >
                <Flex justifyContent="space-between" width="100%" alignItems="center" color="fg.muted">
                    <Skeleton height="20px" width="50%" />
                    <Flex gap={1} align="center">
                        <Skeleton height="16px" width="40px" />
                        <Skeleton height="16px" width="16px" />
                    </Flex>
                </Flex>
                {Array.from({ length: 3 }).map((_, index) => (
                    <Box
                        key={index}
                        borderRadius="3xl"
                        minWidth="200px"
                        width="100%"
                        maxWidth="300px"
                        bg="bg"
                        p={4}
                        boxShadow="sm"
                    >
                        <VStack align="flex-start" gap="1" pb={1}>
                            <Box p={2} borderRadius="full" bg="bg.emphasized" width="28px" height="28px" />
                            <Skeleton height="20px" width="70%" mt="5" />
                            <Skeleton height="16px" width="90%" />
                            <Skeleton height="14px" width="40px" mt={1} />
                        </VStack>
                    </Box>
                ))}
            </VStack>
        </HStack>
    );
};
