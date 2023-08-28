import { ReactionProps } from "@/Interfaces/ReactionProps";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    FaHeart,
    FaLaughBeam,
    FaRegHeart,
    FaRegLaughBeam,
    FaRegSadCry,
    FaRegThumbsUp,
    FaSadCry,
    FaThumbsUp,
} from "react-icons/fa";

interface PostBottomSectionProps {
    commentsAmount: number;
    likes: ReactionProps;
    commentsRoute: string;
    postId: number;
}

const PostBottomSection: React.FC<PostBottomSectionProps> = ({
    commentsAmount,
    likes,
    postId,
}) => {
    const [reactionType, setReactionType] = useState("");

    const addLike = async (reaction: string) => {
        try {
            const formData = new FormData();
            formData.append("reaction", reaction);
            //dislike
            if (reactionType == reaction) {
                setReactionType("");
                const response = await axios.delete(`/posts/${postId}/dislike`);
            } else {
                //like
                setReactionType(reaction);
                const response = await axios.post(
                    `/posts/${postId}/like`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }
            router.reload({ only: ["posts", "post"] });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (likes.currentUserReaction) {
            setReactionType(likes.currentUserReaction);
        }
    }, [likes.currentUserReaction]);
    return (
        <div className="p-3 flex justify-between items-center">
            <div className="pr-5 flex flex-row space-x-2">
                <div
                    onClick={() => {
                        addLike("like");
                    }}
                    className="flex flex-col items-center cursor-pointer"
                >
                    {reactionType == "like" ? (
                        <FaThumbsUp className="text-blue-500" size={24} />
                    ) : (
                        <FaRegThumbsUp className="text-blue-500" size={24} />
                    )}

                    <span className="text-blue-500">
                        {likes.likeReactionAmount}
                    </span>
                </div>
                <div
                    onClick={() => {
                        addLike("haha");
                    }}
                    className="flex flex-col items-center"
                >
                    {reactionType == "haha" ? (
                        <FaLaughBeam className="text-yellow-200" size={24} />
                    ) : (
                        <FaRegLaughBeam className="text-yellow-200" size={24} />
                    )}
                    <span className="text-yellow-200">
                        {likes.hahaReactionAmount}
                    </span>
                </div>
                <div
                    onClick={() => {
                        addLike("super");
                    }}
                    className="flex flex-col items-center"
                >
                    {reactionType == "super" ? (
                        <FaHeart className="text-red-500" size={24} />
                    ) : (
                        <FaRegHeart className="text-red-500" size={24} />
                    )}

                    <span className="text-red-500">
                        {likes.superReactionAmount}
                    </span>
                </div>
                <div
                    onClick={() => {
                        addLike("cry");
                    }}
                    className="flex flex-col items-center"
                >
                    {reactionType == "cry" ? (
                        <FaSadCry className="text-blue-700" size={24} />
                    ) : (
                        <FaRegSadCry className="text-blue-700" size={24} />
                    )}

                    <span className="text-blue-700">
                        {likes.cryReactionAmount}
                    </span>
                </div>
            </div>
            <div className="flex flex-col">
                <Link href={`/posts/${postId}`} className="">
                    <span>komentarze:</span> {commentsAmount}
                </Link>
            </div>
        </div>
    );
};

export default PostBottomSection;
