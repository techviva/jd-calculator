import { HStack } from "@chakra-ui/react";
import { JobCardSkeleton } from "./job-card-skeleton";

export function JobPageSkeleton() {
    return (
        <HStack width="100%" alignItems="center" gap={4} flexWrap="wrap">
            {Array.from({ length: 6 }).map((_, index) => (
                <JobCardSkeleton key={index} />
            ))
            }
        </HStack>
    )
}