import React, { useState } from 'react';

function EditableButton(
    {value, setValue}:
    {
      value: number;
      setValue: React.Dispatch<React.SetStateAction<number>>;  
    }
 ) {
  const [isEditing, setIsEditing] = useState(false);

  const handlePClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setValue(Number(event.target.value));
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <input
      className="text-white text-3xl p-2 max-w-20 bg-[#6aa84f]"
      type="number"
      value={value}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : (
    <p className="text-white text-3xl p-2 min-w-10 max-w-20" onClick={handlePClick}>{value}</p>
  );
}

export default EditableButton;