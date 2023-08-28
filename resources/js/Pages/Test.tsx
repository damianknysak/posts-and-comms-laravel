import React, { useEffect, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const Test = () => {
    const [image, setImage] = useState("");
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState<any>();

    const onChange = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as any);
        };
        reader.readAsDataURL(files[0]);
    };

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas().toDataURL());
        }
        console.log("This is the Croped Image", cropData);
    };

    return (
        <>
            <div className="w-[100%] text-center text-[25px]">
                Image Cropper
            </div>
            <div className="flex gap-5 space-between w-[full] mb-[5px]">
                <input
                    type="file"
                    onChange={onChange}
                    className="bg-red-200 rounded p-[8px] w-[50%]"
                />
                <button
                    onClick={getCropData}
                    className="bg-red-200 rounded p-[8px]"
                >
                    Crop Image
                </button>
            </div>
            <div className="flex gap-5 space-between">
                <Cropper
                    viewMode={3}
                    aspectRatio={4 / 3}
                    src={image}
                    background={false}
                    responsive={true}
                    onInitialized={(instance: any) => {
                        setCropper(instance);
                    }}
                    zoomable={false}
                />
                {cropData != "#" && (
                    <img className="w-16 h-12" src={cropData} />
                )}
            </div>
        </>
    );
};

export default Test;
