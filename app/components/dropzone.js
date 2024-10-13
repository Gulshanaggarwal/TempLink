'use client'
import { useState } from 'react'
import { MdFileUpload, MdOutlineArrowForward, MdOutlineCancel } from 'react-icons/md'
import { FaFileExcel, FaTimes } from 'react-icons/fa'
import { useAppState } from '../contexts/AppStateContext'
import SettingsModal from './SettingsModal'
import { FaFilePdf, FaFileCsv, FaFileWord, FaFilePowerpoint, FaFileVideo, FaFile, FaFileAudio } from "react-icons/fa6";

const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'text/plain',
  'audio/mpeg',
  'audio/ogg', 
  'audio/wav',
  'video/mp4',
]
export default function Dropzone() {
  const {state, dispatch} = useAppState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const {files} = state;

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(
      (file) => allowedFileTypes.includes(file.type) && file.size <= 25 * 1024 * 1024
    );
    dispatch({ type: 'SET_FILES', payload: [...state.files, ...newFiles] });
    if(currentIndex > 0){
      setCurrentIndex(files.length-1);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files).filter(
      (file) => allowedFileTypes.includes(file.type) && file.size <= 25 * 1024 * 1024
    );
    dispatch({ type: 'SET_FILES', payload: [...files, ...newFiles] });
    if(currentIndex > 0){
      setCurrentIndex(files.length-1);
    }
  };
  

  const handleDragOver = e => {
    e.preventDefault()
  }

  const removeFile = file => {
    dispatch({ type: 'SET_FILES', payload: files.filter(f => f !== file) })
  }

  const handleNext = () => {
    // Move forward by one file, but ensure you don't go beyond the total number of files
    if (currentIndex + 3 < files.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrev = () => {
    // Move backward by one file, but ensure you don't go below 0
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };



  const handleGenerateTempLink = () => {
    dispatch({type: 'RESET_SETTINGS_MODAL'});
    document.getElementById('settings-modal').showModal()
  }

  const renderFileUI = (file) => {

    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const excelTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const powerpointTypes = ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    const wordTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const audioTypes = ['audio/mpeg', 'audio/ogg', 'audio/wav'];
    const videoTypes = ['video/mp4'];
    const csvTypes = ['text/csv'];
    const pdfTypes = ['application/pdf'];


    if(imageTypes.includes(file.type)){
      return (
          <img className='image-to-render-on-home' src={URL.createObjectURL(file)} width="200px" height="100px" alt={file.name} />
      )
    }
    else if(excelTypes.includes(file.type)){
      return <FaFileExcel style={{width:'150px', height:'100px', color:'white'}} />
    }
    else if(powerpointTypes.includes(file.type)){
      return <FaFilePowerpoint style={{width:'150px', height:'100px', color:'white'}} />
    }
    else if(wordTypes.includes(file.type)){
      return <FaFileWord style={{width:'150px', height:'100px', color:'white'}} />
    }
    else if(audioTypes.includes(file.type)){
      return <FaFileAudio style={{width:'150px', height:'100px', color:'white'}} />
    }
    else if(videoTypes.includes(file.type)){
      return <FaFileVideo style={{width:'150px', height:'100px', color:'white'}} />
    }
    else if(csvTypes.includes(file.type)){
      return <FaFileCsv style={{width:'150px', height:'100px', color:'white'}} />
    }
    else if(pdfTypes.includes(file.type)){
      return <FaFilePdf style={{width:'150px', height:'100px', color:'white'}} />
    }
    else {
      return <FaFile style={{width:'150px', height:'100px', color:'white'}} />
    }


  }

  const getTrimmedFileName = (fileName) => {
    // Split the filename and the extension
    const extensionIndex = fileName.lastIndexOf('.');
    const name = fileName.slice(0, extensionIndex); // File name without extension
    const extension = fileName.slice(extensionIndex); // File extension (including the dot)
  
    // If the name part is too long, trim it but keep the extension intact
    if (name.length > 15) {
      return (
        <p className='text-sm font-bold text-white'>
          {name.slice(0, 15) + '...' + extension}
        </p>
      );
    }
  
    // If the name is short enough, return it as is
    return (
      <p className='text-sm font-bold text-white'>
        {fileName}
      </p>
    );
  };


  console.log('files',files);
  

  return (
    <div className='flex flex-col gap-4 bg-white shadow-xl p-6 rounded-xl'>
      <div className='flex justify-center gap-4'>
        <label
          htmlFor='file-upload'
          className="btn btn-primary btn-sm"
        >
          <span className='flex items-center gap-2'>
            <MdFileUpload size={20} />
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
        <button 
        className={`btn btn-error btn-sm text-white ${files.length === 0 && 'opacity-50 pointer-events-none cursor-not-allowed'}`}
        onClick={() => dispatch({ type: 'SET_FILES', payload: [] })}
        >
          <MdOutlineCancel size={20}/>
          CLEAR QUEUE
        </button>
      </div>

      <div className={`relative ${files.length === 0 && 'opacity-50 pointer-events-none'}`}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`relative px-4 mx-10 h-60 border-2 border-dashed border-gray-300 mb-5 overflow-hidden }`}
        >
          {files.length > 0 ? (
            <div className='h-full w-full flex justify-center items-center gap-6 px-4'>
              {files.slice(currentIndex, currentIndex + 3).map((file, index) => (
                <div key={index} className={`relative flex flex-col gap-2 w-48 h-40 bg-gray-400 shadow-inner rounded py-3 px-2`}>
                  {getTrimmedFileName(file.name)}
                  {renderFileUI(file)}
                  <button
                    className='absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full cursor-pointer'
                    onClick={() => removeFile(file)}
                  >
                    <FaTimes size={10}/>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className='w-full h-full flex flex-col justify-center items-center gap-2'>
                <h4 className='text-xl font-semibold'>Drop your files here</h4> 
                <p className='text-sm text-gray-500'>Attach as many as files you like, each file shouldn&apos;t exceed 25mb</p>
            </div>
          )}

        </div>
        <div className="absolute -left-4 -right-4 top-24 flex -translate-y-1/2 transform justify-between">
          <button className={`btn btn-circle text-red-400 text-2xl`} disabled= {currentIndex == 0 || files.length === 0} onClick={handlePrev}>❮</button>
          <button 
          className={`btn btn-circle text-red-400 text-2xl`}
          disabled= {currentIndex == files.length - 1 || files.length === 0} 
          onClick={handleNext}>❯</button>
        </div>
        <div className="flex justify-center">
          <button 
          className="btn btn-neutral btn-sm"
          onClick={handleGenerateTempLink}
          > 
          PROCEED 
          <MdOutlineArrowForward size={20}/>
          </button>
        </div>
        <SettingsModal/>
      </div>
    </div>
  )
}
