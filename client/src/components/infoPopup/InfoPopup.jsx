import './InfoPopup.css';

export default function InfoPopup({message, onClose }) {
  return (
    <div className='infoPopupOverlay' onClick={onClose}>
      <div className='infoPopup' onClick={(e) => e.stopPropagation()}>
        <button className='closeBtn' onClick={onClose}>×</button>
        <h3>ℹ️Информация</h3>
        <div className='message'>{message}</div>
      </div>
    </div>
  );
};