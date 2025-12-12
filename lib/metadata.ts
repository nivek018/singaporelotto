import { Metadata } from "next";

export function constructMetadata({
    title = "SG Lotto Results",
    description = "Latest Singapore Lottery Results",
    path = "/",
}: {
    title?: string;
    description?: string;
    path: string;
}): Metadata {
    return {
        title,
        description,
        alternates: {
            canonical: path,
        },
    };
}
