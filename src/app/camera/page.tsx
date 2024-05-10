"use client";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PiRecordFill } from "react-icons/pi";
import { MdCameraswitch } from "react-icons/md";
import { toast } from "react-toastify"

interface PhotoDisplayProps {
  photo: string;
  onClose: () => void;
  facingMode: "user" | "environment";
}

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({
  photo,
  onClose,
  facingMode,
}) => {
  const isMirrored = facingMode === "user";
  const router = useRouter();

  const handleCheck = () => {
    // Save photo and facingMode in localStorage
    sessionStorage.setItem("capturedPhoto", photo);
    sessionStorage.setItem("facingMode", facingMode);
    // Navigate to Landing page
    router.push("/");
  };

  return (
    <div className="fixed inset-0">
      <Image
        src={photo}
        alt="Captured"
        className={`transform ${
          isMirrored ? "scale-x-[-1]" : "scale-x-1"
        } object-cover w-full h-[78%]`}
        width={100}
        height={100}
      />
      <div
        className="fixed bottom-0 left-0 right-0 bg-[#3A3A3A] grid grid-cols-3 items-center px-10"
        style={{ height: "22vh" }}
      >
        <button onClick={onClose} className="text-white">
          <FontAwesomeIcon icon={faClose} size="3x" />
        </button>
        <div></div>
        <button onClick={handleCheck} className="text-white">
          <FontAwesomeIcon icon={faCheck} size="3x" />
        </button>
      </div>
    </div>
  );
};

const CameraPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Camera permission is blocked. Please enable the camera browser permission to proceed.");
    }
  }, [facingMode]);

  useEffect(() => {
    const currentVideoRef = videoRef.current; // Capture the current value

    initCamera(); // Call initCamera function when facingMode either 'user' or 'environment' changes

    return () => {
      const stream = currentVideoRef?.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [facingMode, initCamera]);

  const handleSwitchCamera = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "user" ? "environment" : "user"
    );
  };

  const handleCapturePhoto = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (videoRef.current && context) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const photoUrl = canvas.toDataURL("image/webp");
      setCapturedPhoto(photoUrl);
    }
  };

  const handlePhotoClose = () => {
    setCapturedPhoto(null);
    initCamera();
  };

  const isMirrored = facingMode === "user";

  return (
    <div>
      {capturedPhoto ? (
        <PhotoDisplay
          photo={capturedPhoto}
          onClose={handlePhotoClose}
          facingMode={facingMode}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              maxWidth: "100%",
              height: "600px",
              objectFit: "cover",
              transform: isMirrored ? "scaleX(-1)" : "none",
            }}
          />
          <div
            className="fixed bottom-0 left-0 right-0 bg-[#3A3A3A] grid grid-cols-3 items-center px-10"
            style={{ height: "22vh" }}
          >
            {/* Empty placeholder for the 1st col */}
            <div></div>
            <button className="text-white" onClick={handleCapturePhoto}>
              <PiRecordFill size={90} />
              {/* <FontAwesomeIcon icon={faCamera} size="3x" /> */}
            </button>
            <button
              className="text-white justify-self-end"
              onClick={handleSwitchCamera}
            >
              <MdCameraswitch size={42} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraPage;
