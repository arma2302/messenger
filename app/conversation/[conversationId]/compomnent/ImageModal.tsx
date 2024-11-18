import Modal from "@/app/component/Modal";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="h-80 w-80">
          <Image alt="image" src={src} fill className="object-cover"></Image>
        </div>
      </Modal>
    </div>
  );
};

export default ImageModal;
