'use client'
import { useState } from 'react'
import { MdFileUpload } from 'react-icons/md'
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa'
import { AiOutlineFileExcel } from 'react-icons/ai'
import Image from 'next/image'
import { useAppState } from '../contexts/AppStateContext'
import SettingsModal from './SettingsModal'

export default function Dropzone() {
  const {state, dispatch} = useAppState();
  const [currentIndex, setCurrentIndex] = useState(0)
  const {files} = state;

  const handleFileChange = e => {
    dispatch({ type: 'SET_FILES', payload: [...state.files, ...Array.from(e.target.files)] })
  }

  const handleDrop = e => {
    e.preventDefault();
    dispatch({ type: 'SET_FILES', payload: [...files, ...Array.from(e.dataTransfer.files)] })
  }

  const handleDragOver = e => {
    e.preventDefault()
  }

  const removeFile = file => {
    dispatch({ type: 'SET_FILES', payload: files.filter(f => f !== file) })
  }

  const handleNext = () => {
    if (currentIndex < files.length - 3) {
      setCurrentIndex(currentIndex + 3)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 3)
    }
  }

  const isImage = file => {
    return file.type.startsWith('image/')
  }

  const isExcelOrCSV = file => {
    return (
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'text/csv'
    )
  }

  const handleGenerateTempLink = () => {
    dispatch({type: "TOGGLE_SETTINGS_MODAL"})
  }

  return (
    <div className='flex flex-col gap-4 bg-white shadow-xl p-6 rounded-xl'>
      <div className='flex justify-center'>
        <label
          htmlFor='file-upload'
          className='bg-violet-500 text-white px-4 py-2 rounded cursor-pointer'
        >
          <span className='flex items-center gap-2'>
            <MdFileUpload />
            <span>UPLOAD FILES</span>
          </span>
          <input
            id='file-upload'
            type='file'
            multiple
            onChange={handleFileChange}
            className='hidden'
          />
        </label>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className='relative w-full h-40 border-2 border-dashed border-gray-300 flex items-center justify-center mb-5 overflow-hidden'
      >
        {files.length > 0 ? (
          <div className='flex space-x-4'>
            {files.slice(currentIndex, currentIndex + 3).map((file, index) => (
              <div key={index} className='relative'>
                {isImage(file) ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={20}
                    height={20}
                  />
                ) : isExcelOrCSV(file) ? (
                  <div className='flex flex-col items-center justify-center h-20 w-20 bg-green-100 rounded-lg'>
                    <AiOutlineFileExcel size={50} className='text-green-600' />
                    <p className='text-sm text-center mt-2'>{file.name}</p>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center h-20 w-20 bg-gray-100 rounded-lg'>
                    <p className='text-sm text-center'>{file.name}</p>
                  </div>
                )}

                <button
                  className='absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full'
                  onClick={() => removeFile(file)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Drop your files here</p>
        )}

        <button
          onClick={handlePrev}
          className={`absolute left-8 top-1/2 transform -translate-y-1/2 -ml-8 p-2 bg-gray-800 text-white rounded-full ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          disabled={currentIndex === 0}
        >
          <FaArrowLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className={`absolute right-8 top-1/2 transform -translate-y-1/2 -mr-8 p-2 bg-gray-800 text-white rounded-full ${
            currentIndex >= files.length - 3
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }`}
          disabled={currentIndex >= files.length - 3}
        >
          <FaArrowRight size={24} />
        </button>
      </div>
      <div className="flex justify-center">
        <button 
        className={`${files.length < 1 && "disabled" } rounded bg-gray-700 text-white font-semibold py-2 px-4`}
        onClick={handleGenerateTempLink}
        > Generate Your TempLink
        </button>
      </div>
      <SettingsModal/>
    </div>
  )
}
