import { HStack, Presence, Text } from "@chakra-ui/react";
import Link from "next/link";


interface NavItemProps {
    icon: React.ReactNode;
    title: string;
    active?: boolean;
    linkTo: string;
    isExtended?: boolean
}

export default function NavItem({ icon, title, active, linkTo, isExtended }: NavItemProps) {

    return (
        <Link href={linkTo} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "10px", gap: "10px", minHeight: "44px", width: "100%" }} >
            {icon}
            <Presence present={isExtended} animationName={{ _open: "slide-from-right, fade-in" }}
                animationDuration="0.6s" unmountOnExit >
                <Text textWrap="nowrap">{title}</Text>
            </Presence>
        </Link>
    );
}