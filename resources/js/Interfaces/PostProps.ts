import { ReactionProps } from "./ReactionProps";

export interface PostProps {
    id: number;
    title: string;
    slug: string;
    author: string;
    authorId: number;
    image: string;
    blurHash: string;
    createdAt: Date;
    commentsAmount: number;
    likes: ReactionProps;
    commentsRoute: string;
    authorImage: string;
    authorBlurHash: string;
}
