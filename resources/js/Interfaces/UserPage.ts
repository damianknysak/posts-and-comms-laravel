import { PaginationLinksProps, PaginationMetaProps } from "./PostPage";

export interface UserProps {
    id: number;
    email: string;
    emailVerifiedAt: Date;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    postsAmount: number;
    commentsAmount: number;
    postsRoute: string;
    commentsRoute: string;
    profileImage: string;
    blurHash: string;
    dateOfBirth: Date;
}

export interface UsersPage {
    data: Array<UserProps>;
    links: PaginationLinksProps;
    meta: PaginationMetaProps;
}
