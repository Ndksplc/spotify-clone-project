"use client";
import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";


const UploadModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const {user} = useUser();
  const supabaseClient = useSupabaseClient();

  //Préparation du Formulaire avec useForm
  const {register, handleSubmit,reset} = useForm<FieldValues>({
    defaultValues:{
      author:'',
      title:'',
      song: null,
      image: null
    }
  });

  //Gestion de l'État du Modal à la Fermeture
  const onChange = (open: boolean) => {
    if (!open) {
     reset();
     uploadModal.onClose(); 
    }
  }
  //Traitement de la Soumission du Formulaire
  const onSubmit:SubmitHandler<FieldValues> = async (values)=>{
    // Upload to supabase
    try{

      setIsLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];
      if(!imageFile || !songFile || !user){
        toast.error('Missing files');
        return;
      }
      const uniqueID = uniqid();
      //Upload song
      const {
        data: songData,
        error: songError,

      } = await supabaseClient.storage.from('songs').upload(`song-${values.title}-${uniqueID}`, songFile,{cacheControl:'3600',upsert:false})
      if(songError){
        setIsLoading(false);
        return toast.error('Failed song upload');
      }
      //Upload Image
      const {
        data: imageData,
        error: imageError,

      } = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueID}`, imageFile,{cacheControl:'3600',upsert:false})
      if(imageError){
        setIsLoading(false);
        return toast.error('Failed image upload');
      }
      const {error: supabaseError} = await supabaseClient.from('songs').insert({user_id: user.id, 
        title: values.title,
        author: values.author,
        image_path: imageData.path,
        songs_path: songData.path
      });
      if(supabaseError){
        setIsLoading(false);
        return toast.error(supabaseError.message);

      }
      router.refresh();
      setIsLoading(false);
      toast.success('Song Listed successfully');
      reset();
      uploadModal.onClose();
    }catch(error){
      toast.error("Something went wrong");
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <Modal 
      title="Add a song" 
      description="Upload a mp3 file" 
      isOpen={uploadModal.isOpen} 
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input id="title" disabled={isLoading} {...register('title',{required: true})} placeholder="Song title"/>
        <Input id="author" disabled={isLoading} {...register('author',{required: true})} placeholder="Song author"/>
        <div>
          <div className="pb-1">
            Select a song file!
            
          </div>
          <Input id="song" type="file" accept=".mp3" disabled={isLoading} {...register('song',{required: true})}/> 
        </div>
        <div>
          <div className="pb-1">
            Select an image!
            
          </div>
          <Input id="image" type="file" accept="image/*" disabled={isLoading} {...register('image',{required: true})}/> 
        </div>
        <Button disabled={isLoading} type="submit">
          Create 
        </Button>
        
      </form>
    </Modal>
  );
}

export default UploadModal;
