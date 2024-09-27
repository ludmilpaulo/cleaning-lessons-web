interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full relative">
          {/* Close button in top-right corner */}
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
          <div>{children}</div>
          {/* Cancel Button */}
          <div className="mt-4 flex justify-end">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  