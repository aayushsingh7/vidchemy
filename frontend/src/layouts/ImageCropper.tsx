// import React, { useState, useRef } from 'react';
// import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
// import type {Crop, PixelCrop} from "react-image-crop"
// import 'react-image-crop/dist/ReactCrop.css';

// function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
//   return centerCrop(
//     makeAspectCrop(
//       {
//         unit: '%',
//         width: 80,
//       },
//       aspect,
//       mediaWidth,
//       mediaHeight
//     ),
//     mediaWidth,
//     mediaHeight
//   );
// }

// interface ImageCropperProps {
//   imageUrl: string;
//   onClose: () => void;
// }

// export default function ImageCropper({ imageUrl, onClose }: ImageCropperProps) {
//   const [crop, setCrop] = useState<Crop>();
//   const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
//   const imgRef = useRef<HTMLImageElement | null>(null);

//   const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
//     const { width, height } = e.currentTarget;
//     setCrop(centerAspectCrop(width, height, 1));
//   };

//   const handleDownload = async () => {
//     const image = imgRef.current;
//     if (!image || !completedCrop?.width || !completedCrop?.height) return;

//     const canvas = document.createElement('canvas');
//     const scaleX = image.naturalWidth / image.width;
//     const scaleY = image.naturalHeight / image.height;
    
//     canvas.width = completedCrop.width * scaleX;
//     canvas.height = completedCrop.height * scaleY;
    
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     ctx.drawImage(
//       image,
//       completedCrop.x * scaleX,
//       completedCrop.y * scaleY,
//       completedCrop.width * scaleX,
//       completedCrop.height * scaleY,
//       0,
//       0,
//       canvas.width,
//       canvas.height
//     );

//     canvas.toBlob((blob: Blob | null) => {
//       if (!blob) return;
//       const previewUrl = URL.createObjectURL(blob);
//       const anchor = document.createElement('a');
//       anchor.download = 'cropped-image.png';
//       anchor.href = previewUrl;
//       anchor.click();
//       URL.revokeObjectURL(previewUrl);
//     }, 'image/png');
//   };

//   return (
//     <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-full flex flex-col overflow-hidden">
        
//         {/* Header */}
//         <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Crop your Image</h2>
//             <p className="text-gray-500 text-sm mt-1">Scroll to view the whole image and adjust the frame.</p>
//           </div>
//           <button 
//             onClick={onClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="flex-1 min-h-0 bg-gray-50/50 overflow-auto p-4 sm:p-6">
//           <div className="w-full flex justify-center items-start">
//             <ReactCrop
//               crop={crop}
//               onChange={(_, percentCrop) => setCrop(percentCrop)}
//               onComplete={(c) => setCompletedCrop(c)}
//               aspect={1}
//             >
//               <img
//                 ref={imgRef}
//                 src={imageUrl}
//                 alt="Crop me"
//                 onLoad={onImageLoad}
//                 crossOrigin="anonymous"
//                 className="max-w-full h-auto object-contain rounded-md shadow-sm block" 
//               />
//             </ReactCrop>
//           </div>
//         </div>

//         <div className="p-5 border-t border-gray-100 shrink-0 bg-white flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleDownload}
//             disabled={!completedCrop?.width || !completedCrop?.height}
//             className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//             </svg>
//             Download Crop
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import type {Crop, PixelCrop} from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 80,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

interface ImageCropperProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImageCropper({ imageUrl, onClose }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [rotation, setRotation] = useState<number>(0); // Added rotation state
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const handleDownload = async () => {
    const image = imgRef.current;
    if (!image || !completedCrop?.width || !completedCrop?.height) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // Calculate the actual size of the crop on the high-res original image
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    // Convert rotation degrees to radians for canvas math
    const rotateRads = rotation * (Math.PI / 180);
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();
    
    // 1. Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    // 2. Move to the center of the original image
    ctx.translate(centerX, centerY);
    // 3. Rotate the canvas around the center
    ctx.rotate(rotateRads);
    // 4. Move back to the top-left of the original image
    ctx.translate(-centerX, -centerY);

    // Draw the image with the applied transformations
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();

    canvas.toBlob((blob: Blob | null) => {
      if (!blob) return;
      const previewUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = 'cropped-rotated-image.png';
      anchor.href = previewUrl;
      anchor.click();
      URL.revokeObjectURL(previewUrl);
    }, 'image/png');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-full flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Crop & Rotate Image</h2>
            <p className="text-gray-500 text-sm mt-1">Scroll to view the whole image, adjust the frame, and rotate.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cropper Container */}
        <div className="flex-1 min-h-0 bg-gray-50/50 overflow-auto p-4 sm:p-6">
          <div className="w-full flex justify-center items-start">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Crop me"
                onLoad={onImageLoad}
                crossOrigin="anonymous"
                className="max-w-full h-auto object-contain rounded-md shadow-sm block transition-transform duration-100 ease-out" 
                style={{ transform: `rotate(${rotation}deg)` }} // Applied the rotation here
              />
            </ReactCrop>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 shrink-0 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Rotation Controls */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-auto justify-center">
            <button
              onClick={() => setRotation(r => r - 1)}
              className="p-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm transition-colors"
              title="Rotate left 1 degree"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <div className="relative">
              <input
                type="number"
                value={rotation}
                onChange={(e) => setRotation(e.target.value ? Number(e.target.value) : 0)}
                className="w-16 py-2 text-center bg-transparent text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md appearance-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">°</span>
            </div>

            <button
              onClick={() => setRotation(r => r + 1)}
              className="p-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm transition-colors"
              title="Rotate right 1 degree"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={!completedCrop?.width || !completedCrop?.height}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}