"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppState } from '../contexts/AppStateContext';
import DecodeWithPassword from '../components/DecodeWithPassword';
import Custom404 from '../components/Custom404';
import ListFiles from '../components/ListFiles';
import AppLogo from '../components/AppLogo';



export default function Mytemplink() {
    const {state, dispatch} = useAppState();
    const {isLoading, isTempLinkValid, isExpired, isPasswordEnabled, isPasswordUnlocked, files} = state.myTemplinkPageData;
    const tempLinkId = useSearchParams().get('id');
    let component  ;


    useEffect(() => {
        const fetchData = async () => {
            try {

                const res = await fetch(`/api/templink?id=${tempLinkId}`);
                const data = await res.json();
                const payload = {...state.myTemplinkPageData}
                payload.isLoading = false;

                if(data.error === "LINK_EXPIRED"){
                    payload.isExpired = true;
                }
                else if(data.error == "PASSWORD_REQUIRED"){
                    payload.isPasswordEnabled = true;
                }
                else if(data.error){
                    payload.isTempLinkValid = false;
                }
                else {
                    payload.files = data.data.files;
                }

                dispatch({ type: 'SET_MY_TEMP_LINK_PAGE_DATA', payload });
            } catch (error) {
                console.error('Error: while fetching temp link data', error);
            }
        };

        fetchData();
    }, []);



    if(isLoading){
        component = <h1>Loading......</h1>
    }

    if(!isTempLinkValid){
        component = <Custom404/>
    }

    if(isExpired){
        component = <h1>Sorry, The Page has Expired 😞</h1>
    }

    if(isPasswordEnabled && !isPasswordUnlocked){
        component = <DecodeWithPassword tempLinkId={tempLinkId}/>
    }



    return (
        <div className='py-4'>
            {
                component ? component : <ListFiles tempLinkId={tempLinkId} files={files}/>
            }
        </div>
    );
}