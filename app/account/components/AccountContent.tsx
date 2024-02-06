"use client";

import { useRouter } from "next/navigation";
import useSubscriptionModal from "@/hooks/useSubscriptionModal";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { postData } from "@/libs/helpers";
import toast from "react-hot-toast";
import Button from "@/components/Button";

const AccountContent= ()=>{

  const router= useRouter();
  const subscribeModal = useSubscriptionModal();
  const {isLoading,subscription,user} = useUser();
  const [loading, SetLoading] = useState(false);

  useEffect(()=>{
    if(!isLoading && !user){
      router.replace('/');
    }
  },[isLoading, user, router]);

  const redirectCustomerPortal = async () =>{
    SetLoading(true);
    try{
      const {url, error} = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);

    }catch(error){
      if(error)
      {
        toast.error((error as Error).message)
      }
    }
    SetLoading(false);
  }

  return(
    <div className="mb-7 px-6">
      {!subscription &&(<div className="flex flex-col gap-y-4 ">
        <p>
          No active plan
        </p>
        <Button onClick={subscribeModal.onOpen}
        className="w-[300px]"
        >
          Subcribe
        </Button>

        </div>
        )}

        {
        subscription &&
        (<div className="flex flex-col gap-y-4">
          <p>
            you are currently on the <b>{subscription?.prices?.products?.name}</b> plan
          </p>
          <Button 
          disabled={loading || isLoading}
          onClick={redirectCustomerPortal}
          className="w-[300px]">
            Open Customer Portal
          </Button>

        </div>)}

    </div>
  )
}

export default AccountContent;