import { create } from "zustand";
interface AuthModalStore{
  isOpen: boolean;
  onOpen: ()=>void;
  onClose: ()=>void;
};

const useSubscriptionModal=create<AuthModalStore>((set)=>({
  isOpen: false,
  onOpen: () => set({isOpen:true}),
  onClose: () => set({isOpen:false})

}));
export default useSubscriptionModal;