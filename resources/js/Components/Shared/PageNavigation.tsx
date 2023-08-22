import {
    PaginationLinksProps,
    PaginationMetaProps,
} from "@/Interfaces/PostPage";
import { PageProps } from "@/types";
import React from "react";
import NavLink from "../NavLink";

const PageNavigation: React.FC<{
    links: PaginationLinksProps;
    meta: PaginationMetaProps;
}> = ({ links, meta }) => {
    return (
        <div className="dark:text-white space-x-5">
            <NavLink
                onClick={(e) => {
                    links.prev || e.preventDefault();
                }}
                active={links.prev ? true : false}
                href={`${links.prev || "#"}`}
                className="p-5 rounded-xl border inline-block shadow-lg shadow-gray-500"
            >
                <span>Poprzednia</span>
            </NavLink>
            <button className="font-semibold p-5 rounded-xl border inline-block shadow-lg shadow-gray-500">
                <span>Strona: {meta.current_page}</span>
            </button>
            <NavLink
                onClick={(e) => {
                    links.next || e.preventDefault();
                }}
                active={links.next ? true : false}
                href={`${links.next || "#"}`}
                className="p-5 rounded-xl border inline-block shadow-lg shadow-gray-500"
            >
                <span>Następna</span>
            </NavLink>
        </div>
    );
};

export default PageNavigation;
