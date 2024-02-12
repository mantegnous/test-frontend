import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AlertContext = createContext(null);

const SET_ALERT_DATA_ACTION = 'SET_ALERT_DATA';
const SET_VISIBILITY_ACTION = 'SET_VISIBILITY';
const RESET_ALERT_ACTION = 'RESET_ALERT';
const TRIGGER_ALERT_ACTION = 'TRIGGER_ALERT';

const alertReducer = (state, action) => {
    switch (action.type) {
        case SET_ALERT_DATA_ACTION:
            return {
                ...state,
                data: action.payload.data,
            };
        case SET_VISIBILITY_ACTION:
            return {
                ...state,
                isOpen: action.payload.isOpen,
            };
        case RESET_ALERT_ACTION:
            return {
                ...state,
                isOpen: false,
                data: {},
            };
        case TRIGGER_ALERT_ACTION:
            return {
                ...state,
                isOpen: true,
                data: action.payload,
            };
        default:
            return state;
    }
};

const AlertProvider = ({ children }) => {
    const initialState = {
        isOpen: false,
        data: {},
    };
    const [alert, dispatch] = useReducer(alertReducer, initialState);

    const closeAlert = useCallback(() => {
        dispatch({ type: SET_VISIBILITY_ACTION, payload: { isOpen: false } });
    }, []);

    const triggerAlert = useCallback(payload => {
        dispatch({ type: TRIGGER_ALERT_ACTION, payload });
    }, []);

    useEffect(() => {
        const { title, description, severity } = alert.data;
        if (alert.isOpen) {
            if (severity === 'success') {
                toast.success(description || title);
            } else if (severity === 'error') {
                toast.error(description || title);
            } else {
                toast.info(description || title);
            }
        }
    }, [alert]);

    return (
        <AlertContext.Provider
            value={{
                isAlertOpen: alert.isOpen,
                alertData: alert.data,
                closeAlert,
                triggerAlert,
            }}
        >
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
        </AlertContext.Provider>
    );
};

export default AlertProvider;
