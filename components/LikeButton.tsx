"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from "react-hot-toast";

interface LikeButtonProps{
  songId: string;
}

const LikeButton:React.FC<LikeButtonProps> = ({songId}) =>{
  const router = useRouter();
  const {supabaseClient} = useSessionContext();
  const authModal = useAuthModal();
  const user = useUser();
  const [isLike, setIsLike] = useState(false);

  useEffect(()=>{
    if(!user?.id){
      return;
    }

    const fetchData = async ()=> {
      const {data, error} = await supabaseClient.from('liked_songs').select('*').eq('user_id',user.id).eq('songs_id',songId).single();
      if(!error && data){
        setIsLike(true);
      }
      
    };
    fetchData();

  },[songId,supabaseClient, user?.id]);

  const Icon = isLike? AiFillHeart:AiOutlineHeart;

  const handleLike = async () =>{
    if(!user){
      return authModal.onOpen();
    }
    if(isLike){
      const {error} = await supabaseClient.from('liked_songs').delete().eq('user_id',user.id).eq('songs_id',songId);
      if(error){
        toast(error.message)
      }else{setIsLike(false);}
  }else{
    const {error} = await supabaseClient.from('liked_songs').insert({
      songs_id: songId,
      user_id: user.id,
    });
    if(error){
      toast(error.message)
    }else{
      setIsLike(true);
      toast.success('Liked');
    }
    
  }
  router.refresh();
}
  

  return (
    <button onClick={handleLike} className="hover:opacity-75 transition">
      <Icon color ={isLike?'#22c55e':'white'}/>
    </button>
  )
}

export default LikeButton;