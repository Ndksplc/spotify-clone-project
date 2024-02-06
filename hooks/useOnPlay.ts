import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";
import useSubscriptionModal from "./useSubscriptionModal";

const useOnPlay = (songs:Song[])=>{
  
  const susbscriptionModal = useSubscriptionModal(); 
  const player = usePlayer();
  const autModal = useAuthModal();
  const {user, subscription} = useUser();
  const onPlay = (id: string)=>{
    if(!user){
        return autModal.onOpen();
      }
    if(!subscription){
      return susbscriptionModal.onOpen();
    }
      player.setId(id);
      player.setIds(songs.map((song)=>song.id))

      

  }
  return onPlay;


};

export default useOnPlay;