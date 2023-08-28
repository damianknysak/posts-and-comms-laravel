import React, { useState } from "react";
import { Blurhash } from "react-blurhash";

interface UserImageProps {
    imageUrl: string;
    imageHash: string;
    width: number;
    height: number;
}

const UserImage: React.FC<UserImageProps> = ({
    imageUrl,
    imageHash,
    width,
    height,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <div
            style={{ width: width, height: height }}
            className="rounded-full overflow-hidden"
        >
            {imageLoaded || (
                <Blurhash width={width} height={height} hash={imageHash} />
            )}
            <img
                onLoad={() => {
                    setImageLoaded(true);
                }}
                style={{ width: width, height: height }}
                className={
                    imageLoaded
                        ? "rounded-full object-contain bg-black/75"
                        : "w-0 h-0"
                }
                src={`http://192.168.0.124:8000/storage/${imageUrl}`}
            />
        </div>
    );
};

export default UserImage;
