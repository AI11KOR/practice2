import PostModal from "./PostModal";
import React from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';

const DaumPostcodeModal = ({ onClose, onComplete }) => {
    const handleComplete = (data) => {
        onComplete(data);
        onClose();
    };

    return (
        <PostModal onClose={onClose}>
            <DaumPostcodeEmbed onComplete={handleComplete} />
        </PostModal>
    );
};
export default DaumPostcodeModal;
