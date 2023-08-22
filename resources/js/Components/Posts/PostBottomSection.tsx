import { Link } from "@inertiajs/react";
import React from "react";
import { FaHeart, FaLaughBeam, FaSadCry, FaThumbsUp } from "react-icons/fa";

interface LikesProps {
    likeReactionAmount: number;
    hahaReactionAmount: number;
    superReactionAmount: number;
    cryReactionAmount: number;
}

interface PostBottomSectionProps {
    commentsAmount: number;
    likes: LikesProps;
    commentsRoute: string;
    postId: number;
}

const PostBottomSection: React.FC<PostBottomSectionProps> = ({
    commentsAmount,
    likes,
    commentsRoute,
    postId,
}) => {
    return (
        <div className="p-3 flex justify-between items-center">
            <div className="pr-5 flex flex-row space-x-2">
                <div className="flex flex-col items-center">
                    <FaThumbsUp className="text-blue-500" size={24} />
                    <span className="text-blue-500">
                        {likes.likeReactionAmount}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <FaLaughBeam className="text-yellow-200" size={24} />
                    <span className="text-yellow-200">
                        {likes.hahaReactionAmount}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <FaHeart className="text-red-500" size={24} />
                    <span className="text-red-500">
                        {likes.superReactionAmount}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <FaSadCry className="text-blue-700" size={24} />
                    <span className="text-blue-700">
                        {likes.cryReactionAmount}
                    </span>
                </div>
            </div>
            <div className="flex flex-col">
                <Link
                    onClick={(e) => {
                        commentsAmount <= 0 && e.preventDefault();
                    }}
                    href={`/posts/${postId}`}
                    className=""
                >
                    <span>komentarze:</span> {commentsAmount}
                </Link>
            </div>
        </div>
    );
};

export default PostBottomSection;
