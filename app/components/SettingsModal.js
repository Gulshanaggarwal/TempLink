import { useAppState } from "../contexts/AppStateContext";
import { MdClose } from "react-icons/md";
export default function SettingsModal(){

    const {state, dispatch} = useAppState();
    const {isSettingsModalOpen} = state;

    return isSettingsModalOpen && (
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center">
            <div class="bg-white p-4 rounded-lg w-96 h-auto">
                <div class ="relative">
                   <h2 class="font-bold text-2xl mb-4">Settings</h2>
                    <MdClose class="absolute top-2 right-2 cursor-pointer" onClick={() => dispatch({type: "TOGGLE_SETTINGS_MODAL"})}/>
                </div>
            </div>
        </div>
    )
}