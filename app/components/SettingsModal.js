import { useAppState } from '../contexts/AppStateContext'
import { useState } from 'react'
export default function SettingsModal () {

  const { state, dispatch } = useAppState()
  const [isLoading, setIsLoading] = useState(false)
  const { files, isSettingsModalOpen, settingsModalData } = state
  const {password, isTempLinkCreated} = settingsModalData;


  const handleExpirySelection = e => {
    const value = e.target.value;
    const obj = {};
    const expiryTimes = {
        'NEVER': 0,
        '1-day': 86400000,
        '2-day': 172800000,
        '7-day': 604800000,
        '30-day': 2592000000,
        '60-day': 5184000000,
        '365-day': 31536000000
    };

    try {
        obj.time = value === 'NEVER' ? 0 : new Date().getTime() + (expiryTimes[value] || 0);
        obj.selectedOption = value;
        dispatch({ type: 'SET_EXPIRY_TIME', payload: obj });
    } catch (error) {
        console.error('Error: while setting expiry time', error);
    }
};

  const handlePasswordToggle = e => {
    dispatch({ type: 'SET_ERROR_IN_SETTINGS_MODAL', payload: null});
    dispatch({ type: 'PASSWORD_PROTECTION_TOGGLE', payload: e.target.checked});
  }

  const handleOnPasswordValueChange = e => {
    dispatch({ type: 'SET_ERROR_IN_SETTINGS_MODAL', payload: null});
    dispatch({ type: 'SET_PASSWORD', payload: e.target.value.trim()});
  }

  const handleTempLinkCreate = async() => {
    try {


      if(password.passwordProtection && password.passwordValue.length < 6){ 
         dispatch({type: 'SET_ERROR_IN_SETTINGS_MODAL', payload: 'Password must be atleast 6 characters long'});
        return;
      }

      if(password.passwordProtection && password.passwordValue.length > 15){
        dispatch({type: 'SET_ERROR_IN_SETTINGS_MODAL', payload: 'Password must be atmost 15 characters long'});
        return;
      }

       setIsLoading(true);
        const formData = new FormData();
        files.forEach((file,index) => {
            formData.append('files', file);
        })
       
        formData.append('settings', JSON.stringify(state.settingsModalData));

        let  response = await fetch('/api/templink', {
            method: 'POST',
            body: formData
        })

        response = await response.json();
        if(response.id){
            dispatch({type:"SET_TEMP_LINK_CREATED", payload: response.id});
        }
    } catch (error) {
        console.log("Error in handleTempLinkCreate fn", error);
        dispatch({type: 'SET_ERROR_IN_SETTINGS_MODAL', payload: 'Internal Server Error. Please try again later.'});
    } finally {
        setIsLoading(false);
    }
  }



  const handleViewAndCopy = () => {
    const tempLinkUrl = `${window.location.origin}/mytemplink?id=${settingsModalData.isTempLinkCreated}`;
    navigator.clipboard.writeText(tempLinkUrl);
    window.open(tempLinkUrl, '_blank');
  }

  const handleCancel = () => {
    dispatch({type: 'RESET_EVERYTHING'});
  }

  const handleCrossClick = () => {
    if(isTempLinkCreated){
      dispatch({type: 'RESET_EVERYTHING'});
    }
  }

  return (
    <dialog id='settings-modal' className='modal'>
      <div className='modal-box'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={handleCrossClick}>
            ✕
          </button>
        </form>
        <h3 className='font-bold text-lg'>Protection Settings</h3>
        {settingsModalData.error && <p className='text-red-500'>{settingsModalData.error}</p>}
        {isTempLinkCreated && <p className='text-green-500 text-xl'>Temp Link created successfully! 🎉</p>}
        <div className={`flex flex-col gap-8 pt-4 ${isTempLinkCreated && 'opacity-50 pointer-events-none'}`}>
          <div className='flex flex-col gap-1'>
            <label>Expires after</label>
            <select className='select select-bordered w-full' onChange={handleExpirySelection}>
              <option value='1-day' selected>1 day</option>
              <option value='2-day'>2 days</option>
              <option value='7-day'>7 days</option>
              <option value='30-day'>30 days</option>
              <option value='60-day'>60 days</option>
              <option value='365-day'>365 days</option>
              <option value='NEVER'>Never</option>
            </select>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex justify-between items-center'>
              <label>Enable Password Protection</label>
              <input type='checkbox' className='toggle' defaultChecked={false} onChange={handlePasswordToggle} />
            </div>
            <label className='input input-bordered flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 16 16'
                fill='currentColor'
                className='h-4 w-4 opacity-70'
              >
                <path
                  fillRule='evenodd'
                  d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
                  clipRule='evenodd'
                />
              </svg>
              <input type='password' className='grow' placeholder='Enter your password here' value={password.passwordValue} disabled={!password.passwordProtection} onChange={handleOnPasswordValueChange} />
            </label>
          </div>
        </div>
          <div className='flex justify-end gap-4 pt-6'>
            <form method='dialog'>
              <button className='btn btn-outline' onClick={handleCancel}>
                {
                  isTempLinkCreated ? 'Start Over': 'Cancel'
                }
              </button>
            </form>
            {
              !isTempLinkCreated ? (
                <button className='btn btn-primary' onClick={handleTempLinkCreate}>
              {isLoading ? <span className="loading loading-spinner"></span> : 'Create'}
            </button>
              ):(
                <button className='btn btn-primary' onClick={handleViewAndCopy}>
                  View & Copy Link
                </button>
              )
            }
          </div>
      </div>
    </dialog>
  )
}
