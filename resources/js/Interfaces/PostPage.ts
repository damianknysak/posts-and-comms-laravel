import { PostProps } from "./PostProps";

export interface PaginationLinksProps {
    first: string;
    last: string;
    prev: string;
    next: string;
}

export interface PaginationMetaLinksProps {
    url: string;
    label: string;
    active: boolean;
}

export interface PaginationMetaProps {
    current_page: number;
    last_page: number;
    links: PaginationMetaLinksProps;
    total: number;
}

export interface PostsPage {
    data: Array<PostProps>;
    links: PaginationLinksProps;
    meta: PaginationMetaProps;
}
