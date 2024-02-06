"use client"

import { Price, ProductWithPrice } from "@/types";
import Button from "./Button";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { postData } from "@/libs/helpers";
import Modal from "./Modal";
import { getStripe } from "@/libs/stripeClient";
import useSubscriptionModal from "@/hooks/useSubscriptionModal";

interface SusbscribeModalProps{
  products: ProductWithPrice[]
}

const formatPrice = (price:Price)=>{
  const priceString = new Intl.NumberFormat('en-US',{
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,

  }).format((price?.unit_amount || 0)/100);
  
  return priceString;
}

const SusbscribeModal:React.FC<SusbscribeModalProps> = ({products}) =>{

  const susbscribeModal = useSubscriptionModal();
  const onChange = (open: boolean) =>{
    if(!open){
      susbscribeModal.onClose();
    }
  }

  const {user, isLoading, subscription} = useUser();
  const [priceIsLoading, setPriceIsLoading] = useState<string>();


  const handleCheckout = async(price:Price)=>{
    setPriceIsLoading(price.id);
    
    if(!user){
      setPriceIsLoading(undefined);
      return toast.error('Must be logged in');
    }
    if(subscription){
      console.log('suscribed');
      setPriceIsLoading(undefined);
      return toast('Already suscribed');
    }
    try{
      const {sessionId} = await postData({
        url: '/api/create-checkout-session',
        data: {price}
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({sessionId});

    }catch(error){
      toast.error((error as Error)?.message);

    }finally{
      setPriceIsLoading(undefined);
    }

  }

  let content = (
    <div className="text-center">
      No products available.
    </div>
  )

  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices && product.prices.length === 0) {
            return (
              <div key={product.id}>
                No prices available
              </div>
            );
          }

          return product.prices.map((price) => (
            <Button 
              key={price.id} 
              onClick={() => handleCheckout(price)}
              disabled={isLoading || price.id === priceIsLoading}
              className="mb-4"
            >
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button>
          ))
        })}
      </div>
    )
  }

  if (subscription) {
    content = (
      <div className="text-center">
        Already subscribed.
      </div>
    )
  }
  
  if(subscription){
    
    return(
      content= (
       <div className="text-center">
         Already subscribed!
       </div>
      )
    )
  }
  return(
    <Modal title="only for premium use"
    description="Listen to Music with Spotify Premium"
    isOpen={susbscribeModal.isOpen} onChange={onChange}>
      {content}
    </Modal>
  )
}

export default SusbscribeModal;