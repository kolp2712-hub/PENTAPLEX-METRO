import React, { useRef } from 'react';
import { Upload, Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

interface ImageManagerProps {
  images: string[];
  onChange: (newImages: string[]) => void;
  label: string;
}

export const ImageManager: React.FC<ImageManagerProps> = ({ images = [], onChange, label }) => {
  const { compressAndSetImage } = useSite();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeImages = Array.isArray(images) ? images : [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const newBase64Images: string[] = [];
    
    for (const file of files) {
      await new Promise<void>((resolve) => {
        compressAndSetImage(file, (base64) => {
          newBase64Images.push(base64);
          resolve();
        });
      });
    }
    
    if (newBase64Images.length > 0) {
      onChange([...safeImages, ...newBase64Images]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...safeImages];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === safeImages.length - 1) return;

    const newImages = [...safeImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    onChange(newImages);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files) as File[];
    const newBase64Images: string[] = [];

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await new Promise<void>((resolve) => {
          compressAndSetImage(file, (base64) => {
            newBase64Images.push(base64);
            resolve();
          });
        });
      }
    }

    if (newBase64Images.length > 0) {
      onChange([...safeImages, ...newBase64Images]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        <span className="text-xs text-gray-400">{safeImages.length}개의 이미지</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {safeImages.map((img, index) => (
          <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50 group">
            <img src={img} alt={`${label} ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => moveImage(index, 'up')}
                disabled={index === 0}
                className="p-2 bg-white rounded-full text-gray-900 shadow-lg disabled:opacity-30"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveImage(index, 'down')}
                disabled={index === safeImages.length - 1}
                className="p-2 bg-white rounded-full text-gray-900 shadow-lg disabled:opacity-30"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeImage(index)}
                className="p-2 bg-white rounded-full text-red-500 shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
              {index + 1}
            </div>
          </div>
        ))}

        <div
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all group"
        >
          <div className="p-3 bg-gray-100 rounded-full text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-200 transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600">이미지 추가 (드래그 가능)</span>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};
