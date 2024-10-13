import { useAppState } from "../contexts/AppStateContext";

export default function ListFiles ({ tempLinkId,files = [] }) {
 

  const { state, dispatch } = useAppState();

  const { downloads } = state.myTemplinkPageData;
  


  const handleView = (url) => {
    window.open(url, '_blank');
  }

  const handleDownload = async (e, file) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`/api/image?tempLinkId=${tempLinkId}&imageId=${file._id}&type=all`);
      if (!response.ok) {
        throw new Error('Failed to fetch file');
    }

     const downloadStateObj = {
        tempLinkId: tempLinkId,
        fileId: file._id,
        status: 'LOADING'
      }
      dispatch({type: "SET_MY_TEMP_LINK_PAGE_DATA", payload: {downloads: [...downloads, downloadStateObj]}});
      const data = await response.json();
  
      data.files.forEach((file) => {
        const byteCharacters = atob(file.buffer);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
  
        const blob = new Blob([byteArray], { type: file.contentType });
        const blobUrl = window.URL.createObjectURL(blob);
  
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', file.fileName);
        document.body.appendChild(link);
        link.click();
  
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        downloadStateObj.status = 'DONE';
      });
      dispatch({type: "SET_MY_TEMP_LINK_PAGE_DATA", payload: {downloads: [...downloads, downloadStateObj]}});
  
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    const formattedSize = (bytes / Math.pow(1024, i)).toFixed(2); 
    
    return `${formattedSize} ${sizes[i]}`;
  }


  function getFileTypeDescription(mimeType) {
    const types = {
      'image/jpeg': 'JPEG Image',
      'image/png': 'PNG Image',
      'image/gif': 'GIF Image',
      'image/webp': 'WebP Image',
      'image/svg+xml': 'SVG Image',
      'image/bmp': 'BMP Image',
      
      'application/pdf': 'PDF Document',
      'application/msword': 'Microsoft Word Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word Document (DOCX)',
      'application/vnd.ms-excel': 'Microsoft Excel Spreadsheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel Spreadsheet (XLSX)',
      'application/vnd.ms-powerpoint': 'Microsoft PowerPoint Presentation',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'Microsoft PowerPoint Presentation (PPTX)',
      
      'text/plain': 'Text Document',
      'text/csv': 'CSV File',
      'text/html': 'HTML Document',
      
      'audio/mpeg': 'MP3 Audio',
      'audio/ogg': 'OGG Audio',
      'audio/wav': 'WAV Audio',
      
      'video/mp4': 'MP4 Video',
      'video/x-msvideo': 'AVI Video',
      'video/x-ms-wmv': 'WMV Video',
      'video/mpeg': 'MPEG Video',
      
      'application/zip': 'ZIP Archive',
      'application/x-rar-compressed': 'RAR Archive',
      'application/x-7z-compressed': '7z Archive',
      'application/gzip': 'GZIP Archive',
    };
  
    // Return the user-friendly name if it exists in the map, otherwise return 'Unknown Type'
    return types[mimeType] || 'Unknown Type';
  }
  
  
  

  return (
    <div>
      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>fileName</th>
              <th>Type</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
                files.map((file, index) => {
                    return (
                        <tr key={index} className="hover">
                            <td>{file.fileName}</td>
                            <td>{getFileTypeDescription(file.fileType)}</td>
                            <td>{formatBytes(file.size)}</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <button className="btn btn-link" onClick={()=>handleView(file.signedURL)}>View</button>
                                    <button className="btn btn-neutral" onClick={(e) => handleDownload(e, file)}>
                                      {
                                        (() => {
                                          const download = downloads.find((download) => download.fileId === file._id);
                                          
                                          if (download) {
                                            if (download.status === 'LOADING') {
                                              return 'Downloading...';
                                            } else if (download.status === 'DONE') {
                                              return 'Downloaded';
                                            }
                                          }
                                          
                                          return 'Download'; // Default case if no matching download or no specific status
                                        })()
                                      }
                                    </button>

                                </div>
                            </td>
                        </tr>
                    )
                })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
