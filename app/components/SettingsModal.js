import { useAppState } from '../contexts/AppStateContext'
import { MdClose } from 'react-icons/md'
export default function SettingsModal () {

  const { state, dispatch } = useAppState()
  const { files,isSettingsModalOpen } = state


  const handleExpirySelection = e => {
    const value = e.target.value;
    const obj = {};
    switch(value){
       case 'Never':
            obj.time = '';
            obj.selectedOption = value;
            break;
        case '1-day':
            obj.time = new Date().getTime() + 86400000;
            obj.selectedOption = value;
            break;
        case '2-day':
            obj.time = new Date().getTime() + 172800000;
            obj.selectedOption = value;
            break;
        case '7-day':
            obj.time = new Date().getTime() + 604800000;
            obj.selectedOption = value;
            break;
        case '30-day':
            obj.time = new Date().getTime() + 2592000000;
            obj.selectedOption = value;
            break;
        case '60-day':
            obj.time = new Date().getTime() + 5184000000;
            obj.selectedOption = value;
            break;
        case '365-day':
            obj.time = new Date().getTime() + 31536000000;
            obj.selectedOption = value;
            break;
        default:
            obj.time = '';
            obj.selectedOption = value;
            break
    }
    dispatch({ type: 'SET_EXPIRY_TIME', payload: obj });
  }

  const handlePasswordToggle = e => {
    dispatch({ type: 'PASSWORD_PROTECTION_TOGGLE', payload: e.target.checked});
  }

  const handlePasswordFieldChange = e => {
    dispatch({ type: 'SET_PASSWORD', payload: e.target.value});
  }

  const handleOnPasswordValueChange = e => {
    dispatch({ type: 'SET_PASSWORD', payload: e.target.value.trim()});
  }

  const handleTempLinkCreate = async() => {
    try {

        const formData = new FormData();
        files.forEach((file,index) => {
            formData.append('files', file);
        })
       
        formData.append('settings', JSON.stringify(state.settingsModalData));

        let  response = await fetch('/api/files', {
            method: 'POST',
            body: formData
        })

        response = await response.json();
        console.log(response);

        

    } catch (error) {
        console.log("Error in handleTempLinkCreate fn", error);
    } 
  }

  return (
    <dialog id='settings-modal' className='modal'>
      <div className='modal-box'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            ✕
          </button>
        </form>
        <h3 className='font-bold text-lg'>Settings</h3>
        <div className='flex flex-col gap-8 pt-4'>
          <div className='flex flex-col gap-1'>
            <label>Expire TempLink After</label>
            <select className='select select-bordered w-full' onChange={handleExpirySelection}>
              <option disabled selected>
                Select expiry time
              </option>
              <option value='Never'>Never</option>
              <option value='1-day'>1 day</option>
              <option value='2-day'>2 days</option>
              <option value='7-day'>7 days</option>
              <option value='30-day'>30 days</option>
              <option value='60-day'>60 days</option>
              <option value='365-day'>365 days</option>
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
              <input type='password' className='grow' value='password' onChange={handleOnPasswordValueChange} />
            </label>
          </div>
          <div className='flex justify-end gap-4 pt-6'>
            <form method='dialog'>
              <button className='btn btn-outline'>Cancel</button>
            </form>
            <button className='btn btn-primary' onClick={handleTempLinkCreate}>
              Create now!
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
