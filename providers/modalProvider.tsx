"use client";

import AuthModal from "@/components/AuthModal";
import SusbscribeModal from "@/components/SubscribeModal";
import UploadModal from "@/components/UploadModal";
import { ProductWithPrice } from "@/types";
import { useEffect, useState } from "react";

interface modalProviderProps{
  products: ProductWithPrice[]
}

const ModalProvider:React.FC<modalProviderProps> = ({products}) => {
  const [isMounted, setIsMounted]=useState(false);
  useEffect(()=>{
    setIsMounted(true);
  },[]);
  if(!isMounted){
    return null;
  }
  return (
    <>
    <AuthModal/>
    <UploadModal/>
    <SusbscribeModal products={products}/>
    </>
  )
}

export default ModalProvider;