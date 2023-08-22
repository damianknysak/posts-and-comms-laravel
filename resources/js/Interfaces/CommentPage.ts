import { AuthorProps } from "./AuthorProps";
import { PaginationLinksProps, PaginationMetaProps } from "./PostPage";

export interface CommentProps {
    id: number;
    comment: string;
    authorId: number;
    author: AuthorProps;
    postId: number;
    createdAt: Date;
    authorImage: string;
}

export interface CommentsPage {
    data: Array<CommentProps>;
    links: PaginationLinksProps;
    meta: PaginationMetaProps;
}
