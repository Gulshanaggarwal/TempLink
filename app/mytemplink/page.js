"use client"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ServerContent from "./ServerContent";


export default function Page(){

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [paramId, setParamId] = useState(null);


    useEffect(() => {
        if (id) {
          setParamId(id);
        }
      }, [id]);


    return paramId && (
        <ServerContent id={paramId}/>
    )
}