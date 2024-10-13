import { useState } from "react";
import { useAppState } from "../contexts/AppStateContext";



export default function DecodeWithPassword({tempLinkId}) {

   const {state, dispatch} = useAppState();
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);


    const handleOnPasswordChange = e => {
        if(error){
            setError(null);
        }
        setPassword(e.target.value);
    }

    const handleGetAccess = async () => {
        const errorObj = {}
        try {
            
            setIsLoading(true);
            let response  = await fetch(`/api/templink?id=${tempLinkId}&password=${password}`);
            response  = await response.json();
            
            if(response.error){
                if(response.error === "PASSWORD_INCORRECT"){
                    errorObj.message = "Incorrect Password! Please try again.";
                }
                else if(response.error === "PASSWORD_REQUIRED"){
                    errorObj.message = "Password is required!";
                }
                else{
                    errorObj.message = "Internal Server Error! try again later";
                }

                return;
            }
            
            dispatch({ type: 'SET_MY_TEMP_LINK_PAGE_DATA', payload: {isPasswordUnlocked: true, files: response.data.files} });

        } catch (error) {
            console.error('Error: in handleGetAccess fn', error);
            errorObj.message = "Internal Server Error! try again later";
        } finally {

            if(Object.keys(errorObj).length > 0){
                setError(errorObj);
            }
            setIsLoading(false);
        }
    }


    return (
        <div
        data-dialog-backdrop="modal"
        data-dialog-backdrop-close="true"
        className="absolute top-0 left-0 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
      >
        <div
          data-dialog="modal"
          className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
        >
            <h1 className="text-red-400 font-bold text-xl">Password Required!</h1>
            <p className="pt-2 pb-16">Note: This Templink is password protected. Please enter the password to access the files.</p>

            <div className="flex flex-col gap-4">
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
                    <input id="password" type='password' className='grow block' placeholder="Please enter your password here" value={password} onChange={handleOnPasswordChange} />
                </label>
                <button className="btn btn-active btn-primary" onClick={handleGetAccess}>
                    {isLoading ? <span className="loading loading-spinner"></span> : "Get Access"}
                    </button>
                {error && <p className="text-red-400">{error.message}</p>}
            </div>
        </div>
      </div>
			
    )
}