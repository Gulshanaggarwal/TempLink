"use client"
import { createContext, useContext, useReducer } from 'react';

const initialState = {
  files: [],
  isSettingsModalOpen: false,
  settingsModalData:{
    expiryTime: {
      time: 0,
      selectedOption: 'Never'
    },
    password:{
      passwordProtection: false,
      passwordValue: ''
    }
  }
};

const AppContext = createContext();

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

const ACTIONS = {
  SET_FILES: 'SET_FILES',
  TOGGLE_SETTINGS_MODAL: 'TOGGLE_SETTINGS_MODAL',
};

const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_FILES:
      return { ...state, files: action.payload };
    case ACTIONS.TOGGLE_SETTINGS_MODAL:
      return { ...state, isSettingsModalOpen: !state.isSettingsModalOpen };
    case 'SET_EXPIRY_TIME':
      return { ...state, settingsModalData: { ...state.settingsModalData, expiryTime: action.payload } };
    case "PASSWORD_PROTECTION_TOGGLE":
      return { ...state, settingsModalData: { ...state.settingsModalData, password: { ...state.settingsModalData.password, passwordProtection: action.payload} } };
    case "SET_PASSWORD":
      return { ...state, settingsModalData: { ...state.settingsModalData, password: { ...state.settingsModalData.password, passwordValue: action.payload} } };
    default:
      return state;
  }
};

export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
