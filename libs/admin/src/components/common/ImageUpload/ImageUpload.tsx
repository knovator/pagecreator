import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import SmallCancel from '../../../icons/close';
import { ImageUploadProps } from 'libs/admin/src/types';
import { build_path, isEmpty, isString } from '../../../helper/utils';

const ImageUpload = ({
  className,
  text,
  maxSize,
  setImgId,
  onError,
  error,
  imgId = '',
  onImageUpload,
  onImageRemove,
  baseUrl,
  disabled = false,
}: ImageUploadProps) => {
  const [img, setImg] = useState<string | undefined>(undefined);
  const { getRootProps, getInputProps } = useDropzone({
    // accept: {
    //   "image/*": [".jpeg,.jpg,.png"],
    // },
    noClick: true,
    multiple: false,
    minSize: 0,
    maxSize,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      try {
        onError('');
        if (acceptedFiles?.length > 0) {
          const regex = /\.(png|jpeg|jpg|svg)$/gi;
          const files = acceptedFiles.filter((file) => regex.test(file.name));
          if (files[0]) {
            const response = await onImageUpload(files[0]);
            if (response) {
              setImg(response.fileUrl);
              setImgId(response.fileId);
            }
          } else
            throw new Error(
              'File type must be .png, .jpg, .jpeg, .gif, or .svg'
            );
        } else if (
          rejectedFiles?.[0]?.errors?.[0]?.message ===
          'File is larger than 10485760 bytes'
        ) {
          throw new Error('File is larger than 10mb');
        }
      } catch (error) {
        onError((error as Error).message);
      }
    },
  });

  const onRemoveFile = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      if (onImageRemove && imgId)
        await onImageRemove(typeof imgId === 'string' ? imgId : imgId['_id']);

      setImgId(null);
      setImg('');
    } catch (error) {
      onError((error as Error).message);
    }
  };

  useEffect(() => {
    if (imgId && typeof imgId === 'object') {
      setImg(build_path(baseUrl, imgId['uri']));
    }
  }, [baseUrl, imgId]);

  const showImage = (fileUrl: string) => {
    return (
      <div className="khb_img-wrapper">
        <img src={`${fileUrl}`} alt="" className="khb_img-wrapper-img" />
        <button
          disabled={disabled}
          onClick={onRemoveFile}
          className="khb_img-wrapper-del"
        >
          <SmallCancel />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="khb_img-upload-wrapper-1">
        <div className="khb_img-upload-wrapper-2">
          {!isEmpty(img) && isString(img) && img ? (
            showImage(img)
          ) : (
            <div
              {...getRootProps({
                className,
              })}
            >
              <input
                disabled={disabled}
                {...getInputProps()}
                id="file-upload"
              />
              {text}
            </div>
          )}
        </div>
      </div>
      {error && <p className="khb_input-error">{error}</p>}
    </>
  );
};

export default React.memo(ImageUpload);
